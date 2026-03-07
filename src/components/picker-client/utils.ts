import type { PickerMode } from "@/types/pokemon";
import type { PickerPhase } from "@/components/picker-client/types";

export function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];

  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
}

export function getModeTitle(mode: PickerMode) {
  if (mode === "all") {
    return "General Picker";
  }

  return `${mode.replace("generation-", "Generation ").toUpperCase()} Picker`;
}

export function getRemainingLabel(params: {
  phase: PickerPhase;
  mode: PickerMode;
  remainingPoolLength: number;
  finalistsLength: number;
  rankedTopLength: number;
}) {
  const {
    phase,
    mode,
    remainingPoolLength,
    finalistsLength,
    rankedTopLength,
  } = params;

  if (phase === "selection") {
    return remainingPoolLength;
  }

  if (phase === "ranking") {
    return finalistsLength;
  }

  if (mode === "all") {
    return remainingPoolLength;
  }

  return rankedTopLength;
}
