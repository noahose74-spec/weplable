import type { ExternalPlayableCandidate } from '../types';

export const externalPlayables: ExternalPlayableCandidate[] = [
  {
    id: 'external-3match-repair',
    name: '3 Match Repair',
    folderName: '3match_Repair',
    templateId: 'match3-classic',
    templateName: 'Match-3 Classic',
    assetPackId: 'goblin-match-pack',
    assetPackName: 'Imported External Assets',
    orientation: 'Portrait',
    runtimePath: '/playables/3match_Repair/runtime/index.html',
    sourcePath: 'public/playables/3match_Repair/game',
    status: 'Ready',
    healthIssues: [
      'Source project detected at public/playables/3match_Repair/game.',
      'Runtime artifact is expected at public/playables/3match_Repair/runtime after running npm run build inside the source project.',
      'Registering this candidate creates a WePlable project that previews the built runtime in an iframe.'
    ]
  }
];

export function getExternalPlayableById(candidateId: string) {
  return externalPlayables.find((candidate) => candidate.id === candidateId);
}
