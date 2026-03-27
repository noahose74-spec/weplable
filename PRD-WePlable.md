# WePlable PRD

## 1. Document Overview

- Product: WePlable
- Type: Internal web application
- Document Type: Product Requirements Document (PRD)
- Version: 1.0
- Date: 2026-03-27
- Audience: Product, Design, Frontend, Backend, Creative Tech, QA

## 2. Product Summary

WePlable is an internal playable ad creation and distribution platform for the company. It enables internal teams to create, customize, preview, build, and export HTML5 playable ads using reusable templates instead of rebuilding each playable from scratch.

The initial release includes two built-in playable templates:

- Match-3 Classic
- Merge-2 Order

However, the platform must be architected as a scalable template-based system so many additional playable types can be added later through a plugin architecture without redesigning the core product.

WePlable should feel like a premium internal creative production tool, combining the clarity of a modern SaaS dashboard, the usability of a creative editor, and the operational confidence of an internal production platform. It must not feel like a raw admin panel or developer console.

## 3. Problem Statement

Current playable production workflows are often slow, repetitive, and overly dependent on one-off implementation. Teams frequently recreate similar playable structures for different games, themes, and campaigns, leading to duplicated effort, inconsistent quality, and long turnaround times.

The company needs an internal platform that:

- standardizes playable production around reusable templates
- separates game runtime logic from project content and assets
- enables fast reskinning and variation creation
- provides reliable preview, validation, build, and export workflows
- allows developers to register and maintain new playable templates over time

## 4. Product Vision

Create a premium internal platform where teams can:

1. start from a proven playable template
2. swap assets and settings to adapt it to a new game or campaign
3. preview and QA the result instantly
4. validate compatibility and asset completeness
5. export submission-ready artifacts with minimal friction

## 5. Goals

### Primary Goal

Enable teams to create a playable ad, swap assets and settings to turn it into a different game’s ad, preview it instantly, then export HTML5 or ZIP packages ready for ad network submission.

### Business Goals

- reduce playable production time
- increase asset and template reuse
- improve consistency across playable outputs
- lower dependency on fully custom per-project development
- create a scalable foundation for future playable formats

### Product Goals

- support template-first creation workflows
- make preview and build first-class product actions
- support schema-driven editing for scalable forms
- support plugin-based template registration for developers
- make variation production fast through duplication and reskinning

## 6. Non-Goals

The following are explicitly out of scope for this version:

- analytics dashboards
- UA campaign management
- A/B testing tools
- performance reporting
- AI generation features
- advanced approval workflows

## 7. Core Product Principles

1. Template-first workflow
2. Schema-driven editing
3. Clear separation of runtime logic, content and config, theme and assets, and export rules
4. Fast variation production through duplication and reskinning
5. Extensible plugin-based template system
6. Preview and build are first-class features
7. Modern, highly readable, production-ready interface

## 8. Target Users

### Primary Users

- Creative production teams creating playable ads
- Internal marketers or producers preparing variations
- Designers and content operators swapping assets and themes
- QA or creative reviewers validating playable behavior before export

### Secondary Users

- Developers creating and maintaining new template plugins
- Internal platform owners managing templates, presets, and asset dependencies

## 9. Key Use Cases

### Use Case A: Create New Playable

1. User creates a new project
2. User selects a playable template
3. User selects an asset pack
4. User edits gameplay and content configuration
5. User edits tutorial and end card
6. User previews the playable
7. User runs validation
8. User builds export artifact
9. User downloads the final package

### Use Case B: Create Variation

1. User duplicates an existing project or version
2. User swaps the asset pack
3. User tweaks gameplay, tutorial, UI, or export settings
4. User previews the variation
5. User builds a new version
6. User downloads the updated artifact

### Use Case C: Add New Template

1. Developer opens Developer Center
2. Developer scaffolds a new template
3. Developer defines the manifest
4. Developer defines config and editor schemas
5. Developer implements runtime hooks
6. Developer defines validations
7. Developer runs sample seed and compatibility checks
8. Developer registers the template
9. Template appears in Templates and project creation flows

## 10. Success Metrics

The first version should be evaluated primarily on workflow enablement and operational readiness rather than campaign performance.

Suggested metrics:

- time to create first playable from a built-in template
- time to create a reskinned variation from an existing project
- percentage of projects built successfully without developer intervention
- percentage of validation issues caught before build
- number of playable templates successfully registered through the plugin architecture
- template reuse rate across projects

