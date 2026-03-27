import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { assetPacks, templates } from '../data/mockData';
import { useAppState } from '../state/AppStateContext';
import type { CreateProjectInput } from '../types';
import { PageFrame, SectionCard } from './shared';

export function ProjectsPage() {
  const { createProject, projects, setActiveProjectId } = useAppState();
  const [query, setQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState<CreateProjectInput>({
    name: '',
    templateId: templates[0].id,
    assetPackId: assetPacks[0].id,
    orientation: 'Portrait'
  });

  const filteredProjects = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return projects;
    }

    return projects.filter((project) =>
      [project.name, project.templateName, project.assetPackName, project.owner]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }, [projects, query]);

  const canCreate = draft.name.trim().length > 1;

  function handleCreateProject() {
    if (!canCreate) {
      return;
    }

    createProject(draft);
    setDraft({
      name: '',
      templateId: templates[0].id,
      assetPackId: assetPacks[0].id,
      orientation: 'Portrait'
    });
    setIsCreateOpen(false);
  }

  return (
    <PageFrame
      title="Projects"
      description="Create, duplicate, filter, and manage playable projects and their versions."
      inspector={
        <>
          <h3>Project Filters</h3>
          <div className="stack-list">
            <div className="filter-chip">Template: All</div>
            <div className="filter-chip">Status: Active</div>
            <div className="filter-chip">View: Grid</div>
          </div>
        </>
      }
    >
      <SectionCard title="Production Projects" eyebrow="Library">
        <div className="toolbar">
          <input
            className="text-input"
            placeholder="Search projects"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="ghost-button">Template</button>
          <button className="ghost-button">Status</button>
          <button className="primary-button" onClick={() => setIsCreateOpen(true)}>Create Project</button>
        </div>

        <div className="project-grid">
          {filteredProjects.map((project) => (
            <Link
              className="project-card"
              key={project.id}
              to={`/projects/${project.id}/overview`}
              onClick={() => setActiveProjectId(project.id)}
            >
              <div className="project-card-top">
                <div>
                  <p className="eyebrow">{project.templateName}</p>
                  <h3>{project.name}</h3>
                </div>
                <span className={`status-pill ${project.buildStatus.toLowerCase()}`}>{project.buildStatus}</span>
              </div>
              <div className="project-meta">
                <span>{project.assetPackName}</span>
                <span>{project.orientation}</span>
                <span>{project.owner}</span>
                <span>{project.updatedAt}</span>
              </div>
              <div className="project-footer">
                <span>{project.currentVersion}</span>
                <span>{project.versionCount} versions</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>

      {isCreateOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">Create New Playable</p>
            <h3>New Project</h3>
            <p className="page-description">Choose a built-in template, asset pack, and starting orientation to generate a new editable project.</p>
            <div className="form-grid">
              <label className="field wide">
                <span>Project Name</span>
                <input
                  className="text-input"
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Enter project name"
                />
              </label>
              <label className="field">
                <span>Template</span>
                <select
                  className="text-input"
                  value={draft.templateId}
                  onChange={(event) => setDraft((current) => ({ ...current, templateId: event.target.value }))}
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Asset Pack</span>
                <select
                  className="text-input"
                  value={draft.assetPackId}
                  onChange={(event) => setDraft((current) => ({ ...current, assetPackId: event.target.value }))}
                >
                  {assetPacks.map((pack) => (
                    <option key={pack.id} value={pack.id}>{pack.name}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Orientation</span>
                <select
                  className="text-input"
                  value={draft.orientation}
                  onChange={(event) => setDraft((current) => ({ ...current, orientation: event.target.value as CreateProjectInput['orientation'] }))}
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setIsCreateOpen(false)}>Cancel</button>
              <button className="primary-button" onClick={handleCreateProject} disabled={!canCreate}>Create Project</button>
            </div>
          </div>
        </div>
      ) : null}
    </PageFrame>
  );
}
