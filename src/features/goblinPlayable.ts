import type { EditorFieldDefinition, Project } from '../types';

type DraftMap = Record<string, EditorFieldDefinition[]>;

function getFieldValue<T extends string | number | boolean>(
  drafts: DraftMap,
  tab: string,
  id: string,
  fallback: T
) {
  const field = drafts[tab]?.find((entry) => entry.id === id);
  return (field?.value as T | undefined) ?? fallback;
}

export function isGoblinProject(project: Project | undefined) {
  return Boolean(project?.livePreviewPath?.includes('goblin-match'));
}

export function createGoblinDraftSeed(project: Project): DraftMap {
  return {
    overview: [
      { id: 'project-name', label: 'Project Name', type: 'text', value: project.name },
      {
        id: 'orientation',
        label: 'Orientation',
        type: 'select',
        value: 'Portrait',
        options: [
          { label: 'Portrait', value: 'Portrait' },
          { label: 'Landscape', value: 'Landscape' }
        ]
      },
      {
        id: 'summary',
        label: 'Project Summary',
        type: 'textarea',
        value: 'Portrait Goblin Match validation project connected to the live runtime inside WePlable.'
      }
    ],
    gameplay: [
      {
        id: 'board-size',
        label: 'Board Size',
        type: 'select',
        value: '8x8',
        options: [
          { label: '7x7', value: '7x7' },
          { label: '8x8', value: '8x8' },
          { label: '9x9', value: '9x9' }
        ]
      },
      { id: 'turn-limit', label: 'Turn Limit', type: 'range', value: 18, min: 8, max: 30, helpText: 'Applied directly to Goblin Match stages.' },
      { id: 'goal-summary', label: 'Win Condition', type: 'textarea', value: 'Clear relic items before turns run out.' },
      { id: 'show-goal-callout', label: 'Show Goal Intro', type: 'toggle', value: true }
    ],
    theme: [
      { id: 'skin-preset', label: 'Skin Preset', type: 'select', value: 'Goblin Legacy Portrait', options: [{ label: 'Goblin Legacy Portrait', value: 'Goblin Legacy Portrait' }] },
      { id: 'primary-accent', label: 'Primary Accent Token', type: 'text', value: '#5E8CFF' },
      { id: 'background-tone', label: 'Background Tone', type: 'text', value: 'Warm parchment portrait layout' }
    ],
    assets: [
      { id: 'logo-asset', label: 'Logo Asset', type: 'text', value: 'goblin_logo.png' },
      { id: 'background-asset', label: 'Background Asset', type: 'text', value: 'goblin_bg_parchment.png' },
      { id: 'cta-sound', label: 'CTA SFX', type: 'text', value: 'goblin_cta_click.wav', helpText: 'Resolved for GoblinMatch runtime validation.' }
    ],
    tutorial: [
      { id: 'tutorial-step-count', label: 'Tutorial Step Count', type: 'range', value: 3, min: 1, max: 6 },
      { id: 'tutorial-mode', label: 'Tutorial Mode', type: 'select', value: 'Auto-run', options: [{ label: 'Auto-run', value: 'Auto-run' }, { label: 'Manual', value: 'Manual' }] },
      { id: 'step-one-copy', label: 'Step 1 Helper Text', type: 'textarea', value: 'Drag the leader one tile to trigger your first Goblin Match and clear relics.' }
    ],
    ui: [
      { id: 'show-turn-counter', label: 'Show Turn Counter', type: 'toggle', value: true },
      { id: 'show-score', label: 'Show Score', type: 'toggle', value: false },
      { id: 'safe-area-behavior', label: 'Safe Area Behavior', type: 'select', value: 'Inset top and bottom', options: [{ label: 'Inset top and bottom', value: 'Inset top and bottom' }, { label: 'Bottom only', value: 'Bottom only' }] }
    ],
    'end-card': [
      { id: 'cta-copy', label: 'CTA Text', type: 'text', value: 'Play Goblin Match' },
      { id: 'cta-style', label: 'CTA Style', type: 'select', value: 'Primary Glow', options: [{ label: 'Primary Glow', value: 'Primary Glow' }] },
      { id: 'end-card-notes', label: 'End Card Notes', type: 'textarea', value: 'Use a clear CTA and keep the result card centered for portrait mobile.' }
    ],
    audio: [
      { id: 'bgm-track', label: 'BGM Track', type: 'text', value: 'goblin_loop.mp3' },
      { id: 'enable-sfx', label: 'Enable SFX', type: 'toggle', value: true },
      { id: 'mute-default', label: 'Mute By Default', type: 'toggle', value: false }
    ],
    export: [
      { id: 'preset', label: 'Export Preset', type: 'select', value: 'Meta', options: [{ label: 'Meta', value: 'Meta' }, { label: 'Generic HTML5', value: 'Generic HTML5' }, { label: 'TikTok', value: 'TikTok' }] },
      { id: 'compression', label: 'Compression Level', type: 'range', value: 7, min: 1, max: 10 },
      { id: 'package-metadata', label: 'Package Metadata', type: 'textarea', value: 'campaign=goblinmatch_portrait; locale=en-US; version=v1.0.0' }
    ]
  };
}

