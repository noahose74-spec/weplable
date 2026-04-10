import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { AssetPacksPage } from './views/AssetPacksPage';
import { BuildsView } from './views/BuildsView';
import { DashboardView } from './views/DashboardView';
import { DeveloperPage } from './views/DeveloperPage';
import { PreviewPage } from './views/PreviewPage';
import { ProjectEditorPage } from './views/ProjectEditorPage';
import { ProjectsPage } from './views/ProjectsPage';
import { SettingsPage } from './views/SettingsPage';
import { TemplatesPage } from './views/TemplatesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId/:tab?', element: <ProjectEditorPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'asset-packs', element: <AssetPacksPage /> },
      { path: 'preview', element: <PreviewPage /> },
      { path: 'builds', element: <BuildsView /> },
      { path: 'developer', element: <DeveloperPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
]);
