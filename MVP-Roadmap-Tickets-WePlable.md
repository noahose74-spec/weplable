# WePlable MVP Roadmap and Tickets

## 1. Document Overview

- Product: WePlable
- Based on:
  - [PRD-WePlable.md](D:\Vive\Weplable\PRD-WePlable.md)
  - [IA-Sitemap-WePlable.md](D:\Vive\Weplable\IA-Sitemap-WePlable.md)
  - [UX-Spec-WePlable.md](D:\Vive\Weplable\UX-Spec-WePlable.md)
  - [Tech-Spec-WePlable.md](D:\Vive\Weplable\Tech-Spec-WePlable.md)
- Purpose: Break MVP into delivery roadmap, epics, and implementable tickets

## 2. MVP Delivery Strategy

MVP should be delivered in four execution waves:

1. Foundation
2. Core Creation Flow
3. Preview / Build / Validation
4. Extensibility and Operational Readiness

## 3. Roadmap Overview

## Wave 1: Foundation

Goal:

- establish app shell, design system, routing, typed models, and mock data/repositories

Exit criteria:

- user can navigate core sections
- foundational components and dark theme are in place
- repository interfaces and seed data are functional

## Wave 2: Core Creation Flow

Goal:

- enable project creation, editor tabs, asset pack assignment, and schema-driven editing base

Exit criteria:

- user can create a project from Match-3 Classic or Merge-2 Order
- user can edit gameplay, tutorial, theme, assets, end card, and export settings

## Wave 3: Preview / Build / Validation

Goal:

- enable live preview, validation visibility, build initiation, artifact download, and build diagnostics

Exit criteria:

- user can preview, validate, build, and download a playable artifact

## Wave 4: Extensibility and Operational Readiness

Goal:

- enable developer-facing template registration and improve platform completeness around templates/asset packs/builds

Exit criteria:

- developer can scaffold/register a new template
- templates, asset packs, and builds sections are usable as standalone management surfaces

## 4. Epic Breakdown

### Epic A: App Foundation

Outcome:

- production-ready frontend skeleton and UI system

### Epic B: Project Management

Outcome:

- users can create, browse, duplicate, archive, and restore projects/versions

### Epic C: Project Editor

Outcome:

- users can configure project content through tabbed editing

### Epic D: Schema and Validation Engine

Outcome:

- templates can drive forms and validation behavior

### Epic E: Playable Template Plugins

Outcome:

- built-in Match-3 Classic and Merge-2 Order plugins operate in the platform

### Epic F: Preview and QA

Outcome:

- users can test playable behavior interactively

### Epic G: Build and Export

Outcome:

- users can package and download artifacts with preset selection and logs

### Epic H: Template and Asset Management

Outcome:

- users can browse templates and asset packs as reusable platform resources

### Epic I: Developer Center

Outcome:

- developers can scaffold, inspect, validate, and register new templates

## 5. Ticket Backlog

The tickets below are written as implementation-ready backlog items. IDs are suggested for planning and can be remapped to Jira/Linear/etc.

## Epic A: App Foundation

### WPL-001 App bootstrap and tooling

- Set up React + TypeScript application shell
- Configure routing, linting, formatting, and test runner
- Add base folder structure aligned to domain/features/engines/plugins

Acceptance criteria:

- app runs locally
- routes can be defined centrally
- TypeScript build passes

### WPL-002 Design tokens and dark theme foundation

- Define color, spacing, radius, shadow, typography, and motion tokens
- Implement default dark theme with premium SaaS look

Acceptance criteria:

- tokens are reusable across components
- core surfaces reflect approved visual direction

### WPL-003 Core layout shell

- Build persistent sidebar, top context bar, and right inspector shell
- Support responsive collapse behavior

Acceptance criteria:

- app shell renders across all core routes
- active nav state works
- top bar supports project context injection

### WPL-004 Foundation component library

- Implement Button, Card, Tabs, Badge, Table, Modal, Toast, EmptyState, Stepper

Acceptance criteria:

- components support dark theme
- components cover base states and accessibility focus styles

### WPL-005 Repository interfaces and mock data layer

- Define repository contracts for projects, versions, templates, asset packs, builds, presets
- Implement mock repositories and seed data

Acceptance criteria:

- screens can load data through repositories
- mock and future API boundaries are isolated

## Epic B: Project Management

### WPL-010 Projects list page

- Build projects index with grid/list toggle
- Add search and filters

