import type {
  AssetPack,
  Build,
  CreateProjectInput,
  EditorFieldDefinition,
  ExportPreset,
  NavItem,
  Project,
  TemplatePlugin,
  TemplateSummary
} from '../types';

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', shortLabel: 'DB' },
  { label: 'Projects', path: '/projects', shortLabel: 'PR' },
  { label: 'Templates', path: '/templates', shortLabel: 'TP' },
  { label: 'Asset Packs', path: '/asset-packs', shortLabel: 'AP' },
  { label: 'Preview', path: '/preview', shortLabel: 'PV' },
  { label: 'Builds', path: '/builds', shortLabel: 'BD' },
  { label: 'Developer', path: '/developer', shortLabel: 'DV' },
  { label: 'Settings', path: '/settings', shortLabel: 'ST' }
];

export const templates: TemplateSummary[] = [
  {
    id: 'match3-classic',
    name: 'Match-3 Classic',
    version: '1.0.0',
    category: 'Puzzle',
    schemaStatus: 'Healthy',
    compatibility: ['Generic HTML5', 'AppLovin', 'Unity Ads', 'Meta'],
    description: 'Grid-based match puzzle with turn limits, simple goals, tutorial flow, and end card transitions.'
  },
  {
    id: 'merge2-order',
    name: 'Merge-2 Order',
    version: '1.0.0',
    category: 'Merge',
    schemaStatus: 'Healthy',
    compatibility: ['Generic HTML5', 'TikTok', 'Mintegral', 'Google'],
    description: 'Drag and merge identical items to fulfill order progression within limited slots.'
  }
];

export const exportPresets: ExportPreset[] = [
  { id: 'generic-html5', name: 'Generic HTML5', network: 'Generic', maxSizeMb: 5, supportsPortrait: true, supportsLandscape: true },
  { id: 'applovin', name: 'AppLovin', network: 'AppLovin', maxSizeMb: 5, supportsPortrait: true, supportsLandscape: true },
  { id: 'unity-ads', name: 'Unity Ads', network: 'Unity Ads', maxSizeMb: 5, supportsPortrait: true, supportsLandscape: true },
  { id: 'google', name: 'Google', network: 'Google', maxSizeMb: 5, supportsPortrait: true, supportsLandscape: true },
  { id: 'mintegral', name: 'Mintegral', network: 'Mintegral', maxSizeMb: 4, supportsPortrait: true, supportsLandscape: false },
  { id: 'tiktok', name: 'TikTok', network: 'TikTok', maxSizeMb: 4, supportsPortrait: true, supportsLandscape: true },
  { id: 'meta', name: 'Meta', network: 'Meta', maxSizeMb: 3.5, supportsPortrait: true, supportsLandscape: true }
];

export const templatePlugins: TemplatePlugin[] = [
  {
    templateId: 'match3-classic',
    templateName: 'Match-3 Classic',
    category: 'Puzzle',
    version: '1.0.0',
    compatibility: ['Generic HTML5', 'AppLovin', 'Unity Ads', 'Meta'],
    description: 'Grid-based match puzzle with turn limits, simple goals, tutorial flow, and end card transitions.',
    previewMode: 'interactive'
  },
  {
    templateId: 'merge2-order',
    templateName: 'Merge-2 Order',
    category: 'Merge',
    version: '1.0.0',
    compatibility: ['Generic HTML5', 'TikTok', 'Mintegral', 'Google'],
    description: 'Drag and merge identical items to fulfill order progression within limited slots.',
    previewMode: 'interactive'
  }
];

