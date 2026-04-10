import { exportPresets } from '../data/mockData';
import { useAppState } from '../state/AppStateContext';
import { PageFrame, SectionCard } from './shared';

export function BuildsView() {
  const {
    builds,
    activeProjectId,
    getProjectById,
    selectedPresetName,
    setSelectedPresetName,
    runBuild,
    getValidationIssues,
    downloadLatestBuild
  } = useAppState();
  const activeProject = getProjectById(activeProjectId);
  const issues = getValidationIssues(activeProjectId);

  return (
    <PageFrame
      title="Builds"
      description="Validate, package, inspect logs, and download artifacts for ad-network-ready exports."
      inspector={
        <>
          <h3>Build Actions</h3>
          <div className="stack-list">
            <select
              className="text-input"
              value={selectedPresetName}
              onChange={(event) => setSelectedPresetName(event.target.value)}
            >
              {exportPresets.map((preset) => (
                <option key={preset.id} value={preset.name}>{preset.name}</option>
              ))}
            </select>
            <button className="primary-button" onClick={() => runBuild(activeProjectId)}>Run Build</button>
            <button className="ghost-button" onClick={() => downloadLatestBuild(activeProjectId)}>Download Latest</button>
            <div className={`validation-box ${issues.some((issue) => issue.severity === 'error') ? 'error' : 'warning'}`}>
              {activeProject ? `${activeProject.name} has ${issues.length} current validation issue(s).` : 'No active project selected.'}
            </div>
          </div>
        </>
      }
    >
      <SectionCard title="Build Queue and History" eyebrow="Artifacts">
        <div className="stack-list">
          {builds.map((build) => (
            <div className="build-row" key={build.id}>
              <div>
                <strong>{build.projectName}</strong>
                <p>{build.preset} - {build.createdAt}</p>
                <p>{build.logSummary}</p>
              </div>
              <div className="build-meta">
                <span className={`status-pill ${build.status.toLowerCase()}`}>{build.status}</span>
                <span>{build.artifactSize}</span>
                {build.artifactUrl ? (
                  <button className="ghost-button" onClick={() => downloadLatestBuild(build.projectId ?? activeProjectId)}>Download</button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageFrame>
  );
}
