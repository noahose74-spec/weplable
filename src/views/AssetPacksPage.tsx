import { assetPacks } from '../data/mockData';
import { PageFrame, SectionCard } from './shared';

export function AssetPacksPage() {
  return (
    <PageFrame
      title="Asset Packs"
      description="Manage reusable visual, audio, and interface bundles for fast reskinning."
      inspector={
        <>
          <h3>Dependency Health</h3>
          <div className="stack-list">
            <div className="inspector-row"><span>Healthy packs</span><strong>1</strong></div>
            <div className="inspector-row"><span>Warnings</span><strong>1</strong></div>
          </div>
        </>
      }
    >
      <div className="project-grid">
        {assetPacks.map((pack) => (
          <SectionCard key={pack.id} title={pack.name} eyebrow={`v${pack.version}`}>
            <div className="asset-preview">{pack.previewImage}</div>
            <div className="chip-row">
              {pack.categories.map((item) => (
                <span key={item} className="filter-chip">{item}</span>
              ))}
            </div>
            <div className="project-footer">
              <span>{pack.linkedProjectCount} linked projects</span>
              <span>{pack.dependencyStatus}</span>
            </div>
          </SectionCard>
        ))}
      </div>
    </PageFrame>
  );
}