export const assetPacks: AssetPack[] = [
  {
    id: 'candy-pop-pack',
    name: 'Candy Pop',
    version: '2.1.0',
    previewImage: 'CP',
    dependencyStatus: 'Healthy',
    linkedProjectCount: 6,
    categories: ['Backgrounds', 'Tiles', 'UI', 'End Card', 'Audio']
  },
  {
    id: 'dream-kitchen-pack',
    name: 'Dream Kitchen',
    version: '1.4.2',
    previewImage: 'DK',
    dependencyStatus: 'Warning',
    linkedProjectCount: 3,
    categories: ['Items', 'Logos', 'Characters', 'UI', 'Fonts']
  }
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Candy Quest KR Spring',
    owner: 'Vive',
    templateName: 'Match-3 Classic',
    templateId: 'match3-classic',
    assetPackName: 'Candy Pop',
    assetPackId: 'candy-pop-pack',
    orientation: 'Portrait',
    updatedAt: '5m ago',
    buildStatus: 'Ready',
    versionCount: 12,
    currentVersion: 'v1.2.3'
  },
  {
    id: 'p2',
    name: 'Merge Bistro US Test',
    owner: 'Creative Team',
    templateName: 'Merge-2 Order',
    templateId: 'merge2-order',
    assetPackName: 'Dream Kitchen',
    assetPackId: 'dream-kitchen-pack',
    orientation: 'Landscape',
    updatedAt: '22m ago',
    buildStatus: 'Validating',
    versionCount: 8,
    currentVersion: 'v0.9.8'
  },
  {
    id: 'p3',
    name: 'Candy Quest Meta Variant',
    owner: 'UA Ops',
    templateName: 'Match-3 Classic',
    templateId: 'match3-classic',
    assetPackName: 'Candy Pop',
    assetPackId: 'candy-pop-pack',
    orientation: 'Portrait',
    updatedAt: '2h ago',
    buildStatus: 'Failed',
    versionCount: 4,
    currentVersion: 'v0.6.0'
  }
];

export const builds: Build[] = [
  {
    id: 'b1',
    projectName: 'Candy Quest KR Spring',
    preset: 'Meta',
    status: 'Success',
    createdAt: '4m ago',
    artifactSize: '3.2 MB',
    logSummary: 'Validation passed. Package generated successfully.'
  },
  {
    id: 'b2',
    projectName: 'Merge Bistro US Test',
    preset: 'TikTok',
    status: 'Building',
    createdAt: '12m ago',
    artifactSize: '-',
    logSummary: 'Compressing assets and evaluating orientation rules.'
  },
  {
    id: 'b3',
    projectName: 'Candy Quest Meta Variant',
    preset: 'Meta',
    status: 'Failed',
    createdAt: '47m ago',
    artifactSize: '-',
    logSummary: 'Missing end card logo asset and CTA tap-safe area conflict.'
  }
];

export const editorTabs = [
  'overview',
  'gameplay',
  'theme',
  'assets',
  'tutorial',
  'ui',
  'end-card',
  'audio',
  'export'
] as const;

