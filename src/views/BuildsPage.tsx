import { builds } from '../data/mockData';
import { PageFrame, SectionCard } from './shared';

export function BuildsPage() {
  return (
    <PageFrame
      title="Builds"
      description="Validate, package, inspect logs, and download artifacts for ad-network-ready exports."
      inspector={
        <>
          <h3>Build Actions</h3>
          <div className="stack-list">
            <button className="primary-button">Run Build</button>
            <button className="ghost-button">Select Preset</button>
            <button className="ghost-button">Download Latest</button>
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
                <p>{build.preset} • {build.createdAt}</p>
                <p>{build.logSummary}</p>
              </div>
              <div className="build-meta">
                <span className={`status-pill ${build.status.toLowerCase()}`}>{build.status}</span>
                <span>{build.artifactSize}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageFrame>
  );
}