Acceptance criteria:

- user can browse project cards
- user can filter by template/status

### WPL-011 Create project flow

- Implement create project modal/stepper
- Support template, asset pack, and orientation selection

Acceptance criteria:

- project can be created with required fields
- unsupported orientation is blocked

### WPL-012 Duplicate/archive project actions

- Add duplicate and archive actions from project list/detail
- Add confirmations and success toasts

Acceptance criteria:

- project duplication creates a usable copy
- archived project is hidden or marked per design

### WPL-013 Version history and snapshot restore

- Build version history surface
- Add restore snapshot action

Acceptance criteria:

- user can view version list
- restore updates current active version reference correctly

## Epic C: Project Editor

### WPL-020 Project editor shell and tab navigation

- Build editor route layout and tab system
- Connect active project/version context

Acceptance criteria:

- all editor tabs are routable
- shared actions remain accessible

### WPL-021 Overview tab

- Implement overview summary cards and quick actions

Acceptance criteria:

- overview displays template, asset pack, version, orientation, build status

### WPL-022 Gameplay tab base

- Implement schema-driven gameplay editing surface

Acceptance criteria:

- gameplay fields render from template-provided schemas
- changes persist to version snapshot

### WPL-023 Theme tab

- Implement theme token and skin editing UI

Acceptance criteria:

- user can change visual tokens and see summary/preview hints

### WPL-024 Assets tab

- Implement asset assignment surface with previews and health states

Acceptance criteria:

- user can map/upload/select required assets
- missing assets are highlighted

### WPL-025 Tutorial tab

- Implement tutorial step list and inspector editing

Acceptance criteria:

- user can add/remove/reorder tutorial steps
- step-level fields persist correctly

### WPL-026 UI tab

- Implement HUD/layout configuration controls

Acceptance criteria:

- user can change HUD and layout options

### WPL-027 End Card tab

- Implement end card editor with CTA and safe tap area preview

Acceptance criteria:

- user can configure CTA text/style and placement-related fields

### WPL-028 Audio tab

- Implement BGM/SFX assignment UI with playback controls

Acceptance criteria:

- audio selections persist and preview playback works in UI layer

### WPL-029 Export tab

- Implement export preset selector, compression options, metadata, and validation summary

Acceptance criteria:

- user can select preset and review final readiness state

## Epic D: Schema and Validation Engine

### WPL-030 Schema engine field renderer

- Build renderer for text, number, range, toggle, enum, colorToken, assetRef, repeater, object, conditional, json

Acceptance criteria:

- supported field types render consistently
- default values and help text work

### WPL-031 Editor schema section model

- Add support for collapsible groups, tab-local sections, and field dependencies

Acceptance criteria:

- conditional visibility works
- advanced groups can collapse/expand

### WPL-032 Validation engine core

- Implement shared validation issue contract and validation execution pipeline

Acceptance criteria:

- validation can aggregate platform/template/preset issues

### WPL-033 Validation UI surfaces

- Surface validation in inspector, preview warnings, export summary, and build logs

Acceptance criteria:

- errors/warnings are visible in all required surfaces

## Epic E: Playable Template Plugins

### WPL-040 Template plugin contract and registry

- Implement plugin interface and registry service

Acceptance criteria:

- built-in templates can register and resolve through registry

### WPL-041 Match-3 Classic plugin

- Implement manifest, schemas, seed config, validations, and preview runtime entry

Acceptance criteria:

- Match-3 Classic can be selected in project creation and edited in Project Editor

### WPL-042 Merge-2 Order plugin

- Implement manifest, schemas, seed config, validations, and preview runtime entry

Acceptance criteria:

- Merge-2 Order can be selected in project creation and edited in Project Editor

## Epic F: Preview and QA

### WPL-050 Preview page shell

- Build preview page layout and controls

Acceptance criteria:

- live preview frame is primary focus
- restart/orientation/debug controls are visible

### WPL-051 Preview runtime host

- Connect active project/version/template data into runtime host

Acceptance criteria:

- preview initializes from current project data
- restart reloads predictable state

### WPL-052 Preview debug and jump actions

- Add tutorial-step jump, end-card jump, safe-area overlay, debug overlay, performance panel

Acceptance criteria:

- each debug control changes preview state correctly

## Epic G: Build and Export

### WPL-060 Export preset definitions

- Create preset definitions for Generic HTML5, AppLovin, Unity Ads, Google, Mintegral, TikTok, Meta

