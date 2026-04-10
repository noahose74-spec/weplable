import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import {
  createMockProject,
  builds as initialBuilds,
  editorFieldsByTab,
  exportPresets,
  projects as initialProjects
} from '../data/mockData';
import { validateProject } from '../engines/validation';
import { createGoblinArtifact, createGoblinDraftSeed, isGoblinProject } from '../features/goblinPlayable';
import type { Build, CreateProjectInput, EditorFieldDefinition, Project, ValidationIssue } from '../types';

type TabDraftMap = Record<string, EditorFieldDefinition[]>;

interface AppStateValue {
  projects: Project[];
  builds: Build[];
  activeProjectId: string;
  selectedPresetName: string;
  setActiveProjectId: (projectId: string) => void;
  setSelectedPresetName: (presetName: string) => void;
  createProject: (input: CreateProjectInput) => Project;
  updateProjectMeta: (projectId: string, patch: Partial<Pick<Project, 'name' | 'orientation' | 'updatedAt'>>) => void;
  getProjectById: (projectId: string) => Project | undefined;
  getTabFields: (projectId: string, tab: string) => EditorFieldDefinition[];
  updateTabFields: (projectId: string, tab: string, fields: EditorFieldDefinition[]) => void;
  getValidationIssues: (projectId: string) => ValidationIssue[];
  runBuild: (projectId: string) => Build | undefined;
  downloadLatestBuild: (projectId: string) => boolean;
}

interface PersistedState {
  projects: Project[];
  builds: Build[];
  activeProjectId: string;
  selectedPresetName: string;
  drafts: Record<string, TabDraftMap>;
}

const STORAGE_KEY = 'weplable-app-state';

const AppStateContext = createContext<AppStateValue | null>(null);

function cloneFieldSet(fields: EditorFieldDefinition[]) {
  return fields.map((field) => ({
    ...field,
    options: field.options ? [...field.options] : undefined
  }));
}

function createDraftMap(): TabDraftMap {
  return Object.fromEntries(
    Object.entries(editorFieldsByTab).map(([tab, fields]) => [tab, cloneFieldSet(fields)])
  );
}

function createDraftMapForProject(project: Project): TabDraftMap {
  if (isGoblinProject(project)) {
    const seededDrafts = createGoblinDraftSeed(project);
    return Object.fromEntries(
      Object.entries(seededDrafts).map(([tab, fields]) => [tab, cloneFieldSet(fields)])
    );
  }

  return createDraftMap();
}

function createInitialState(): PersistedState {
  const drafts = Object.fromEntries(
    initialProjects.map((project) => [project.id, createDraftMapForProject(project)])
  );

  return {
    projects: initialProjects,
    builds: initialBuilds,
    activeProjectId: initialProjects[0]?.id ?? '',
    selectedPresetName: exportPresets.find((preset) => preset.name === 'Meta')?.name ?? exportPresets[0].name,
    drafts
  };
}

function mergeStoredState(parsed: PersistedState): PersistedState {
  const mergedProjects = [...parsed.projects];

  initialProjects.forEach((project) => {
    const existingIndex = mergedProjects.findIndex((item) => item.id === project.id);
    if (existingIndex === -1) {
      mergedProjects.push(project);
      return;
    }

    if (project.id === 'goblin-demo') {
      mergedProjects[existingIndex] = {
        ...mergedProjects[existingIndex],
        livePreviewPath: project.livePreviewPath,
        notes: project.notes,
        orientation: project.orientation,
        assetPackId: project.assetPackId,
        assetPackName: project.assetPackName
      };
    }
  });

  const mergedDrafts = { ...parsed.drafts };
  mergedProjects.forEach((project) => {
    if (!mergedDrafts[project.id]) {
      mergedDrafts[project.id] = createDraftMapForProject(project);
    }
  });

  const activeProjectExists = mergedProjects.some((project) => project.id === parsed.activeProjectId);

  return {
    projects: mergedProjects,
    builds: parsed.builds?.length ? parsed.builds : initialBuilds,
    activeProjectId: activeProjectExists ? parsed.activeProjectId : mergedProjects[0]?.id ?? '',
    selectedPresetName: parsed.selectedPresetName || exportPresets.find((preset) => preset.name === 'Meta')?.name || exportPresets[0].name,
    drafts: mergedDrafts
  };
}

