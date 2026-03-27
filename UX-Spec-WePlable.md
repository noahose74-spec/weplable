# WePlable UX Specification

## 1. Document Overview

- Product: WePlable
- Based on:
  - [PRD-WePlable.md](D:\Vive\Weplable\PRD-WePlable.md)
  - [IA-Sitemap-WePlable.md](D:\Vive\Weplable\IA-Sitemap-WePlable.md)
- Purpose: Define screen-level UX behavior, layout expectations, interactions, states, and validation surfaces for MVP

## 2. Global UX Framework

### 2.1 App Shell

All primary pages share:

- fixed left sidebar navigation
- top context bar
- central content workspace
- right inspector panel

### 2.2 Global Sidebar Behavior

- persistent across authenticated app pages
- highlights current section
- supports compact and expanded modes
- includes section icons and labels
- includes visual separation between creator workflows and developer workflows

### 2.3 Top Context Bar Behavior

When a project is active, show:

- project name
- current version
- template type
- asset pack
- last updated
- build status
- actions: Preview, Build, Download

Behavior:

- sticky on scroll
- actions remain accessible across editor tabs
- build/download actions reflect current version and latest build status

### 2.4 Right Inspector Behavior

The right panel changes by page context:

- editor tabs: field properties, inline help, validation, status
- preview: warnings, debug toggles, performance, safe areas
- builds: logs, diagnostics, artifact metadata
- management pages: metadata, health, summary stats

### 2.5 Global Interaction Patterns

- autosave or explicit save indicator must be visible
- destructive actions use confirmation modal
- duplicate, archive, restore, build, and download actions surface toast feedback
- validation appears inline and in summary surfaces
- keyboard focus states must remain visible and readable in dark mode

## 3. Dashboard

### Purpose

Give users a fast understanding of production state and provide quick entry points.

### Primary Users

- producers
- creative operators
- reviewers

### Layout

- page header with title and quick actions
- bento card grid in central workspace
- right inspector with health summary and alerts

### Required Modules

- recent projects
- recent builds
- template usage summary
- asset pack updates
- quick actions
- build failures
- validation warnings

### Key Interactions

- click project card to open project editor
- click build item to open build detail
- click warning to open relevant project/version
- click quick action to create project or open preview/builds

### States

- populated dashboard
- empty state for new workspace
- warning-heavy state with surfaced failures

## 4. Projects List

### Purpose

Help users discover, create, filter, and manage playable projects.

### Layout

- page header with create action
- filter/search toolbar
- grid/list toggle
- project result area
- optional right inspector for selected project summary

### Required Controls

- search field
- filter by template
- filter by status
- filter by owner if needed later
- grid/list view toggle
- create project button

### Project Card Content

- project name
- template name
- asset pack name
- orientation
- owner
- last updated
- latest build status
- version count

### Project Card Actions

- open
- duplicate
- archive
- quick preview
- quick build

### States

- default results
- filtered results
- empty search result
- archived state indicator

## 5. Create Project Flow

### Purpose

Guide users through minimal required setup to create a valid project quickly.

### Recommended Pattern

Modal or stepper flow with 3-4 steps.

### Steps

1. Name project
2. Select template
3. Select asset pack
4. Confirm orientation and create

### Required Inputs

- project name
- template
- asset pack
- orientation

### Validation

- project name required
- template required
- asset pack required
- selected orientation must be supported by template

### Completion Behavior

- create project with seed/default version
- route user directly to Project Overview tab

## 6. Project Editor

### Purpose

Provide a focused workspace to configure playable behavior and content.

### Shared Layout

- editor tab navigation at top or left
- central editing surface
- right inspector with field help, validation, status, and quick actions

### Shared Behaviors

- tab changes preserve unsaved progress
- validation summary updates live
- preview and build actions always visible
- schema-driven sections support collapsible groups

## 7. Project Editor: Overview Tab

### Purpose

Summarize project status and provide quick launch actions.

### Content

- project summary
- selected template
- selected asset pack
- current version
- orientation
- last build status
- quick preview button
- quick build button

### Useful Extras

- recent changes
- validation summary chip
- build readiness indicator

## 8. Project Editor: Gameplay Tab

### Purpose

Expose gameplay-specific configuration through schema-driven forms.