export function buildGoblinRuntimeConfig(project: Project, drafts: DraftMap, presetName: string) {
  return {
    projectName: String(getFieldValue(drafts, 'overview', 'project-name', project.name)),
    orientation: String(getFieldValue(drafts, 'overview', 'orientation', project.orientation)).toLowerCase(),
    stageId: 'normal',
    leaderId: 'blue',
    autoStart: true,
    turnLimit: Number(getFieldValue(drafts, 'gameplay', 'turn-limit', 18)),
    goalLabel: String(getFieldValue(drafts, 'gameplay', 'goal-summary', 'Clear relic items before turns run out.')),
    tutorial: {
      enabled: true,
      stepCount: Number(getFieldValue(drafts, 'tutorial', 'tutorial-step-count', 3)),
      copy: String(getFieldValue(drafts, 'tutorial', 'step-one-copy', 'Drag the leader one tile to trigger a match.')),
      mode: String(getFieldValue(drafts, 'tutorial', 'tutorial-mode', 'Auto-run'))
    },
    endCard: {
      ctaText: String(getFieldValue(drafts, 'end-card', 'cta-copy', 'Play Now')),
      note: String(getFieldValue(drafts, 'end-card', 'end-card-notes', 'Clear every relic before turns run out.'))
    },
    theme: {
      primaryAccent: String(getFieldValue(drafts, 'theme', 'primary-accent', '#5E8CFF')),
      backgroundTone: String(getFieldValue(drafts, 'theme', 'background-tone', 'Parchment'))
    },
    exportPreset: presetName
  };
}

function createArtifactMarkup(runtimeUrl: string, configJson: string, title: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      html, body { margin: 0; height: 100%; background: #0f1217; }
      iframe { width: 100%; height: 100%; border: 0; display: block; }
    </style>
  </head>
  <body>
    <iframe id="playable" src="${runtimeUrl}" title="${title}"></iframe>
    <script>
      const config = ${configJson};
      const frame = document.getElementById('playable');
      frame.addEventListener('load', () => {
        frame.contentWindow?.postMessage({ type: 'weplable:init', payload: { config } }, '*');
      });
    </script>
  </body>
</html>`;
}

export function createGoblinArtifact(project: Project, drafts: DraftMap, presetName: string) {
  const runtimeConfig = buildGoblinRuntimeConfig(project, drafts, presetName);
  const runtimeUrl = `${project.livePreviewPath}?autostart=1&orientation=${runtimeConfig.orientation}`;
  const content = createArtifactMarkup(runtimeUrl, JSON.stringify(runtimeConfig), project.name);
  const artifactName = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${presetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
  const sizeKb = new Blob([content], { type: 'text/html' }).size / 1024;

  return {
    artifactName,
    artifactUrl: URL.createObjectURL(new Blob([content], { type: 'text/html' })),
    artifactSize: `${sizeKb.toFixed(1)} KB`,
    config: runtimeConfig
  };
}
