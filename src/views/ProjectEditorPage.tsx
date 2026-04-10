import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { editorTabs } from '../data/mockData';
import { useAppState } from '../state/AppStateContext';
import type { EditorFieldDefinition } from '../types';
import { PageFrame, SectionCard } from './shared';

const tabLabels: Record<string, string> = {
  overview: 'Overview',
  gameplay: 'Gameplay',
  theme: 'Theme',
  assets: 'Assets',
  tutorial: 'Tutorial',
  ui: 'UI',
  'end-card': 'End Card',
  audio: 'Audio',
  export: 'Export'
};

export function ProjectEditorPage() {
  const { projectId = 'p1', tab = 'overview' } = useParams();
  const {
    getProjectById,
    setActiveProjectId,
    getTabFields,
    updateTabFields,
    updateProjectMeta,
    getValidationIssues,
    selectedPresetName,
    setSelectedPresetName
  } = useAppState();
  const project = getProjectById(projectId);
  const initialFields = useMemo(() => getTabFields(projectId, tab), [getTabFields, projectId, tab]);
  const [fields, setFields] = useState<EditorFieldDefinition[]>(initialFields);
  const validationIssues = getValidationIssues(projectId);

  useEffect(() => {
    setActiveProjectId(projectId);
    setFields(getTabFields(projectId, tab));
  }, [getTabFields, projectId, setActiveProjectId, tab]);

  function updateFieldValue(id: string, nextValue: string | number | boolean) {
    setFields((current) => {
      const nextFields = current.map((field) => (field.id === id ? { ...field, value: nextValue } : field));
      updateTabFields(projectId, tab, nextFields);
      if (tab === 'overview') {
        if (id === 'project-name' && typeof nextValue === 'string') {
          updateProjectMeta(projectId, { name: nextValue, updatedAt: 'Just now' });
        }
        if (id === 'orientation' && typeof nextValue === 'string') {
          updateProjectMeta(projectId, { orientation: nextValue, updatedAt: 'Just now' });
        }
      }
      if (id === 'preset' && typeof nextValue === 'string') {
        setSelectedPresetName(nextValue);
      }
      return nextFields;
    });
  }

  if (!project) {
    return (
      <PageFrame
        title="Project Not Found"
        description="The selected project could not be loaded."
        inspector={<p className="page-description">Return to Projects and create or select another project.</p>}
      >
        <SectionCard title="Missing Project" eyebrow="Error">
          <p className="page-description">No project exists for the current route.</p>
        </SectionCard>
      </PageFrame>
    );
  }

  function renderField(field: EditorFieldDefinition) {
    switch (field.type) {
      case 'textarea':
        return (
          <label className="field wide" key={field.id}>
            <span>{field.label}</span>
            <textarea
              className="text-area"
              value={String(field.value)}
              onChange={(event) => updateFieldValue(field.id, event.target.value)}
            />
            {field.helpText ? <small className="field-help">{field.helpText}</small> : null}
          </label>
        );
      case 'select':
        return (
          <label className="field" key={field.id}>
            <span>{field.label}</span>
            <select
              className="text-input"
              value={String(field.value)}
              onChange={(event) => updateFieldValue(field.id, event.target.value)}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {field.helpText ? <small className="field-help">{field.helpText}</small> : null}
          </label>
        );
      case 'range':
        return (
          <div className="field wide" key={field.id}>
            <div className="slider-row">
              <span>{field.label}</span>
              <strong>{field.value}</strong>
            </div>
            <input
              type="range"
              min={field.min}
              max={field.max}
              value={Number(field.value)}
              onChange={(event) => updateFieldValue(field.id, Number(event.target.value))}
            />
            {field.helpText ? <small className="field-help">{field.helpText}</small> : null}
          </div>
        );
      case 'toggle':
        return (
          <div className="field" key={field.id}>
            <span>{field.label}</span>
            <button
              type="button"
              className={`toggle ${field.value ? 'active' : ''}`}
              onClick={() => updateFieldValue(field.id, !field.value)}
            >
              {field.value ? 'Enabled' : 'Disabled'}
            </button>
            {field.helpText ? <small className="field-help">{field.helpText}</small> : null}
          </div>
        );
      case 'text':
      default:
        return (
          <label className="field" key={field.id}>
            <span>{field.label}</span>
            <input
              className="text-input"
              value={String(field.value)}
              onChange={(event) => updateFieldValue(field.id, event.target.value)}
            />
            {field.helpText ? <small className="field-help">{field.helpText}</small> : null}
          </label>
        );
    }
  }

  return (
    <PageFrame
      title={project.name}
      description="Template-driven editing with project context, validation, preview, and build readiness."
      inspector={
        <>
          <h3>Inspector</h3>
          <div className="stack-list">
            <div className="inspector-row"><span>Template</span><strong>{project.templateName}</strong></div>
            <div className="inspector-row"><span>Asset Pack</span><strong>{project.assetPackName}</strong></div>
            <div className="inspector-row"><span>Version</span><strong>{project.currentVersion}</strong></div>
            <div className="inspector-row"><span>Preset</span><strong>{selectedPresetName}</strong></div>
            <div className="inspector-row"><span>Validation</span><strong>{validationIssues.length} issues</strong></div>
          </div>
          {project.notes ? (
            <div className="validation-box warning">
              {project.notes}
            </div>
          ) : null}
          {validationIssues.slice(0, 3).map((issue) => (
            <div key={issue.id} className={`validation-box ${issue.severity === 'error' ? 'error' : 'warning'}`}>
              {issue.message}
            </div>
          ))}
        </>
      }
    >
      <div className="editor-tabs">
        {editorTabs.map((item) => (
          <Link
            key={item}
            to={`/projects/${project.id}/${item}`}
            className={`editor-tab ${tab === item ? 'active' : ''}`}
          >
            {tabLabels[item]}
          </Link>
        ))}
      </div>

      <div className="editor-layout">
        <SectionCard title={tabLabels[tab] ?? 'Overview'} eyebrow="Project Editor">
          {project.livePreviewPath ? (
            <div className="runtime-banner">
              This project is backed by a real imported playable runtime. Use Preview to test the actual GoblinMatch game inside WePlable.
            </div>
          ) : null}
          <div className="form-grid">
            {fields.map(renderField)}
          </div>
        </SectionCard>

        <SectionCard title="Live Status" eyebrow="Readiness">
          <div className="stack-list">
            <div className="list-row">
              <div>
                <strong>Build preset</strong>
                <p>{selectedPresetName} export package</p>
              </div>
              <span className="status-pill ready">Ready</span>
            </div>
            <div className="list-row">
              <div>
                <strong>Asset health</strong>
                <p>18/19 required assets mapped</p>
              </div>
              <span className="status-pill failed">Warn</span>
            </div>
            <div className="list-row">
              <div>
                <strong>Current tab fields</strong>
                <p>{fields.length} schema-driven controls loaded</p>
              </div>
              <span className="status-pill success">Live</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageFrame>
  );
}
