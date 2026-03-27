# WePlable Technical Specification

## 1. Document Overview

- Product: WePlable
- Based on:
  - [PRD-WePlable.md](D:\Vive\Weplable\PRD-WePlable.md)
  - [IA-Sitemap-WePlable.md](D:\Vive\Weplable\IA-Sitemap-WePlable.md)
  - [UX-Spec-WePlable.md](D:\Vive\Weplable\UX-Spec-WePlable.md)
- Purpose: Define the production-ready technical architecture for MVP and near-term extensibility

## 2. Technical Goals

1. Deliver a polished internal web application for playable creation and export.
2. Keep runtime core, template plugins, schemas, assets, preview, and build concerns separated.
3. Support schema-driven editors for current and future templates.
4. Enable plugin registration for new playable types without redesigning core UI.
5. Allow mock backend implementation first, while preserving production-ready boundaries.

## 3. Recommended Stack

### Frontend

- React
- TypeScript
- Vite or Next.js App Router in SPA-like internal mode
- TanStack Router or framework-native routing
- TanStack Query for server-state fetching/caching
- Zustand or Redux Toolkit for local app/editor state
- Zod for schemas and validation contracts
- Tailwind CSS or CSS variables + utility approach for design system
- Radix UI or headless primitives where useful

### Backend

MVP can start with mock data and local persistence, but the contract should assume a service backend.

Recommended long-term shape:

- Node.js / TypeScript service layer
- REST or RPC endpoints for project/build/template/asset management
- object storage for artifacts and assets
- background job worker for builds

## 4. High-Level Architecture

```text
App Shell
├─ Design System / UI Components
├─ Feature Modules
│  ├─ Dashboard
│  ├─ Projects
│  ├─ Editor
│  ├─ Preview
│  ├─ Builds
│  ├─ Templates
│  ├─ Asset Packs
│  └─ Developer Center
├─ Domain Layer
│  ├─ Project Domain
│  ├─ Template Domain
│  ├─ Asset Domain
│  ├─ Build Domain
│  └─ Preset Domain
├─ Platform Engines
│  ├─ Schema Engine
│  ├─ Validation Engine
│  ├─ Template Registry
│  ├─ Preview Runtime Bridge
│  └─ Build Orchestrator
└─ Data Access Layer
   ├─ Mock Repositories
   └─ API Repositories
```

## 5. Suggested Frontend Module Structure

```text
src/
├─ app/
│  ├─ router/
│  ├─ providers/
│  └─ layout/
├─ design-system/
│  ├─ components/
│  ├─ tokens/
│  └─ patterns/
├─ domains/
│  ├─ projects/
│  ├─ templates/
│  ├─ asset-packs/
│  ├─ builds/
│  └─ presets/
├─ features/
│  ├─ dashboard/
│  ├─ projects/
│  ├─ editor/
│  ├─ preview/
│  ├─ builds/
│  ├─ templates/
│  ├─ asset-packs/
│  ├─ developer/
│  └─ settings/
├─ engines/
│  ├─ schema-engine/
│  ├─ validation/
│  ├─ registry/
│  ├─ preview/
│  └─ build/
├─ plugins/
│  ├─ match3-classic/
│  └─ merge2-order/
├─ services/
│  ├─ api/
│  ├─ repositories/
│  └─ storage/
├─ mocks/
├─ shared/
│  ├─ types/
│  ├─ utils/
│  └─ constants/
└─ styles/
```

## 6. Core Architectural Decisions

### 6.1 Project-Centric Editing

The active editor is always bound to:

- one project
- one current version
- one template plugin
- one asset pack

This avoids editor ambiguity and simplifies top-bar context.

### 6.2 Plugin-Based Template System

Every playable type must be shipped as a template plugin module implementing a stable contract.

### 6.3 Schema-Driven Editor Rendering

Most editable configuration is derived from `configSchema` and `editorSchema`.

### 6.4 Separate Data Snapshots by Concern

Version data should be stored in separated snapshot slices:

- configSnapshot
- tutorialSnapshot
- themeSnapshot
- exportSnapshot

This improves restore/version diff possibilities later.

## 7. Domain Models

```ts
type ID = string;

type Orientation = 'portrait' | 'landscape' | 'both';
type BuildStatus = 'draft' | 'ready' | 'validating' | 'building' | 'success' | 'failed';

interface Project {
  id: ID;
  name: string;
  owner: string;
  templateId: ID;
  assetPackId: ID;
  currentVersionId: ID;
  orientation: Orientation;
  createdAt: string;
  updatedAt: string;
}

interface Version {
  id: ID;
  projectId: ID;
  versionName: string;
  configSnapshot: unknown;
  tutorialSnapshot: TutorialConfig;
  themeSnapshot: ThemeConfig;
  exportSnapshot: ExportConfig;
  status: BuildStatus;
  createdAt: string;
}

interface AssetPack {
  id: ID;
  name: string;
  previewImage: string;
  assets: AssetRecord[];
  dependencyStatus: 'healthy' | 'warning' | 'broken';
  version: string;
}

interface Build {
  id: ID;
  projectId: ID;
  versionId: ID;
  presetId: ID;
  status: BuildStatus;
  logs: BuildLogEntry[];
  fileSize?: number;
  artifactPath?: string;
  createdAt: string;
}

interface Preset {
  id: ID;
  name: string;
  network: string;
  maxSize: number;
  orientationRules: OrientationRuleSet;
  packagingRules: PackagingRuleSet;
  runtimeFlags: Record<string, boolean | string | number>;
}
```

