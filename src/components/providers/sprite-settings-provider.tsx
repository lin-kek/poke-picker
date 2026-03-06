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
  isShiny: boolean;
  toggleShiny: () => void;
}

const SpriteSettingsContext = createContext<SpriteSettingsContextValue | null>(
  null,
);

const STORAGE_KEY = "pokemon-picker:sprite-option";
const SHINY_STORAGE_KEY = "pokemon-picker:is-shiny";
const DEFAULT_SPRITE: PokemonSpriteOption = "official-artwork";

export function SpriteSettingsProvider({ children }: PropsWithChildren) {
  const [spriteOption, setSpriteOptionState] =
    useState<PokemonSpriteOption>(DEFAULT_SPRITE);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    const savedSprite = window.localStorage.getItem(
      STORAGE_KEY,
    ) as PokemonSpriteOption | null;

    const savedShiny = window.localStorage.getItem(SHINY_STORAGE_KEY);

    if (savedSprite) {
      setSpriteOptionState(savedSprite);
    }

    if (savedShiny) {
      setIsShiny(savedShiny === "true");
    }
  }, []);

  function setSpriteOption(value: PokemonSpriteOption) {
    setSpriteOptionState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  }

  function toggleShiny() {
    setIsShiny((prev) => {
      const nextValue = !prev;
      window.localStorage.setItem(SHINY_STORAGE_KEY, String(nextValue));
      return nextValue;
    });
  }

  const value = useMemo(
    () => ({
      spriteOption,
      setSpriteOption,
      isShiny,
      toggleShiny,
    }),
    [spriteOption, isShiny],
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
      "useSpriteSettings must be used inside SpriteSettingsProvider",
    );
  }

  return context;
}
