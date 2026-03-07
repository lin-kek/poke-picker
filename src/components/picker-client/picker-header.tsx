import Link from "next/link";
import { getModeTitle } from "@/components/picker-client/utils";
import type { PickerPhase } from "@/components/picker-client/types";
import type { PickerMode } from "@/types/pokemon";

interface PickerHeaderProps {
  mode: PickerMode;
  phase: PickerPhase;
  remainingLabel: number;
  targetCount: number;
}

export function PickerHeader({
  mode,
  phase,
  remainingLabel,
  targetCount,
}: PickerHeaderProps) {
  return (
    <div className="mb-6 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
        >
          Home
        </Link>

        <div className="flex flex-wrap justify-end gap-2">
          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700">
            Remaining: {remainingLabel}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700">
            Objective: {targetCount}
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-black text-zinc-900">{getModeTitle(mode)}</h1>

        {phase === "selection" && (
          <p className="mt-1 text-sm text-zinc-600">
            {mode === "all"
              ? "Choose until only 1 Pokémon remains."
              : "Choose until only 6 finalists remain."}
          </p>
        )}

        {phase === "ranking" && mode !== "all" && (
          <p className="mt-1 text-sm text-zinc-600">
            Now rank your finalists. Choose which Pokémon should be placed
            higher in your top 6.
          </p>
        )}

        {phase === "finished" && (
          <p className="mt-1 text-sm text-zinc-600">
            {mode === "all"
              ? "After all your choices, this was the final winner."
              : "Your finalists have now been ordered into a real top 6."}
          </p>
        )}
      </div>
    </div>
  );
}
