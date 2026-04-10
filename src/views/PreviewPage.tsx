import { useEffect, useMemo, useRef, useState } from 'react';
import { buildGoblinRuntimeConfig, isGoblinProject } from '../features/goblinPlayable';
import { useAppState } from '../state/AppStateContext';
import { PageFrame, SectionCard } from './shared';

export function PreviewPage() {
  const { activeProjectId, getProjectById, getTabFields, getValidationIssues, selectedPresetName, projects, setActiveProjectId } = useAppState();
  const project = getProjectById(activeProjectId);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>(project?.orientation === 'Landscape' ? 'Landscape' : 'Portrait');
  const [runtimeState, setRuntimeState] = useState<Record<string, string>>({});
  const gameplayFields = useMemo(() => getTabFields(activeProjectId, 'gameplay'), [activeProjectId, getTabFields]);
  const endCardFields = useMemo(() => getTabFields(activeProjectId, 'end-card'), [activeProjectId, getTabFields]);
  const tutorialFields = useMemo(() => getTabFields(activeProjectId, 'tutorial'), [activeProjectId, getTabFields]);
  const overviewFields = useMemo(() => getTabFields(activeProjectId, 'overview'), [activeProjectId, getTabFields]);
  const themeFields = useMemo(() => getTabFields(activeProjectId, 'theme'), [activeProjectId, getTabFields]);
  const issues = getValidationIssues(activeProjectId);

  const boardField = gameplayFields.find((field) => field.id === 'board-size');
  const goalField = gameplayFields.find((field) => field.id === 'goal-summary');
  const tutorialCountField = tutorialFields.find((field) => field.id === 'tutorial-step-count');
  const ctaField = endCardFields.find((field) => field.id === 'cta-copy');
  const runtimeConfig = useMemo(() => {
    if (!project || !isGoblinProject(project)) {
      return null;
    }

    return buildGoblinRuntimeConfig(project, {
      overview: overviewFields,
      gameplay: gameplayFields,
      theme: themeFields,
      tutorial: tutorialFields,
      'end-card': endCardFields
    }, selectedPresetName);
  }, [ctaField?.value, endCardFields, gameplayFields, goalField?.value, overviewFields, project, selectedPresetName, themeFields, tutorialFields]);

  function postCommand(command: string, payload?: Record<string, string>) {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'weplable:command',
      command,
      payload
    }, '*');
  }

  function initializeRuntime(nextOrientation: 'Portrait' | 'Landscape' = orientation) {
    if (!runtimeConfig) {
      return;
    }

    iframeRef.current?.contentWindow?.postMessage({
      type: 'weplable:init',
      payload: {
        config: {
          ...runtimeConfig,
          orientation: nextOrientation.toLowerCase()
        }
      }
    }, '*');
  }

  useEffect(() => {
    setOrientation(project?.orientation === 'Landscape' ? 'Landscape' : 'Portrait');
  }, [project?.orientation]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const message = event.data;
      if (!message || typeof message !== 'object') {
        return;
      }

      if (message.type === 'goblinmatch:state') {
        setRuntimeState({
          screen: String(message.payload?.screen ?? '-'),
          phase: String(message.payload?.phase ?? '-'),
          result: String(message.payload?.result ?? '-'),
          tutorial: message.payload?.tutorialVisible ? 'Visible' : 'Hidden'
        });
      }

      if (message.type === 'goblinmatch:ready') {
        setRuntimeState((current) => ({
          ...current,
          ready: 'Connected',
          orientation: String(message.payload?.config?.orientation ?? orientation)
        }));
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [orientation]);

  useEffect(() => {
    if (project?.livePreviewPath && runtimeConfig) {
      const timer = window.setTimeout(() => initializeRuntime(orientation), 150);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [orientation, project?.livePreviewPath, runtimeConfig]);

  return (
    <PageFrame
      title="Preview"
      description="Instant QA surface for playable runtime, safe areas, warnings, and tutorial/end card jumping."
      inspector={
        <>
          <h3>Preview Controls</h3>
          <div className="stack-list">
            <select
              className="text-input"
              value={activeProjectId}
              onChange={(event) => setActiveProjectId(event.target.value)}
            >
              {projects.map((entry) => (
                <option key={entry.id} value={entry.id}>{entry.name}</option>
              ))}
            </select>
            <button className="ghost-button" onClick={() => { setOrientation('Portrait'); postCommand('setOrientation', { orientation: 'portrait' }); }}>Portrait</button>
            <button className="ghost-button" onClick={() => { setOrientation('Landscape'); postCommand('setOrientation', { orientation: 'landscape' }); }}>Landscape</button>
            <button className="ghost-button" onClick={() => postCommand('restart')}>Restart</button>
            <button className="ghost-button" onClick={() => postCommand('showTutorial')}>Jump to Tutorial</button>
            <button className="ghost-button" onClick={() => postCommand('showEndCard')}>Jump to End Card</button>
            <div className="validation-box warning">
              {project ? `${project.name} is linked live to editor state with ${selectedPresetName}.` : 'No active project selected.'}
            </div>
            {runtimeConfig ? (
              <div className="stack-list compact">
                <div className="inspector-row"><span>Runtime</span><strong>{runtimeState.ready ?? 'Booting'}</strong></div>
                <div className="inspector-row"><span>Screen</span><strong>{runtimeState.screen ?? '-'}</strong></div>
                <div className="inspector-row"><span>Phase</span><strong>{runtimeState.phase ?? '-'}</strong></div>
                <div className="inspector-row"><span>Tutorial</span><strong>{runtimeState.tutorial ?? '-'}</strong></div>
              </div>
            ) : null}
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
          {project?.livePreviewPath ? (
            <div className={`preview-device runtime-frame ${orientation.toLowerCase()}`}>
              <iframe
                ref={iframeRef}
                className="playable-iframe"
                src={project.livePreviewPath}
                title={`${project.name} playable preview`}
                onLoad={() => initializeRuntime()}
              />
            </div>
          ) : (
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
          )}
        </div>
      </SectionCard>
    </PageFrame>
  );
}