## 8. Template Plugin Contract

Each plugin should export a single registration object:

```ts
interface TemplatePlugin {
  manifest: TemplateManifest;
  runtimeEntry: RuntimeEntry;
  configSchema: ConfigSchema;
  editorSchema: EditorSchema;
  requiredAssets: AssetRequirement[];
  compatiblePresets: string[];
  validations: ValidationRule[];
  previewHooks?: PreviewHooks;
  createSeedProject: () => SeedProjectData;
}
```

### Required Manifest Fields

```ts
interface TemplateManifest {
  templateId: string;
  templateName: string;
  category: string;
  description: string;
  supportedOrientations: Orientation[];
  version: string;
  configSchemaVersion: string;
  requiredAssets: string[];
  optionalModules: string[];
  compatiblePresets: string[];
  previewMode: 'interactive' | 'step-debug' | 'scripted';
}
```

## 9. Template Registry

The registry is the central source of truth for all available plugins.

Responsibilities:

- register built-in plugins
- register custom plugins
- expose template metadata to UI
- resolve template plugin by templateId
- provide schema/runtime/validation hooks to editor and preview

Suggested API:

```ts
interface TemplateRegistry {
  getAll(): TemplatePlugin[];
  getById(templateId: string): TemplatePlugin | undefined;
  register(plugin: TemplatePlugin): void;
  unregister(templateId: string): void;
}
```

## 10. Schema Engine

### Purpose

Render editable forms based on template-provided definitions.

### Supported Field Types

- text
- number
- range
- toggle
- enum
- colorToken
- assetRef
- repeater
- object
- conditional
- json

### Suggested Schema Shape

```ts
interface SchemaFieldBase {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  helpText?: string;
  defaultValue?: unknown;
  visibleWhen?: VisibilityRule;
}

interface EditorSection {
  id: string;
  title: string;
  collapsible?: boolean;
  fields: SchemaField[];
}
```

### Engine Responsibilities

- render form fields from schema definitions
- apply default values
- map field values to version snapshots
- evaluate field dependencies
- render collapsible groups
- support advanced JSON mode
- surface inline validation

## 11. Validation Engine

### Validation Sources

- shared platform validations
- template plugin validations
- export preset validations
- asset dependency validations

### Output Contract

```ts
interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  section?: string;
  fieldPath?: string;
  source: 'project' | 'template' | 'preset' | 'asset-pack' | 'build';
}
```

### Validation Timing

- on field change for lightweight rules
- on tab entry for section-level summary
- on preview open
- on export tab open
- before build

## 12. Asset and Theme Layer

### Asset Pack Structure

Asset packs should support:

- manifest metadata
- asset record list
- dependency status
- preview image
- version

Suggested asset model:

```ts
interface AssetRecord {
  id: string;
  key: string;
  category: 'background' | 'tile' | 'item' | 'character' | 'ui' | 'logo' | 'audio' | 'vfx' | 'font';
  uri: string;
  mimeType: string;
  width?: number;
  height?: number;
  tags?: string[];
}
```

### Theme Layer

Theme configuration should be stored separately from asset references and gameplay config.

Theme snapshot should include:

- token overrides
- skin preset
- typography tokens
- background selection
- icon/button styles

## 13. Preview Architecture

### Goal

Use the same core runtime assumptions between preview and exported artifact wherever possible.

### Preview Composition

```text
Preview Page
├─ Preview Controls
├─ Preview Frame
│  └─ Runtime Host
│     ├─ Template Runtime Entry
│     ├─ Project Snapshot
│     ├─ Asset Bindings
│     └─ Preview Hooks
└─ Inspector
   ├─ Validation
   ├─ Performance
   └─ Debug State
```

### Preview Runtime Inputs

- template runtime entry
- project config snapshot
- tutorial snapshot
- theme snapshot
- export/runtime flags
- asset bindings

### Preview Runtime Controls

- restart
- set orientation
- jump to tutorial step
- jump to end card
- enable debug overlay

## 14. Build and Export Architecture

### MVP Assumption

The UI can begin with mocked build jobs, but the system should model a real asynchronous build pipeline.

### Build Pipeline Stages

1. Validate project/version/preset
2. Resolve plugin/runtime bundle
3. Resolve assets/theme bindings
4. Apply preset packaging rules
5. Compress/package artifact
6. Store artifact/log metadata
7. Expose downloadable build record

### Build Service Contract

```ts
interface BuildRequest {
  projectId: string;
  versionId: string;
  presetId: string;
}

interface BuildResult {
  buildId: string;
  status: BuildStatus;
  logs: BuildLogEntry[];
  artifactPath?: string;
  fileSize?: number;
}
```

