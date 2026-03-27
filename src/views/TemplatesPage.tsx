import { getTemplateRegistry } from '../plugins/templateRegistry';
import { PageFrame, SectionCard } from './shared';

export function TemplatesPage() {
  const templates = getTemplateRegistry();

  return (
    <PageFrame
      title="Templates"
      description="Browse built-in and custom playable templates, compatibility, and schema readiness."
      inspector={
        <>
          <h3>Registry Summary</h3>
          <div className="stack-list">
            <div className="inspector-row"><span>Built-in</span><strong>2</strong></div>
            <div className="inspector-row"><span>Custom</span><strong>0</strong></div>
            <div className="inspector-row"><span>Registry mode</span><strong>Plugin-based</strong></div>
          </div>
        </>
      }
    >
      <div className="stack-panels">
        {templates.map((template) => (
          <SectionCard key={template.templateId} title={template.templateName} eyebrow={template.category}>
            <p className="page-description">{template.description}</p>
            <div className="chip-row">
              {template.compatibility.map((item) => (
                <span key={item} className="filter-chip">{item}</span>
              ))}
            </div>
            <div className="project-footer">
              <span>Version {template.version}</span>
              <span>{template.previewMode}</span>
            </div>
          </SectionCard>
        ))}
      </div>
    </PageFrame>
  );
}
