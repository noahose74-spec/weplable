import { exportPresets } from '../data/mockData';
import { getTemplatePlugin } from '../plugins/templateRegistry';
import type { EditorFieldDefinition, ExportPreset, Project, ValidationIssue } from '../types';

function getField(fields: EditorFieldDefinition[], id: string) {
  return fields.find((field) => field.id === id);
}

export function getPresetByName(name: string): ExportPreset | undefined {
  return exportPresets.find((preset) => preset.name === name);
}

export function validateProject(
  project: Project,
  drafts: Record<string, EditorFieldDefinition[]>,
  presetName: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const templatePlugin = getTemplatePlugin(project.templateId);
  const preset = getPresetByName(presetName);

  const gameplay = drafts.gameplay ?? [];
  const assets = drafts.assets ?? [];
  const tutorial = drafts.tutorial ?? [];
  const endCard = drafts['end-card'] ?? [];
  const exportFields = drafts.export ?? [];

  const turnLimit = Number(getField(gameplay, 'turn-limit')?.value ?? 0);
  const goalSummary = String(getField(gameplay, 'goal-summary')?.value ?? '').trim();
  const tutorialCount = Number(getField(tutorial, 'tutorial-step-count')?.value ?? 0);
  const cta = String(getField(endCard, 'cta-copy')?.value ?? '').trim();
  const ctaSound = String(getField(assets, 'cta-sound')?.value ?? '').trim();
  const metadata = String(getField(exportFields, 'package-metadata')?.value ?? '').trim();

  if (!goalSummary) {
    issues.push({
      id: 'missing-goal',
      severity: 'error',
      message: 'Gameplay win condition is empty.',
      source: 'project',
      tab: 'gameplay'
    });
  }

  if (turnLimit < 8) {
    issues.push({
      id: 'low-turn-limit',
      severity: 'warning',
      message: 'Turn limit is very low and may cause abrupt failure pacing.',
      source: 'project',
      tab: 'gameplay'
    });
  }

  if (tutorialCount < 1) {
    issues.push({
      id: 'tutorial-count',
      severity: 'error',
      message: 'Tutorial must contain at least one step for the current template defaults.',
      source: 'project',
      tab: 'tutorial'
    });
  }

  if (!cta) {
    issues.push({
      id: 'missing-cta',
      severity: 'error',
      message: 'End card CTA text is required.',
      source: 'asset',
      tab: 'end-card'
    });
  }

  if (ctaSound.toLowerCase().includes('missing')) {
    issues.push({
      id: 'missing-cta-sfx',
      severity: 'warning',
      message: 'Optional CTA SFX is unresolved.',
      source: 'asset',
      tab: 'assets'
    });
  }

  if (!metadata.includes('campaign=')) {
    issues.push({
      id: 'missing-metadata-campaign',
      severity: 'warning',
      message: 'Export metadata should include a campaign key.',
      source: 'preset',
      tab: 'export'
    });
  }

  if (preset) {
    const isPortrait = project.orientation === 'Portrait';
    const orientationSupported = isPortrait ? preset.supportsPortrait : preset.supportsLandscape;
    if (!orientationSupported) {
      issues.push({
        id: 'unsupported-orientation',
        severity: 'error',
        message: `${preset.name} does not support the current ${project.orientation.toLowerCase()} orientation.`,
        source: 'preset',
        tab: 'export'
      });
    }
  }

  if (templatePlugin && preset && !templatePlugin.compatibility.includes(preset.name)) {
    issues.push({
      id: 'template-preset-compatibility',
      severity: 'error',
      message: `${templatePlugin.templateName} is not marked compatible with ${preset.name}.`,
      source: 'template',
      tab: 'export'
    });
  }

  if (project.livePreviewPath?.includes('weplable-import.html')) {
    issues.push({
      id: 'external-playable-diagnostic',
      severity: 'error',
      message: 'External playable is registered, but it currently points to an import diagnostic page because the runnable game artifact is incomplete.',
      source: 'project',
      tab: 'overview'
    });
  }

  if (issues.length === 0) {
    issues.push({
      id: 'ready',
      severity: 'info',
      message: 'Project is currently valid for preview and build.',
      source: 'project',
      tab: 'overview'
    });
  }

  return issues;
}