## 15. Export Preset System

Each preset defines:

- max package size
- orientation support
- click behavior flags
- packaging structure
- validation rules

Suggested preset contract:

```ts
interface ExportPresetDefinition {
  id: string;
  name: string;
  network: string;
  supports: {
    portrait: boolean;
    landscape: boolean;
  };
  maxPackageSizeBytes: number;
  clickBehaviorFlags: Record<string, boolean>;
  packagingRules: PackagingRuleSet;
  validationRules: ValidationRule[];
}
```

## 16. State Management Strategy

### Server State

Use TanStack Query for:

- projects
- versions
- templates
- asset packs
- builds
- presets

### Client/UI State

Use local store for:

- active editor tab
- unsaved draft changes
- preview control state
- selected inspector item
- modal visibility

### Derived State

Compute:

- active template plugin
- merged project snapshot
- validation summary by section
- build readiness state

## 17. Data Access Layer

Repository interfaces should isolate the UI from mock vs real backend choices.

Suggested repositories:

- ProjectRepository
- VersionRepository
- TemplateRepository
- AssetPackRepository
- BuildRepository
- PresetRepository

Example:

```ts
interface ProjectRepository {
  list(): Promise<Project[]>;
  getById(id: string): Promise<Project>;
  create(input: CreateProjectInput): Promise<Project>;
  update(id: string, patch: Partial<Project>): Promise<Project>;
  archive(id: string): Promise<void>;
  duplicate(id: string): Promise<Project>;
}
```

## 18. Mock Backend Strategy

For MVP bootstrapping:

- use in-memory or JSON-backed repositories
- generate deterministic seed data
- keep async repository APIs identical to future network APIs
- simulate build queue transitions with timers

Do not leak mock-only assumptions into page components.

## 19. Routing and Screen Composition

Suggested route grouping:

- app shell routes
- project routes
- preview routes
- builds routes
- developer routes

Each route should load only the data it needs and compose shared shells:

- `AppShell`
- `ProjectShell`
- `DeveloperShell`

## 20. Component System Strategy

### Foundation Components

- Button
- Card
- Badge
- Tabs
- Modal
- Toast
- Table
- EmptyState

### Domain Components

- ProjectCard
- TemplateCard
- AssetPackCard
- ValidationPanel
- BuildLogPanel
- PreviewFrame
- InspectorPanel
- SchemaFormRenderer

### Design Tokens

Use CSS variables for:

- color scale
- spacing scale
- radius scale
- typography scale
- shadow scale
- motion timing

## 21. Error Handling

Must distinguish:

- data loading failure
- schema rendering failure
- preview runtime failure
- build failure
- asset resolution failure

Each error surface should include:

- readable summary
- source context
- recovery action when available

## 22. Security and Access Considerations

MVP assumptions:

- internal-only authenticated environment
- no public access requirement

Still recommended:

- protect build artifact URLs
- validate uploaded asset file types
- sanitize text inputs for metadata/config fields
- isolate template execution boundaries where possible

## 23. Observability for Engineering

Even without product analytics dashboards, engineering should log:

- template registration failures
- schema render failures
- preview runtime crashes
- build pipeline failures
- repository/API errors

## 24. Testing Strategy

### Unit Tests

- schema engine field rendering
- validation engine rules
- template registry behavior
- data adapters

### Integration Tests

- create project flow
- edit gameplay/theme/assets/tutorial
- preview startup and controls
- build flow
- template registration flow

### Contract Tests

- plugin contract compliance
- export preset validation contract
- repository interface parity across mock and API implementations

### Visual/UX Tests

- critical page layouts
- dark theme contrast
- major component states

## 25. Initial Plugin Implementation Notes

### Match-3 Classic Plugin

Should implement:

- grid board model
- match detection
- tile removal/cascade logic
- turn limit
- goal completion logic
- tutorial hooks
- end card transition

### Merge-2 Order Plugin

Should implement:

- drag/merge interaction
- identical item merge resolution
- result spawning
- board/slot constraints
- order progression logic
- tutorial hooks
- end card transition

## 26. Suggested Delivery Sequence

1. App shell, routing, design tokens, core layout
2. Domain models, repositories, mock data
3. Projects + Project Editor scaffolding
4. Schema engine base + validation base
5. Match-3 Classic and Merge-2 Order plugins
6. Preview host/runtime bridge
7. Builds and preset UI
8. Templates, Asset Packs, Developer Center

## 27. Key Risks

### Risk: Plugin API becomes unstable

Mitigation:

- freeze a minimal plugin contract early
- add contract tests

### Risk: Preview/build behavior diverges

Mitigation:

- share validation and runtime inputs
- unify preset application rules

### Risk: Editor state becomes hard to manage

Mitigation:

- separate server state from draft state
- keep snapshot slices scoped by tab/domain

### Risk: Mock backend blocks real integration later

Mitigation:

- require repository interfaces from day one
- keep page logic unaware of storage mechanism
