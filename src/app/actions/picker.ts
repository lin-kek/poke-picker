"use server";

import {
  getAllPokemonPool,
  getGenerationPokemonPool,
  getPokemonCardsByIds,
} from "@/lib/pokeapi";
import type { PickerMode } from "@/types/pokemon";

export async function loadPickerPool(mode: PickerMode) {
  if (mode === "all") {
    return getAllPokemonPool();
  }

  return getGenerationPokemonPool(mode);
}

export async function loadPokemonCards(ids: number[]) {
  return getPokemonCardsByIds(ids);
}
