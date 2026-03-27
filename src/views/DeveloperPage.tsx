import { PageFrame, SectionCard } from './shared';

export function DeveloperPage() {
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
    </PageFrame>
  );
}