Acceptance criteria:

- presets expose size/orientation/rule metadata

### WPL-061 Build pipeline service (mock-first)

- Implement build request lifecycle, status transitions, and log generation

Acceptance criteria:

- build transitions through validating/building/success or failed

### WPL-062 Builds page

- Build build-history page with queue, status, logs, and download actions

Acceptance criteria:

- user can inspect build history and open build details

### WPL-063 Download artifact action

- Implement artifact availability state and download action

Acceptance criteria:

- successful builds expose downloadable artifact metadata/action

## Epic H: Template and Asset Management

### WPL-070 Templates page

- Implement built-in/custom template listing and detail summary

Acceptance criteria:

- template metadata, schema health, and preset compatibility are visible

### WPL-071 Asset packs page

- Implement asset pack list/detail with preview image, version, linked counts, health, duplicate, import/export UI

Acceptance criteria:

- user can browse packs and inspect dependency health

### WPL-072 Asset dependency health logic

- Add dependency checks between template requirements and asset pack contents

Acceptance criteria:

- broken/missing dependency states are computed and surfaced

## Epic I: Developer Center

### WPL-080 Developer Center shell

- Implement developer-specific page layout and navigation

Acceptance criteria:

- template registry and tooling sections are reachable

### WPL-081 Create-template scaffold action

- Implement scaffold flow for new template plugin metadata and starter files/config

Acceptance criteria:

- developer can create a new template scaffold through UI or service action

### WPL-082 Config/editor schema preview

- Build schema preview tooling for developers

Acceptance criteria:

- developer can inspect config and editor schemas separately

### WPL-083 Validation runner and sample seed runner

- Add template validation runner and seed project generation/testing

Acceptance criteria:

- developer can run template checks before registration

### WPL-084 Build compatibility checker

- Implement compatibility matrix check against export presets

Acceptance criteria:

- incompatible preset/template combinations are identified clearly

## 6. Suggested Sprint Grouping

### Sprint 1

- WPL-001
- WPL-002
- WPL-003
- WPL-004
- WPL-005

### Sprint 2

- WPL-010
- WPL-011
- WPL-020
- WPL-021
- WPL-040

### Sprint 3

- WPL-030
- WPL-031
- WPL-022
- WPL-023
- WPL-024

### Sprint 4

- WPL-025
- WPL-026
- WPL-027
- WPL-029
- WPL-041
- WPL-042

### Sprint 5

- WPL-032
- WPL-033
- WPL-050
- WPL-051
- WPL-052

### Sprint 6

- WPL-060
- WPL-061
- WPL-062
- WPL-063
- WPL-013

### Sprint 7

- WPL-070
- WPL-071
- WPL-072
- WPL-080
- WPL-082

### Sprint 8

- WPL-081
- WPL-083
- WPL-084
- hardening, QA, bug fixing

## 7. MVP Exit Checklist

- user can create a project
- user can choose Match-3 Classic or Merge-2 Order
- user can assign an asset pack
- user can edit gameplay configuration through forms
- user can edit tutorial steps
- user can edit end card and CTA
- user can preview the playable instantly
- user can run validation
- user can build HTML5/ZIP output from a preset
- user can download the artifact
- developer can register a new template
- schema-driven editor generation works for registered templates

## 8. Dependencies and Critical Path

### Critical Path Items

- app shell
- repository/data layer
- plugin registry
- schema engine base
- project editor shell
- built-in template plugins
- preview runtime host
- build pipeline

### Key Dependency Notes

- Project Editor depends on app shell, repositories, and template registry
- Gameplay editing depends on schema engine
- Preview depends on plugin runtime entries and merged project snapshots
- Build flow depends on validation engine and preset definitions
- Developer Center depends on plugin contract/registry maturity

## 9. Recommended Team Split

If parallelized across a small product squad:

- Track A: App shell, design system, routing, shared components
- Track B: Projects, editor shell, schema rendering
- Track C: Template plugins, preview runtime, validation/build logic
- Track D: Templates/asset packs/developer center and QA hardening

## 10. Post-MVP Candidate Backlog

- Match-3 Objective template
- Sort Puzzle template
- Water Sort template
- Ball Sort template
- Physics Remove template
- Runner Collect template
- Shooter-lite template
- Interactive Video template
- Quiz / Choice Puzzle template
- Card Merge template
- advanced version diff/comparison
- stronger asset dependency graphing
- more powerful preview debugging tools
