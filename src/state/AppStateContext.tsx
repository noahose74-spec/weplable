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
  getProjectById: (projectId: string) => Project | undefined;
  getTabFields: (projectId: string, tab: string) => EditorFieldDefinition[];
  updateTabFields: (projectId: string, tab: string, fields: EditorFieldDefinition[]) => void;
  getValidationIssues: (projectId: string) => ValidationIssue[];
  runBuild: (projectId: string) => Build | undefined;
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

function createInitialState(): PersistedState {
  const drafts = Object.fromEntries(
    initialProjects.map((project) => [project.id, createDraftMap()])
  );

  return {
    projects: initialProjects,
    builds: initialBuilds,
    activeProjectId: initialProjects[0]?.id ?? '',
    selectedPresetName: exportPresets.find((preset) => preset.name === 'Meta')?.name ?? exportPresets[0].name,
    drafts
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
    return parsed;
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
          [project.id]: createDraftMap()
        }
      }));
      return project;
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
            ...(current.drafts[projectId] ?? createDraftMap()),
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
      const build: Build = {
        id: `build-${Date.now()}`,
        projectName: project.name,
        preset: state.selectedPresetName,
        status: hasError ? 'Failed' : 'Success',
        createdAt: 'Just now',
        artifactSize: hasError ? '-' : '3.4 MB',
        logSummary: hasError
          ? issues.filter((issue) => issue.severity === 'error').map((issue) => issue.message).join(' ')
          : 'Validation passed. Package generated successfully.'
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