### Layout

- grouped form sections in central column
- live summary and validation in inspector

### Supported Inputs

- board/field setup
- win conditions
- lose conditions
- turn/time limit
- spawn weights
- pacing values
- progression values

### Behavior

- fields appear based on selected template schema
- conditional sections hide irrelevant controls
- advanced JSON mode available for power users

### Validation

- invalid ranges
- missing required goals
- illegal board dimensions
- template rule conflicts

## 9. Project Editor: Theme Tab

### Purpose

Allow visual reskinning without changing runtime logic.

### Content

- color tokens
- skin preset selector
- typography tokens
- background selection
- icon style
- button style
- overall visual tone settings

### UX Notes

- show live token swatches
- show small component previews where possible
- clarify inherited vs overridden values

## 10. Project Editor: Assets Tab

### Purpose

Map project asset requirements to uploaded or pack-provided files.

### Content

- asset category sections
- upload areas
- asset picker dialogs
- preview thumbnails
- dependency and health indicators

### UX Notes

- required assets visually separated from optional
- missing assets surfaced prominently
- asset source should indicate pack-provided vs project override

### Validation

- missing required asset
- wrong file type
- failed load/preview
- dimension or ratio mismatch if applicable

## 11. Project Editor: Tutorial Tab

### Purpose

Configure onboarding/tutorial behavior for each playable.

### Content

- ordered step list
- add/remove/reorder controls
- pointer/finger position controls
- target highlight selector
- forced input toggle
- helper text
- delay timing
- auto-run/manual options

### UX Notes

- step list should be easy to reorder
- selecting a step updates inspector detail
- preview deep-link into selected step should be one click away

### Validation

- broken target references
- empty helper text when required
- invalid timing values

## 12. Project Editor: UI Tab

### Purpose

Configure HUD and layout behavior outside of core gameplay.

### Content

- HUD visibility toggles
- score/turn display
- top/bottom bar layout
- button visibility
- safe area behavior

### UX Notes

- include lightweight layout previews
- clearly mark mobile-safe area implications

## 13. Project Editor: End Card Tab

### Purpose

Configure the end state conversion surface.

### Content

- background selection
- logo placement
- CTA text
- CTA style preset
- win/lose variation controls
- store badge placement
- safe tap area preview

### UX Notes

- end card preview should be visually prominent
- tap-safe area overlay should be toggleable

### Validation

- missing logo or CTA where required
- tap target overlaps unsafe area
- missing background asset

## 14. Project Editor: Audio Tab

### Purpose

Assign and preview BGM/SFX behavior.

### Content

- BGM selection
- SFX assignment
- mute options
- preview playback controls

### UX Notes

- playback controls should be instant and obvious
- audio assignment rows should show file status and duration if available

## 15. Project Editor: Export Tab

### Purpose

Prepare a project version for export and surface build readiness.

### Content

- export preset selector
- orientation override rules
- compression options
- package metadata
- final validation summary

### UX Notes

- show preset compatibility clearly
- summarize package risk before user builds

### Validation

- unsupported preset/template pairing
- orientation incompatibility
- metadata omissions
- size risk warning

## 16. Preview Page

### Purpose

Provide instant interactive QA for the playable.

### Layout

- central large preview frame as primary focus
- control strip above or beside preview
- right inspector for debug, warnings, performance, and state

### Required Controls

- portrait/landscape toggle
- restart
- jump to tutorial step
- jump to end card
- debug overlay toggle
- safe area guides toggle

### Required Panels

- live playable frame
- validation warnings
- missing asset warnings
- performance info

### UX Notes

- preview should preserve clear focus and not be visually crowded
- orientation switching should animate smoothly
- warnings should not block play unless critical

## 17. Builds Page

### Purpose

Allow users to validate, package, inspect, and download artifacts.

### Layout

- page header with build action
- preset/build controls
- build queue/history list
- build log/detail area
- inspector with artifact metadata and diagnostics

### Required Features

- build button
- build preset selector
- build history
- build queue/status
- build logs
- artifact size
- build status
- download action
- failed diagnostics

### Status UX

- Draft
- Ready
- Validating
- Building
- Success
- Failed

Each status needs a distinct visual badge and readable explanation.

## 18. Templates Page

### Purpose

