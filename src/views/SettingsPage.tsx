import { PageFrame, SectionCard } from './shared';

export function SettingsPage() {
  return (
    <PageFrame
      title="Settings"
      description="Workspace preferences and export preset administration for the MVP environment."
      inspector={
        <>
          <h3>Environment</h3>
          <div className="stack-list">
            <div className="inspector-row"><span>Theme</span><strong>Dark Neutral</strong></div>
            <div className="inspector-row"><span>Presets</span><strong>7 active</strong></div>
          </div>
        </>
      }
    >
      <div className="stack-panels">
        <SectionCard title="General Preferences" eyebrow="Workspace">
          <div className="form-grid">
            <label className="field">
              <span>Default landing page</span>
              <select className="text-input" defaultValue="dashboard">
                <option value="dashboard">Dashboard</option>
                <option value="projects">Projects</option>
              </select>
            </label>
            <label className="field">
              <span>Compact sidebar</span>
              <button className="toggle">Off</button>
            </label>
          </div>
        </SectionCard>
      </div>
    </PageFrame>
  );
}
