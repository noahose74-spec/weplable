import { Link, useNavigate } from 'react-router-dom';
import { getTemplateRegistry } from '../plugins/templateRegistry';
import { useAppState } from '../state/AppStateContext';
import { PageFrame, SectionCard } from './shared';

export function DashboardView() {
  const navigate = useNavigate();
  const { builds, projects, setActiveProjectId } = useAppState();
  const templates = getTemplateRegistry();

  return (
    <PageFrame
      title="Dashboard"
      description="An operational snapshot of active playable production, build health, and reusable systems."
      inspector={
        <>
          <h3>Health Summary</h3>
          <div className="stack-list">
            <div className="inspector-row"><span>Open warnings</span><strong>3</strong></div>
            <div className="inspector-row"><span>Failed builds</span><strong>{builds.filter((build) => build.status === 'Failed').length}</strong></div>
            <div className="inspector-row"><span>Templates in use</span><strong>{templates.length}</strong></div>
          </div>
        </>
      }
    >
      <div className="bento-grid">
        <SectionCard title="Recent Projects" eyebrow="Production">
          <div className="stack-list">
            {projects.slice(0, 3).map((project) => (
              <div className="list-row" key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <p>{project.templateName} • {project.assetPackName}</p>
                </div>
                <Link
                  className={`status-pill ${project.buildStatus.toLowerCase()}`}
                  to={`/projects/${project.id}/overview`}
                  onClick={() => setActiveProjectId(project.id)}
                >
                  {project.buildStatus}
                </Link>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Builds" eyebrow="Builds">
          <div className="stack-list">
            {builds.slice(0, 3).map((build) => (
              <div className="list-row" key={build.id}>
                <div>
                  <strong>{build.projectName}</strong>
                  <p>{build.preset} • {build.createdAt}</p>
                </div>
                <span className={`status-pill ${build.status.toLowerCase()}`}>{build.status}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Template Usage" eyebrow="Templates">
          <div className="metric-grid">
            <div className="metric-card">
              <strong>{projects.filter((project) => project.templateId === 'match3-classic').length}</strong>
              <span>Match-3 projects</span>
            </div>
            <div className="metric-card">
              <strong>{projects.filter((project) => project.templateId === 'merge2-order').length}</strong>
              <span>Merge projects</span>
            </div>
            <div className="metric-card">
              <strong>{projects.length}</strong>
              <span>Total active projects</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" eyebrow="Flow">
          <div className="action-row">
            <button className="primary-button" onClick={() => navigate('/projects')}>Create Project</button>
            <button className="ghost-button" onClick={() => navigate('/preview')}>Open Preview</button>
            <button className="ghost-button" onClick={() => navigate('/builds')}>Review Builds</button>
          </div>
        </SectionCard>
      </div>
    </PageFrame>
  );
}