## 11. Functional Scope

This release focuses on:

- playable creation
- editable template-based configuration
- asset and theme swapping
- preview and QA
- build and export
- project and version management
- developer-facing template extensibility

## 12. Product Structure

### Global Navigation

The left sidebar must include:

- Dashboard
- Projects
- Templates
- Asset Packs
- Preview
- Builds
- Developer
- Settings

### Top Context Bar

The top bar must display:

- current project name
- current version
- template type
- asset pack
- last updated time
- build status
- primary actions: Preview, Build, Download

### Main Layout

The main application uses a three-zone layout:

- fixed left sidebar navigation
- central main workspace
- right-side inspector or status or properties panel

## 13. UX and Visual Design Requirements

### Product Positioning

The UI should feel like:

- a creative editor
- a polished SaaS dashboard
- an internal production platform

It must not feel like:

- a backend admin panel
- a raw developer console
- a noisy or game-like interface

### Visual Direction

- dark-neutral default theme
- dark graphite or charcoal background
- slightly elevated dark panels
- clean card-based layouts
- bento-style dashboard sections
- rounded-xl panels
- soft shadows
- thin borders
- strong typography hierarchy
- spacious layout
- restrained accent colors
- subtle gradients only where needed
- refined micro-interactions
- polished but restrained motion

### Color Direction

- primary accent: electric blue or blue-violet
- secondary accent: mint or aqua
- warning: amber
- error: coral or red
- neutral borders: cool gray

### Typography

- modern sans-serif
- large, confident page titles
- clearly readable section labels
- readable helper text
- avoid tiny developer-tool styling

## 14. Design System Requirements

The platform must include a reusable design system and component library with at least:

- Sidebar
- Topbar
- Page header
- Card
- Tabs
- Status badge
- Table
- Form section
- Dropdown
- Slider
- Toggle group
- Asset picker
- Modal
- Preview frame
- Build log panel
- Empty state
- Toast
- Validation alert
- Stepper
- Inspector panel

## 15. Information Architecture and Page Requirements

### 15.1 Dashboard

Purpose: provide at-a-glance production visibility.

Required content:

- recent projects
- recent builds
- template usage summary
- asset pack updates
- quick actions
- build failures or validation warnings

UX requirements:

- bento-style summary cards
- strong status chips
- clear recency and health indicators

### 15.2 Projects

Purpose: manage playable projects and versions.

Required features:

- create project
- duplicate project
- archive project
- search
- filter by template
- filter by status
- grid and list toggle
- version history
- restore previous snapshot

Each project card must show:

- project name
- template name
- asset pack name
- orientation
- owner
- last updated
- latest build status
- version count

### 15.3 Project Editor

Purpose: edit a project’s content, gameplay, assets, UI, and export settings.

Editor tabs:

- Overview
- Gameplay
- Theme
- Assets
- Tutorial
- UI
- End Card
- Audio
- Export

Editor layout requirements:

- left or upper sub-navigation for editor sections
- central main editing canvas or form panel
- right-side inspector for properties, validation, and status

#### Overview Tab

Must include:

- project summary
- template
- asset pack
- current version
- orientation
- last build status
- quick preview action
- quick build action

#### Gameplay Tab

Must be generated from template schemas whenever possible.

Support:

- board or field setup
- win conditions
- lose conditions
- turn or time limit
- spawn weights
- pacing values
- progression values

#### Theme Tab

Support:

- color theme tokens
- UI skin preset
- typography tokens
- background assignment
- icon style
- button style
- overall visual tone

#### Assets Tab

Support:

- image uploads
- sprite assignments
- audio assignments
- preview thumbnails
- asset health status
- missing asset warnings

#### Tutorial Tab

Support:

- step list
- add, remove, reorder steps
- pointer or finger placement
- target highlight
- forced input
- helper text
- delay timing
- auto-run or manual behavior

#### UI Tab

Support:

- HUD element visibility
- score or turn display toggles
- top bar and bottom bar layout options
- button visibility
- safe area behavior

#### End Card Tab

Support:

- end card background
- logo placement
- CTA text
- CTA style preset
- win or lose variation
- optional store badge placement
- safe tap area preview

#### Audio Tab

Support:

- BGM selection
- SFX assignment
- mute options
- preview playback controls

#### Export Tab

Support:

