import { notFound } from "next/navigation";
import { PickerClient } from "@/components/picker-client";
import { VALID_MODES } from "@/lib/generations";
import { getAllPokemonPool, getGenerationPokemonPool } from "@/lib/pokeapi";
import type { PickerMode } from "@/types/pokemon";

interface PickerPageProps {
  params: Promise<{
    mode: string;
  }>;
}

export default async function PickerPage({ params }: PickerPageProps) {
  const { mode } = await params;

  if (!VALID_MODES.includes(mode as (typeof VALID_MODES)[number])) {
    notFound();
  }

  const typedMode = mode as PickerMode;

  const initialPool =
    typedMode === "all"
      ? await getAllPokemonPool()
      : await getGenerationPokemonPool(typedMode);

  return <PickerClient mode={typedMode} initialPool={initialPool} />;
}
