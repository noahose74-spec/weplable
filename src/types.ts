export interface NavItem {
  label: string;
  path: string;
  shortLabel: string;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  templateName: string;
  templateId: string;
  assetPackName: string;
  assetPackId: string;
  orientation: string;
  updatedAt: string;
  buildStatus: 'Draft' | 'Ready' | 'Validating' | 'Building' | 'Success' | 'Failed';
  versionCount: number;
  currentVersion: string;
}

export interface TemplateSummary {
  id: string;
  name: string;
  version: string;
  category: string;
  schemaStatus: string;
  compatibility: string[];
  description: string;
}

export interface ExportPreset {
  id: string;
  name: string;
  network: string;
  maxSizeMb: number;
  supportsPortrait: boolean;
  supportsLandscape: boolean;
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  source: 'template' | 'preset' | 'asset' | 'project';
  tab: string;
}

export interface TemplatePlugin {
  templateId: string;
  templateName: string;
  category: string;
  version: string;
  compatibility: string[];
  description: string;
  previewMode: string;
}

export interface AssetPack {
  id: string;
  name: string;
  version: string;
  previewImage: string;
  dependencyStatus: string;
  linkedProjectCount: number;
  categories: string[];
}

export interface Build {
  id: string;
  projectName: string;
  preset: string;
  status: 'Draft' | 'Ready' | 'Validating' | 'Building' | 'Success' | 'Failed';
  createdAt: string;
  artifactSize: string;
  logSummary: string;
}

export interface CreateProjectInput {
  name: string;
  templateId: string;
  assetPackId: string;
  orientation: 'Portrait' | 'Landscape';
}

export interface EditorFieldOption {
  label: string;
  value: string;
}

export interface EditorFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'range' | 'toggle';
  value: string | number | boolean;
  helpText?: string;
  options?: EditorFieldOption[];
  min?: number;
  max?: number;
}
