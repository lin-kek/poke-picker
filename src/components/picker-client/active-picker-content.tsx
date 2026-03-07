import { PokemonCard } from "@/components/pokemon-card";
import type { PickerPhase } from "@/components/picker-client/types";
import type { PickerMode, PokemonCardData, PokemonListItem } from "@/types/pokemon";

interface ActivePickerContentProps {
  mode: PickerMode;
  phase: PickerPhase;
  currentCards: PokemonCardData[];
  loadingPair: boolean;
  rankedTop: PokemonListItem[];
  currentRankingCandidate: PokemonListItem | null;
  pendingRankingCandidates: PokemonListItem[];
  onPick: (winnerId: number) => void;
  onSelectionSkip: () => void;
}

export function ActivePickerContent({
  mode,
  phase,
  currentCards,
  loadingPair,
  rankedTop,
  currentRankingCandidate,
  pendingRankingCandidates,
  onPick,
  onSelectionSkip,
}: ActivePickerContentProps) {
  return (
    <>
      <div className="mb-4">
        {phase === "selection" ? (
          <p className="text-sm text-zinc-600">Tap your favorite between the two.</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-zinc-600">
              Choose which Pokémon deserves the higher rank.
            </p>
            <p className="text-xs text-zinc-500">
              Ranking finalists: {rankedTop.length}
              {currentRankingCandidate ? " + 1 current candidate" : ""} • Pending:{" "}
              {pendingRankingCandidates.length}
            </p>
          </div>
        )}
      </div>

      {loadingPair || currentCards.length < 2 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl bg-zinc-200" />
          <div className="h-80 animate-pulse rounded-3xl bg-zinc-200" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {currentCards.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onPick={onPick}
              disabled={loadingPair}
            />
          ))}
        </div>
      )}

      {phase === "selection" && currentCards.length === 2 && !loadingPair && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onSelectionSkip}
            className="cursor-pointer rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Keep both for now
          </button>
        </div>
      )}

      {phase === "ranking" && mode !== "all" && (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-900">Current ordered ranking</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {rankedTop.map((pokemon, index) => (
              <span
                key={pokemon.id}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700"
              >
                #{index + 1} {pokemon.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
