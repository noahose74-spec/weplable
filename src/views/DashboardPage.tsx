import { builds, projects, templates } from '../data/mockData';
import { PageFrame, SectionCard } from './shared';

export function DashboardPage() {
  return (
    <PageFrame
      title="Dashboard"
      description="An operational snapshot of active playable production, build health, and reusable systems."
      inspector={
        <>
          <h3>Health Summary</h3>
          <div className="stack-list">
            <div className="inspector-row"><span>Open warnings</span><strong>3</strong></div>
            <div className="inspector-row"><span>Failed builds</span><strong>1</strong></div>
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
                <span className={`status-pill ${project.buildStatus.toLowerCase()}`}>{project.buildStatus}</span>
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
            <div className="metric-card"><strong>14</strong><span>Match-3 projects</span></div>
            <div className="metric-card"><strong>8</strong><span>Merge projects</span></div>
            <div className="metric-card"><strong>6</strong><span>Reskinned this week</span></div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" eyebrow="Flow">
          <div className="action-row">
            <button className="primary-button">Create Project</button>
            <button className="ghost-button">Open Preview</button>
            <button className="ghost-button">Review Builds</button>
          </div>
        </SectionCard>
      </div>
    </PageFrame>
  );
}