Help users browse available playable templates and understand readiness.

### Layout

- template category segmentation
- built-in vs custom sections
- selected template summary/detail pane

### Required Content

- template list
- manifest summary
- version
- compatible export presets
- schema status
- validation health

### UX Notes

- built-in templates should feel trusted and clearly labeled
- custom templates should surface health and compatibility clearly

## 19. Asset Packs Page

### Purpose

Manage reusable content bundles for fast reskinning.

### Layout

- asset pack list/grid
- pack detail summary
- preview image and dependency health

### Required Content

- pack name
- preview image
- version
- linked project count
- dependency health
- duplicate action
- import/export action

### UX Notes

- preview imagery is important here
- pack dependency health should be visible before entering detail

## 20. Developer Center

### Purpose

Give developers the tooling needed to add and validate new playable templates.

### Layout

- developer navigation tabs or sub-sections
- central work area for scaffold/schema/validation
- inspector for compatibility and status

### Required Areas

- template registry
- create-template scaffold action
- config schema preview
- editor schema preview
- validation test runner
- sample seed runner
- build compatibility checker
- documentation panel

### UX Notes

- this area can be more technical than the rest of the product
- still preserve the premium product visual language
- avoid exposing raw implementation complexity without structure

## 21. Settings

### Purpose

Configure lightweight app preferences and preset administration.

### MVP Content

- workspace preferences
- export preset settings
- general settings

## 22. Core User Flows

### Flow A: Create New Playable

1. User opens Projects.
2. User clicks Create Project.
3. User completes project setup flow.
4. User lands on Project Overview.
5. User edits Gameplay, Tutorial, End Card, and Assets.
6. User opens Preview and tests the playable.
7. User reviews validation summary.
8. User builds from Export tab or Builds page.
9. User downloads artifact.

### Flow B: Create Variation

1. User duplicates project or version.
2. User swaps asset pack and/or theme tokens.
3. User adjusts config.
4. User previews.
5. User builds new version.
6. User downloads artifact.

### Flow C: Add New Template

1. Developer opens Developer Center.
2. Developer scaffolds a template.
3. Developer edits manifest and schemas.
4. Developer runs validation/sample seed.
5. Developer registers template.
6. Template appears in Templates and project creation.

## 23. Validation UX

### Validation Surfaces

- inline form error
- right inspector summary
- preview warning panel
- export summary
- build logs

### Severity Levels

- error: blocks build or indicates broken configuration
- warning: build may still proceed but risk is present
- info: helpful guidance or optimization suggestion

### UX Behavior

- errors should link users back to the offending section when possible
- warning copy should be concise and actionable
- validation should update without full page refresh

## 24. Notification UX

### Toasts

Use for:

- save success
- duplicate success
- archive success
- build started
- build success
- build failure

### Modals

Use for:

- archive confirmation
- restore snapshot confirmation
- destructive removal of tutorial/assets

## 25. Empty, Loading, and Error States

### Empty States

- no projects
- no builds
- no asset packs
- no custom templates

### Loading States

- skeleton cards for dashboard/projects/templates
- placeholder preview frame while runtime loads
- streaming or incremental logs for builds

### Error States

- failed build
- asset load failure
- schema render failure
- runtime preview failure

All error states should explain next action when possible.

## 26. Accessibility and Readability Requirements

- maintain strong contrast in dark theme
- avoid tiny text in forms and inspector panels
- keyboard-navigable controls and focus states
- status should not rely on color alone
- warning/error messages should be readable without truncation

## 27. Responsive Behavior

MVP target is desktop-first, but the app should remain functional on smaller widths.

- sidebar can collapse
- right inspector can become slide-over
- dense multi-column layouts should stack at narrower widths
- preview frame should preserve aspect ratio clearly

## 28. UX Risks and Mitigations

### Risk: Schema forms feel overwhelming

Mitigation:

- group fields by mental model
- use progressive disclosure
- collapse advanced options by default

### Risk: Too many entry points confuse users

Mitigation:

- keep Projects as the primary starting point for creation/editing
- reserve Preview and Builds for execution-focused flows

### Risk: Developer tools dilute creator experience

Mitigation:

- isolate technical tools in Developer Center
- keep creator-facing pages polished and editorial in tone