- export preset selector
- orientation override rules
- compression options
- package metadata
- final validation summary

### 15.4 Preview

Purpose: instantly test the playable.

Must include:

- live playable frame
- portrait and landscape toggle
- restart
- jump to tutorial step
- jump to end card
- debug overlay toggle
- safe area guides
- performance info
- validation warnings
- missing asset warnings

Requirement:

- the playable preview must be the primary visual focus of the page

### 15.5 Builds

Purpose: package and download export-ready artifacts.

Must include:

- build button
- build preset selector
- build history
- build queue or status
- build logs
- artifact size
- build status
- download action
- failed build diagnostics

Supported statuses:

- Draft
- Ready
- Validating
- Building
- Success
- Failed

### 15.6 Templates

Purpose: manage built-in and custom playable templates.

Must include:

- built-in template list
- custom template list
- manifest summary
- version
- compatible export presets
- schema status
- validation health

Initial built-in templates:

- Match-3 Classic
- Merge-2 Order

### 15.7 Asset Packs

Purpose: manage reusable theme and resource packages.

Must include:

- asset pack list
- preview image
- version
- linked project count
- dependency health
- duplicate
- import and export

Asset pack contents may include:

- backgrounds
- tiles or items
- characters
- UI assets
- logos
- end card art
- fonts
- audio
- VFX atlases

### 15.8 Developer Center

Purpose: allow developers to add new playable templates.

Must include:

- template registry
- create-template scaffold action
- config schema preview
- editor schema preview
- validation test runner
- sample seed runner
- build compatibility checker
- developer documentation panel

## 16. System Architecture Requirements

The product must be designed with clear separation between platform layers.

### 16.1 Runtime Core

Shared playable execution logic:

- input handling
- state machine
- scene lifecycle
- common hooks
- transitions
- shared utilities

### 16.2 Template Plugin Layer

Each playable type must be implemented as a template plugin providing:

- template manifest
- runtime entry
- config schema
- editor schema
- asset requirements
- preview hooks
- validation rules
- export compatibility
- default seed project

### 16.3 Schema Engine

The editor system must support schema-driven form generation.

Supported field types:

- text
- number
- range slider
- toggle
- enum dropdown
- color token
- asset reference
- list or repeater
- grouped object
- conditional section
- JSON advanced mode

Supported schema behaviors:

- defaults
- inline help text
- live validation
- collapsible groups
- field dependencies

### 16.4 Theme and Asset Layer

Must support:

- asset packs
- visual tokens
- dependency validation
- fallback assets
- versioned reusable packs

### 16.5 Preview and QA Layer

Must support:

- live preview
- debug controls
- warnings
- safe area visualization
- quick step jumping

### 16.6 Build and Export Layer

Must support:

- packaging
- compression
- build presets
- artifact generation
- logs
- download

### 16.7 Project and Version Layer

Must support:

- version snapshots
- duplication
- restore
- history
- build association

## 17. Initial Template Specifications

### 17.1 Template 1: Match-3 Classic

Requirements:

- grid-based board
- tile matching
- tile removal
- turn limit
- simple goals
- tutorial support
- win or lose transition
- end card trigger

### 17.2 Template 2: Merge-2 Order

Requirements:

- drag and merge identical items
- merged result generation
- limited board or slot structure
- order or goal progression
- tutorial support
- win or lose transition
- end card trigger

## 18. Template Manifest Requirements

Each template manifest must support:

- templateId
- templateName
- category
- description
- supportedOrientations
- version
- configSchemaVersion
- requiredAssets
- optionalModules
- compatiblePresets
- previewMode

## 19. Data Model Requirements

### Project

- id
- name
- owner
- templateId
- assetPackId
- currentVersionId
- orientation
- createdAt
- updatedAt

### Version

- id
- projectId
- versionName
- configSnapshot
- tutorialSnapshot
- themeSnapshot
- exportSnapshot
- status
- createdAt

### Template

- id
- name
- manifest
- runtimeEntry
- configSchema
- editorSchema
- requiredAssets
- compatiblePresets
- version

### AssetPack

- id
- name
- previewImage
- assets
- dependencyStatus
- version

### Build

- id
- projectId
- versionId
- presetId
- status
- logs
- fileSize
- artifactPath
- createdAt

### Preset

- id
- name
- network
- maxSize
- orientationRules
- packagingRules
- runtimeFlags

## 20. Export Preset System

