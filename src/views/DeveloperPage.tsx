import { useNavigate } from 'react-router-dom';
import { externalPlayables } from '../data/externalPlayables';
import { useAppState } from '../state/AppStateContext';
import { PageFrame, SectionCard } from './shared';

export function DeveloperPage() {
  const navigate = useNavigate();
  const { importExternalPlayable, projects } = useAppState();

  function handleImportPlayable(candidateId: string) {
    const project = importExternalPlayable(candidateId);
    if (project) {
      navigate(`/projects/${project.id}/overview`);
    }
  }

  return (
    <PageFrame
      title="Developer Center"
      description="Scaffold, inspect, validate, and register template plugins without disturbing creator workflows."
      inspector={
        <>
          <h3>Registry Health</h3>
          <div className="stack-list">
            <div className="inspector-row"><span>Plugin registry</span><strong>Healthy</strong></div>
            <div className="inspector-row"><span>Compatibility checks</span><strong>2 ready</strong></div>
            <div className="inspector-row"><span>External candidates</span><strong>{externalPlayables.length}</strong></div>
          </div>
        </>
      }
    >
      <div className="bento-grid">
        <SectionCard title="Template Registry" eyebrow="Plugins">
          <p className="page-description">Manage built-in and future custom template plugins through a stable registry contract.</p>
        </SectionCard>
        <SectionCard title="Create Template Scaffold" eyebrow="Scaffold">
          <p className="page-description">Generate starter manifest, config schema, editor schema, preview hooks, and seed project definitions.</p>
        </SectionCard>
        <SectionCard title="Validation Runner" eyebrow="Checks">
          <p className="page-description">Run schema, asset requirement, and export compatibility checks before registration.</p>
        </SectionCard>
        <SectionCard title="Developer Docs" eyebrow="Docs">
          <p className="page-description">Keep plugin contracts, sample implementations, and compatibility rules discoverable in-product.</p>
        </SectionCard>
      </div>

      <div className="stack-panels section-spacer">
        <SectionCard title="Import External Playable" eyebrow="Local Registry">
          <p className="page-description">
            Register playable folders that were copied into <code>public/playables</code>. Static exports can be previewed immediately; source projects show health diagnostics until a runnable artifact is provided.
          </p>
          <div className="stack-list import-list">
            {externalPlayables.map((candidate) => {
              const projectId = `import-${candidate.id}`;
              const alreadyImported = projects.some((project) => project.id === projectId);

              return (
                <div className="import-card" key={candidate.id}>
                  <div>
                    <div className="project-card-top">
                      <div>
                        <p className="eyebrow">{candidate.folderName}</p>
                        <h3>{candidate.name}</h3>
                      </div>
                      <span className={`status-pill ${candidate.status === 'Ready' ? 'ready' : 'failed'}`}>{candidate.status}</span>
                    </div>
                    <p className="page-description">{candidate.sourcePath}</p>
                    <div className="chip-row">
                      <span className="filter-chip">{candidate.templateName}</span>
                      <span className="filter-chip">{candidate.orientation}</span>
                      <span className="filter-chip">{candidate.runtimePath}</span>
                    </div>
                    {candidate.healthIssues.map((issue) => (
                      <div key={issue} className="validation-box warning">{issue}</div>
                    ))}
                  </div>
                  <div className="modal-actions">
                    <button className="ghost-button" onClick={() => window.open(candidate.runtimePath, '_blank')}>Open Runtime</button>
                    <button className="primary-button" onClick={() => handleImportPlayable(candidate.id)}>
                      {alreadyImported ? 'Open Project' : 'Register Project'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </PageFrame>
  );
}