export const editorFieldsByTab: Record<string, EditorFieldDefinition[]> = {
  overview: [
    { id: 'project-name', label: 'Project Name', type: 'text', value: 'Candy Quest KR Spring' },
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
      value: 'A premium Meta variant based on Match-3 Classic with a shortened tutorial and stronger CTA emphasis.'
    }
  ],
  gameplay: [
    { id: 'board-size', label: 'Board Size', type: 'select', value: '8x8', options: [{ label: '7x7', value: '7x7' }, { label: '8x8', value: '8x8' }, { label: '9x9', value: '9x9' }] },
    { id: 'turn-limit', label: 'Turn Limit', type: 'range', value: 18, min: 5, max: 30, helpText: 'Controls round length and pacing.' },
    { id: 'goal-summary', label: 'Win Condition', type: 'textarea', value: 'Collect 24 blue gems and 10 striped rockets before turns run out.' },
    { id: 'show-goal-callout', label: 'Show Goal Intro', type: 'toggle', value: true }
  ],
  theme: [
    { id: 'skin-preset', label: 'Skin Preset', type: 'select', value: 'Candy Premium', options: [{ label: 'Candy Premium', value: 'Candy Premium' }, { label: 'Soft Minimal', value: 'Soft Minimal' }] },
    { id: 'primary-accent', label: 'Primary Accent Token', type: 'text', value: '#5E8CFF' },
    { id: 'background-tone', label: 'Background Tone', type: 'text', value: 'Dark graphite with cool blue gradient' }
  ],
  assets: [
    { id: 'logo-asset', label: 'Logo Asset', type: 'text', value: 'logo_candy_kr.png' },
    { id: 'background-asset', label: 'Background Asset', type: 'text', value: 'bg_stage_candy_city.webp' },
    { id: 'cta-sound', label: 'CTA SFX', type: 'text', value: 'missing_optional_click.wav', helpText: 'Optional asset currently unresolved.' }
  ],
  tutorial: [
    { id: 'tutorial-step-count', label: 'Tutorial Step Count', type: 'range', value: 3, min: 1, max: 6 },
    { id: 'tutorial-mode', label: 'Tutorial Mode', type: 'select', value: 'Auto-run', options: [{ label: 'Auto-run', value: 'Auto-run' }, { label: 'Manual', value: 'Manual' }] },
    { id: 'step-one-copy', label: 'Step 1 Helper Text', type: 'textarea', value: 'Swap these two gems to create your first match.' }
  ],
  ui: [
    { id: 'show-turn-counter', label: 'Show Turn Counter', type: 'toggle', value: true },
    { id: 'show-score', label: 'Show Score', type: 'toggle', value: false },
    { id: 'safe-area-behavior', label: 'Safe Area Behavior', type: 'select', value: 'Inset top and bottom', options: [{ label: 'Inset top and bottom', value: 'Inset top and bottom' }, { label: 'Bottom only', value: 'Bottom only' }] }
  ],
  'end-card': [
    { id: 'cta-copy', label: 'CTA Text', type: 'text', value: 'Play Now' },
    { id: 'cta-style', label: 'CTA Style', type: 'select', value: 'Primary Glow', options: [{ label: 'Primary Glow', value: 'Primary Glow' }, { label: 'Soft Mint', value: 'Soft Mint' }] },
    { id: 'end-card-notes', label: 'End Card Notes', type: 'textarea', value: 'Logo sits above CTA. Use animated confetti burst on win state.' }
  ],
  audio: [
    { id: 'bgm-track', label: 'BGM Track', type: 'text', value: 'bgm_candy_loop_a.mp3' },
    { id: 'enable-sfx', label: 'Enable SFX', type: 'toggle', value: true },
    { id: 'mute-default', label: 'Mute By Default', type: 'toggle', value: false }
  ],
  export: [
    { id: 'preset', label: 'Export Preset', type: 'select', value: 'Meta', options: [{ label: 'Meta', value: 'Meta' }, { label: 'TikTok', value: 'TikTok' }, { label: 'Generic HTML5', value: 'Generic HTML5' }] },
    { id: 'compression', label: 'Compression Level', type: 'range', value: 7, min: 1, max: 10 },
    { id: 'package-metadata', label: 'Package Metadata', type: 'textarea', value: 'campaign=kr_spring_meta; locale=ko-KR; version=v1.2.3' }
  ]
};

export function createMockProject(input: CreateProjectInput): Project {
  const template = templates.find((item) => item.id === input.templateId) ?? templates[0];
  const assetPack = assetPacks.find((item) => item.id === input.assetPackId) ?? assetPacks[0];

  return {
    id: `p-${Date.now()}`,
    name: input.name,
    owner: 'Current User',
    templateName: template.name,
    templateId: template.id,
    assetPackName: assetPack.name,
    assetPackId: assetPack.id,
    orientation: input.orientation,
    updatedAt: 'Just now',
    buildStatus: 'Draft',
    versionCount: 1,
    currentVersion: 'v0.1.0'
  };
}