The system must support export presets such as:

- Generic HTML5
- AppLovin
- Unity Ads
- Google
- Mintegral
- TikTok
- Meta

Each preset must define:

- max package size
- orientation support
- click behavior flags
- packaging structure
- validation rules

## 21. Validation System

Before build, the system must validate:

- missing required assets
- invalid config values
- template and preset incompatibility
- unsupported orientation
- package size risk
- broken tutorial references
- missing end card assets

Validation results must be surfaced in:

- right inspector
- preview warnings
- build summary
- build logs

## 22. MVP Scope

### Included in MVP

- Dashboard
- Projects
- Project Editor
- Preview
- Builds
- Templates
- Asset Packs
- Developer Center
- Match-3 Classic template
- Merge-2 Order template
- schema-driven editor base
- validation layer
- build and export preset UI

### Excluded from MVP

- analytics dashboards
- AI generation
- campaign management
- advanced approval workflows

## 23. Acceptance Criteria

1. User can create a project.
2. User can choose Match-3 Classic or Merge-2 Order.
3. User can assign an asset pack.
4. User can edit gameplay configuration through forms.
5. User can edit tutorial steps.
6. User can edit end card and CTA.
7. User can preview the playable instantly.
8. User can run validation.
9. User can build HTML5 or ZIP output from a preset.
10. User can download the artifact.
11. Developer can register a new template.
12. Schema-driven editor generation works for registered templates.

## 24. Delivery Phasing

### Phase 1

- app shell
- design system
- Dashboard
- Projects
- Project Editor
- Preview
- Builds
- initial data models
- Match-3 Classic
- Merge-2 Order

### Phase 2

- schema engine improvements
- template registry
- asset pack management
- validation engine
- export preset matrix
- Developer Center

### Phase 3

- additional playable template examples
- stronger asset dependency tools
- more robust preview and debug tooling
- more advanced version comparison

## 25. Product Requirements by Quality Attribute

### Usability

- users should be able to create a first playable without developer support
- forms should be understandable through labels, defaults, helper text, and validation
- the preview workflow should be accessible within one click from editing contexts

### Scalability

- new playable types should be registerable through plugins, not core rewrites
- schemas should drive most editor surface generation for future templates
- export presets should be extensible without redesigning the build system

### Reliability

- validation should catch most missing or incompatible project states before build
- build logs should surface actionable diagnostics for failed exports
- project versions should preserve restorable snapshots

### Maintainability

- runtime core, template plugins, schemas, assets, preview, and export concerns must remain separated
- shared UI components should be reusable across all sections
- typed models should align frontend and backend integration boundaries

## 26. Recommended Technical Direction

This should be implemented as a polished, scalable web application with:

- reusable component library
- schema-driven forms
- modular routing
- clear state management
- plugin registration architecture
- typed models
- mock backend support if a full backend is not yet implemented

If the backend is mocked initially, the structure must remain production-ready and easy to connect to real services later.

## 27. Open Product Decisions

The following items should be confirmed during planning or solution design:

- user roles and permission model for internal teams
- whether builds run fully client-side, server-side, or in hybrid mode
- artifact storage strategy for generated outputs
- whether asset packs are globally versioned or versioned per environment
- whether template plugins are bundled at build time or dynamically loaded
- exact export compliance requirements per ad network preset
- snapshot granularity and restore behavior for version history

## 28. Risks and Mitigations

### Risk: Template system becomes too hard-coded

Mitigation:

- enforce manifest and schema contracts
- keep template-specific logic inside plugin boundaries
- minimize special-case editor code

### Risk: Schema-generated editor becomes too generic or hard to use

Mitigation:

- support editor schema as distinct from raw config schema
- allow custom inspector widgets where necessary
- preserve strong information hierarchy in generated forms

### Risk: Preview diverges from export output

Mitigation:

- share runtime and validation logic between preview and build paths
- expose preset compatibility checks before build
- validate orientation and asset requirements consistently

### Risk: Asset pack dependencies create unstable builds

Mitigation:

- add dependency health indicators
- provide missing asset warnings early
- support fallback assets and pre-build validation

## 29. Final Product Statement

WePlable should launch as a premium internal creative production platform that makes playable ad creation faster, more modular, and more reliable. The product should provide a confident end-to-end workflow from project creation to preview, validation, build, and export, while laying a strong architectural foundation for future playable template expansion.
