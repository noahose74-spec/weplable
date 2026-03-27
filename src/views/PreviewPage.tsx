import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { PageFrame, SectionCard } from './shared';

export function PreviewPage() {
  const { activeProjectId, getProjectById, getTabFields, getValidationIssues, selectedPresetName } = useAppState();
  const project = getProjectById(activeProjectId);
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>(project?.orientation === 'Landscape' ? 'Landscape' : 'Portrait');
  const gameplayFields = useMemo(() => getTabFields(activeProjectId, 'gameplay'), [activeProjectId, getTabFields]);
  const endCardFields = useMemo(() => getTabFields(activeProjectId, 'end-card'), [activeProjectId, getTabFields]);
  const tutorialFields = useMemo(() => getTabFields(activeProjectId, 'tutorial'), [activeProjectId, getTabFields]);
  const issues = getValidationIssues(activeProjectId);

  const boardField = gameplayFields.find((field) => field.id === 'board-size');
  const goalField = gameplayFields.find((field) => field.id === 'goal-summary');
  const tutorialCountField = tutorialFields.find((field) => field.id === 'tutorial-step-count');
  const ctaField = endCardFields.find((field) => field.id === 'cta-copy');

  return (
    <PageFrame
      title="Preview"
      description="Instant QA surface for playable runtime, safe areas, warnings, and tutorial/end card jumping."
      inspector={
        <>
          <h3>Preview Controls</h3>
          <div className="stack-list">
            <button className="ghost-button" onClick={() => setOrientation('Portrait')}>Portrait</button>
            <button className="ghost-button" onClick={() => setOrientation('Landscape')}>Landscape</button>
            <button className="ghost-button">Restart</button>
            <button className="ghost-button">Jump to Tutorial</button>
            <button className="ghost-button">Jump to End Card</button>
            <div className="validation-box warning">
              {project ? `${project.name} is linked live to editor state with ${selectedPresetName}.` : 'No active project selected.'}
            </div>
            {issues.slice(0, 2).map((issue) => (
              <div key={issue.id} className={`validation-box ${issue.severity === 'error' ? 'error' : 'warning'}`}>
                {issue.message}
              </div>
            ))}
          </div>
        </>
      }
    >
      <SectionCard title="Live Playable Frame" eyebrow="QA">
        <div className="preview-stage">
          <div className={`preview-device ${orientation.toLowerCase()}`}>
            <div className="preview-safe-area" />
            <div className="preview-content">
              <span className="status-pill ready">Preview Ready</span>
              <h3>{project?.name ?? 'No Project Selected'}</h3>
              <p>{project?.templateName ?? 'Select a project from Projects to begin previewing.'}</p>
              <div className="preview-stat-grid">
                <div className="metric-card">
                  <strong>{orientation}</strong>
                  <span>Orientation</span>
                </div>
                <div className="metric-card">
                  <strong>{String(boardField?.value ?? '-')}</strong>
                  <span>Board</span>
                </div>
                <div className="metric-card">
                  <strong>{String(tutorialCountField?.value ?? '-')}</strong>
                  <span>Tutorial Steps</span>
                </div>
              </div>
              <div className="preview-copy">
                <p><strong>Goal</strong>: {String(goalField?.value ?? 'No gameplay summary configured yet.')}</p>
                <p><strong>CTA</strong>: {String(ctaField?.value ?? 'Play Now')}</p>
                <p><strong>Preset</strong>: {selectedPresetName}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </PageFrame>
  );
}