function readStoredState(): PersistedState {
  if (typeof window === 'undefined') {
    return createInitialState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return mergeStoredState(parsed);
  } catch {
    return createInitialState();
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => readStoredState());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AppStateValue>(() => ({
    projects: state.projects,
    builds: state.builds,
    activeProjectId: state.activeProjectId,
    selectedPresetName: state.selectedPresetName,
    setActiveProjectId: (projectId) => {
      setState((current) => ({ ...current, activeProjectId: projectId }));
    },
    setSelectedPresetName: (presetName) => {
      setState((current) => ({ ...current, selectedPresetName: presetName }));
    },
    createProject: (input) => {
      const project = createMockProject(input);
      setState((current) => ({
          ...current,
          projects: [project, ...current.projects],
          activeProjectId: project.id,
          drafts: {
            ...current.drafts,
            [project.id]: createDraftMapForProject(project)
          }
        }));
      return project;
    },
    updateProjectMeta: (projectId, patch) => {
      setState((current) => ({
        ...current,
        projects: current.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                ...patch
              }
            : project
        )
      }));
    },
    getProjectById: (projectId) => state.projects.find((project) => project.id === projectId),
    getTabFields: (projectId, tab) => {
      return state.drafts[projectId]?.[tab]
        ? cloneFieldSet(state.drafts[projectId][tab])
        : cloneFieldSet(editorFieldsByTab[tab] ?? editorFieldsByTab.overview);
    },
    updateTabFields: (projectId, tab, fields) => {
      setState((current) => ({
        ...current,
        drafts: {
          ...current.drafts,
          [projectId]: {
            ...(current.drafts[projectId] ?? createDraftMapForProject(current.projects.find((project) => project.id === projectId) ?? initialProjects[0])),
            [tab]: cloneFieldSet(fields)
          }
        }
      }));
    },
    getValidationIssues: (projectId) => {
      const project = state.projects.find((item) => item.id === projectId);
      if (!project) {
        return [];
      }

      return validateProject(project, state.drafts[projectId] ?? createDraftMap(), state.selectedPresetName);
    },
    runBuild: (projectId) => {
      const project = state.projects.find((item) => item.id === projectId);
      if (!project) {
        return undefined;
      }

      const issues = validateProject(project, state.drafts[projectId] ?? createDraftMap(), state.selectedPresetName);
      const hasError = issues.some((issue) => issue.severity === 'error');
      const drafts = state.drafts[projectId] ?? createDraftMapForProject(project);
      const artifact = !hasError && isGoblinProject(project)
        ? createGoblinArtifact(project, drafts, state.selectedPresetName)
        : undefined;
      const build: Build = {
        id: `build-${Date.now()}`,
        projectId,
        projectName: project.name,
        preset: state.selectedPresetName,
        status: hasError ? 'Failed' : 'Success',
        createdAt: 'Just now',
        artifactSize: hasError ? '-' : artifact?.artifactSize ?? '3.4 MB',
        logSummary: hasError
          ? issues.filter((issue) => issue.severity === 'error').map((issue) => issue.message).join(' ')
          : 'Validation passed. Package generated successfully.',
        artifactName: artifact?.artifactName,
        artifactUrl: artifact?.artifactUrl
      };

      setState((current) => ({
        ...current,
        builds: [build, ...current.builds],
        projects: current.projects.map((item) =>
          item.id === projectId
            ? {
                ...item,
                buildStatus: hasError ? 'Failed' : 'Success',
                updatedAt: 'Just now'
              }
            : item
        )
      }));

      return build;
    },
    downloadLatestBuild: (projectId) => {
      const latestBuild = state.builds.find((build) => build.projectId === projectId && build.status === 'Success' && build.artifactUrl);
      if (!latestBuild?.artifactUrl) {
        return false;
      }

      const link = document.createElement('a');
      link.href = latestBuild.artifactUrl;
      link.download = latestBuild.artifactName ?? `${latestBuild.projectName}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    }
  }), [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return value;
}
