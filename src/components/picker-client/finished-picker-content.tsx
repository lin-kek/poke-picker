import Link from "next/link";
import { PokemonCard } from "@/components/pokemon-card";
import type { PickerMode, PokemonCardData } from "@/types/pokemon";

interface FinishedPickerContentProps {
  mode: PickerMode;
  targetCount: number;
  loadingResult: boolean;
  resultCards: PokemonCardData[];
  remainingPoolLength: number;
  rankedTopLength: number;
  onRestart: () => void;
}

export function FinishedPickerContent({
  mode,
  targetCount,
  loadingResult,
  resultCards,
  remainingPoolLength,
  rankedTopLength,
  onRestart,
}: FinishedPickerContentProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-black text-zinc-900">
          {mode === "all" ? "Your champion" : "Your top 6"}
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          {mode === "all"
            ? "After all your choices, this was the final winner."
            : "These are your final ranked choices for this generation."}
        </p>
      </div>

      {loadingResult ||
      resultCards.length !== (mode === "all" ? remainingPoolLength : rankedTopLength) ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: targetCount }).map((_, index) => (
            <div key={index} className="h-70 animate-pulse rounded-3xl bg-zinc-200" />
          ))}
        </div>
      ) : (
        <div
          className={
            mode === "all"
              ? "mx-auto max-w-sm"
              : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {resultCards.map((pokemon, index) => (
            <div
              key={pokemon.id}
              className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              {mode !== "all" && (
                <div className="mb-3">
                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-white">
                    #{index + 1}
                  </span>
                </div>
              )}

              <PokemonCard pokemon={pokemon} onPick={() => {}} disabled variant="result" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="cursor-pointer rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Restart
        </button>

        <Link
          href="/"
          className="rounded-2xl border border-zinc-300 px-5 py-3 text-center text-sm font-semibold text-zinc-800"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
