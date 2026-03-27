import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { navItems } from '../data/mockData';
import { useAppState } from '../state/AppStateContext';

function isProjectContext(pathname: string) {
  return pathname.startsWith('/projects/');
}

export function AppShell() {
  const location = useLocation();
  const { activeProjectId, getProjectById } = useAppState();
  const activeProject = getProjectById(activeProjectId);
  const inProject = isProjectContext(location.pathname);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-mark">WP</div>
          <div>
            <p className="eyebrow">Internal Platform</p>
            <h1>WePlable</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.shortLabel}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-card">
            <p className="eyebrow">Platform Pulse</p>
            <strong>2 templates</strong>
            <span>3 active warnings</span>
          </div>
        </div>
      </aside>

      <div className="workspace-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Current Context</p>
            {inProject && activeProject ? (
              <div className="context-grid">
                <span>{activeProject.name}</span>
                <span>{activeProject.currentVersion}</span>
                <span>{activeProject.templateName}</span>
                <span>{activeProject.assetPackName}</span>
                <span>Updated {activeProject.updatedAt}</span>
                <span className={`status-pill ${activeProject.buildStatus.toLowerCase()}`}>{activeProject.buildStatus}</span>
              </div>
            ) : (
              <h2>Creative production workspace</h2>
            )}
          </div>

          <div className="topbar-actions">
            <button className="ghost-button">Preview</button>
            <button className="ghost-button">Build</button>
            <button className="primary-button">Download</button>
          </div>
        </header>

        <main className="workspace-grid">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
