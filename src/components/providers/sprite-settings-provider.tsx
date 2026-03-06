"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { PokemonSpriteOption } from "@/types/pokemon";

interface SpriteSettingsContextValue {
  spriteOption: PokemonSpriteOption;
  setSpriteOption: (value: PokemonSpriteOption) => void;
}

const SpriteSettingsContext = createContext<SpriteSettingsContextValue | null>(
  null,
);

const STORAGE_KEY = "pokemon-picker:sprite-option";
const DEFAULT_SPRITE: PokemonSpriteOption = "official-artwork";

export function SpriteSettingsProvider({ children }: PropsWithChildren) {
  const [spriteOption, setSpriteOptionState] =
    useState<PokemonSpriteOption>(DEFAULT_SPRITE);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(
      STORAGE_KEY,
    ) as PokemonSpriteOption | null;

    if (savedValue) {
      setSpriteOptionState(savedValue);
    }
  }, []);

  function setSpriteOption(value: PokemonSpriteOption) {
    setSpriteOptionState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  }

  const value = useMemo(
    () => ({
      spriteOption,
      setSpriteOption,
    }),
    [spriteOption],
  );

  return (
    <SpriteSettingsContext.Provider value={value}>
      {children}
    </SpriteSettingsContext.Provider>
  );
}

export function useSpriteSettings() {
  const context = useContext(SpriteSettingsContext);

  if (!context) {
    throw new Error(
      "useSpriteSettings deve ser usado dentro de SpriteSettingsProvider",
    );
  }

  return context;
}
