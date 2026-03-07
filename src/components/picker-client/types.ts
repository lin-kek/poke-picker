import type { PickerMode, PokemonCardData, PokemonListItem } from "@/types/pokemon";

export interface PickerClientProps {
  mode: PickerMode;
  initialPool: PokemonListItem[];
}

export type PickerPhase = "selection" | "ranking" | "finished";

export interface UsePickerStateResult {
  targetCount: number;
  phase: PickerPhase;
  remainingPool: PokemonListItem[];
  currentCards: PokemonCardData[];
  resultCards: PokemonCardData[];
  loadingPair: boolean;
  loadingResult: boolean;
  finalists: PokemonListItem[];
  rankedTop: PokemonListItem[];
  currentRankingCandidate: PokemonListItem | null;
  pendingRankingCandidates: PokemonListItem[];
  handlePick: (winnerId: number) => void;
  handleSelectionSkip: () => void;
  handleRestart: () => void;
}
