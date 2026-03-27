# WePlable IA / Sitemap

## 1. Document Overview

- Product: WePlable
- Based on: [PRD-WePlable.md](D:\Vive\Weplable\PRD-WePlable.md)
- Purpose: Define information architecture, navigation model, primary entities, and sitemap for MVP

## 2. IA Principles

1. Project-centered workflow: most actions should begin from a project context.
2. Template-first structure: templates shape editor behavior, validations, and preview modes.
3. Preview and build prominence: these should remain reachable from any active project context.
4. Clear separation of management vs editing: browsing entities and editing a project should feel distinct.
5. Developer extensibility without polluting creator workflows: template/plugin tooling belongs in Developer Center.

## 3. Core Domain Objects

- Project
- Version
- Template
- Asset Pack
- Build
- Export Preset

## 4. Global Navigation Model

### Primary Sidebar Navigation

- Dashboard
- Projects
- Templates
- Asset Packs
- Preview
- Builds
- Developer
- Settings

### Persistent Top Context Bar

Shown when a project context is active:

- current project name
- current version
- template type
- asset pack
- last updated time
- build status
- primary actions: Preview, Build, Download

### Right Inspector Pattern

The right-side panel is persistent as a product pattern and changes by context:

- properties inspector in editor views
- validation and health inspector in preview/build flows
- metadata/status inspector in list-detail pages

## 5. Navigation Hierarchy

## Level 1: Application

- Dashboard
- Projects
- Templates
- Asset Packs
- Preview
- Builds
- Developer
- Settings

## Level 2: Section Pages

### Dashboard

- Overview

### Projects

- Project index
- Create project modal/flow
- Project detail
- Version history panel / page

### Project Detail

- Overview
- Gameplay
- Theme
- Assets
- Tutorial
- UI
- End Card
- Audio
- Export

### Templates

- Built-in templates
- Custom templates
- Template detail

### Asset Packs

- Asset pack index
- Asset pack detail
- Import/export flows

### Preview

- Active project preview

### Builds

- Build queue/history
- Build detail/log view

### Developer

- Template registry
- Create-template scaffold
- Manifest editor/view
- Config schema preview
- Editor schema preview
- Validation runner
- Sample seed runner
- Compatibility checker
- Developer docs panel

### Settings

- General settings
- Export preset settings
- Workspace/preferences

## 6. Recommended URL Structure

These routes assume a web SPA with nested routing.

```text
/dashboard
/projects
/projects/new
/projects/:projectId
/projects/:projectId/overview
/projects/:projectId/gameplay
/projects/:projectId/theme
/projects/:projectId/assets
/projects/:projectId/tutorial
/projects/:projectId/ui
/projects/:projectId/end-card
/projects/:projectId/audio
/projects/:projectId/export
/projects/:projectId/versions
/templates
/templates/:templateId
/asset-packs
/asset-packs/:assetPackId
/preview
/preview/:projectId
/builds
/builds/:buildId
/developer
/developer/templates
/developer/templates/new
/developer/templates/:templateId
/developer/templates/:templateId/manifest
/developer/templates/:templateId/config-schema
/developer/templates/:templateId/editor-schema
/developer/templates/:templateId/validation
/developer/templates/:templateId/sample-seed
/developer/templates/:templateId/compatibility
/settings
/settings/export-presets
/settings/preferences
```

## 7. Sitemap

```text
WePlable
├─ Dashboard
│  └─ Overview
├─ Projects
│  ├─ Project List
│  ├─ Create Project
│  ├─ Project Detail
│  │  ├─ Overview
│  │  ├─ Gameplay
│  │  ├─ Theme
│  │  ├─ Assets
│  │  ├─ Tutorial
│  │  ├─ UI
│  │  ├─ End Card
│  │  ├─ Audio
│  │  ├─ Export
│  │  └─ Versions
│  └─ Archived Projects
├─ Templates
│  ├─ Built-in Templates
│  ├─ Custom Templates
│  └─ Template Detail
├─ Asset Packs
│  ├─ Asset Pack List
│  ├─ Asset Pack Detail
│  ├─ Import Asset Pack
│  └─ Export Asset Pack
├─ Preview
│  └─ Active Project Preview
├─ Builds
│  ├─ Build List
│  ├─ Build Queue
│  └─ Build Detail / Logs
├─ Developer
│  ├─ Template Registry
│  ├─ Create Template Scaffold
│  ├─ Manifest
│  ├─ Config Schema Preview
│  ├─ Editor Schema Preview
│  ├─ Validation Runner
│  ├─ Sample Seed Runner
│  ├─ Compatibility Checker
│  └─ Developer Docs
└─ Settings
   ├─ General
   ├─ Export Presets
   └─ Preferences
```

## 8. Section Responsibilities

### Dashboard

Use for operational overview and triage, not for deep editing.

### Projects

Use for project discovery, creation, duplication, archival, version access, and entry into editing.

### Project Editor

Use for all project-specific content and configuration changes.

### Preview

Use for interactive QA, debug visualization, and scenario jumping.

### Builds

Use for packaging, build status review, diagnostics, and downloads.

### Templates

Use for browsing built-in and custom template capabilities, health, and compatibility.

### Asset Packs

Use for managing reusable visual/audio resource bundles.

### Developer

Use for template/plugin lifecycle tasks only.

### Settings

Use for environment-wide preferences and preset administration.

## 9. Object Relationships

```text
Template 1 --- N Projects
Asset Pack 1 --- N Projects
Project 1 --- N Versions
Version 1 --- N Builds
Preset 1 --- N Builds
Template 1 --- N Compatible Presets
Template 1 --- N Required Assets
Asset Pack 1 --- N Assets
```

## 10. Cross-Section Entry Points

### From Dashboard

- open recent project
- retry failed build
- inspect validation warning
- create project

### From Projects

- open editor
- open preview
- open versions
- duplicate project
- archive project

### From Project Editor

- open preview
- run validation
- trigger build
- open builds for current project/version

### From Preview

- return to editor tab
- trigger build
- inspect warnings

### From Builds

- download artifact
- open source project/version
- inspect logs
- rerun build

### From Templates

- inspect template capabilities
- create project from template
- open developer details for custom template

## 11. Suggested Page-Level Empty States

- Dashboard: no recent projects/builds yet
- Projects: no projects match current filters
- Templates: no custom templates registered yet
- Asset Packs: no packs imported yet
- Builds: no builds have been run yet
- Developer: no custom template selected yet

## 12. MVP IA Decisions

- Keep Preview as both a standalone sidebar destination and a project-linked action.
- Keep Builds globally accessible for queue/history visibility, even though builds originate from projects.
- Keep Developer Center separate from Templates so non-technical users are not exposed to scaffolding and schema tooling by default.
- Keep Settings lightweight in MVP; most core work happens in Projects, Preview, and Builds.

## 13. Open IA Questions

- Whether archived projects need a separate route or a filter-only state
- Whether version history should be a dedicated page or a slide-over/panel
- Whether Preview should support side-by-side compare in later phases
- Whether Asset Pack detail should include direct dependency usage graphs in MVP or later
