import { templatePlugins } from '../data/mockData';
import type { TemplatePlugin } from '../types';

export function getTemplateRegistry(): TemplatePlugin[] {
  return templatePlugins;
}

export function getTemplatePlugin(templateId: string): TemplatePlugin | undefined {
  return templatePlugins.find((plugin) => plugin.templateId === templateId);
}
