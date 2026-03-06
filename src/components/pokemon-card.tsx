"use client";

import Image from "next/image";
import { useSpriteSettings } from "@/components/providers/sprite-settings-provider";
import { getPokemonSpriteUrl } from "@/lib/pokeapi";
import {
  DEFAULT_TYPE_STYLE,
  POKEMON_TYPE_STYLES,
} from "@/lib/pokemon-type-styles";
import type { PokemonCardData } from "@/types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonCardData;
  onPick: (pokemonId: number) => void;
  disabled?: boolean;
  variant?: "picker" | "result";
}

function formatTypeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function PokemonCard({
  pokemon,
  onPick,
  disabled = false,
  variant = "picker",
}: PokemonCardProps) {
  const { spriteOption } = useSpriteSettings();
  const spriteUrl = getPokemonSpriteUrl(pokemon, spriteOption);

  const isUnoptimized =
    spriteUrl?.endsWith(".svg") || spriteUrl?.endsWith(".gif") || false;

  const isFrontDefault = spriteOption === "front_default";
  const isShowdown = spriteOption === "showdown";

  const imageStyle = isFrontDefault
    ? { width: "180px", height: "auto", maxWidth: "100%", maxHeight: "100%" }
    : isShowdown
      ? { width: "170px", height: "auto", maxWidth: "100%", maxHeight: "100%" }
      : { width: "140px", height: "auto", maxWidth: "100%", maxHeight: "100%" };

  const imageClassName = isFrontDefault
    ? "object-contain max-w-full max-h-[210px] md:w-[220px] md:max-h-[260px]"
    : isShowdown
      ? "object-contain max-w-full max-h-[180px] md:w-[190px] md:max-h-[220px]"
      : "object-contain max-w-full max-h-[160px] md:w-[180px] md:max-h-[210px]";

  const isPicker = variant === "picker";

  const primaryType = pokemon.types[0];
  const secondaryType = pokemon.types[1];
  const typeStyle = POKEMON_TYPE_STYLES[primaryType] ?? DEFAULT_TYPE_STYLE;

  const primaryStyle = POKEMON_TYPE_STYLES[primaryType] ?? DEFAULT_TYPE_STYLE;
  const secondaryStyle = secondaryType
    ? (POKEMON_TYPE_STYLES[secondaryType] ?? DEFAULT_TYPE_STYLE)
    : primaryStyle;

  const cardGradientClass = secondaryType
    ? `bg-gradient-to-br ${primaryStyle.gradientFrom} via-white ${secondaryStyle.gradientTo}`
    : `bg-gradient-to-br ${primaryStyle.gradientFrom} via-white ${primaryStyle.gradientTo}`;

  return (
    <button
      type="button"
      onClick={() => onPick(pokemon.id)}
      disabled={disabled}
      className={[
        "relative flex w-full cursor-pointer flex-col items-center overflow-hidden rounded-3xl p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md md:p-6",
        "disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:shadow-sm",
        isPicker
          ? `border ${cardGradientClass} ${primaryStyle.ring} active:scale-[0.98]`
          : "border border-zinc-200 bg-white",
      ].join(" ")}
    >
      {isPicker && (
        <>
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-white/30 blur-2xl" />
        </>
      )}

      <div className="relative z-10 flex w-full items-start justify-between gap-2">
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-zinc-700 backdrop-blur-sm">
          #{pokemon.id}
        </span>

        <div className="flex flex-wrap justify-end gap-2">
          {pokemon.types.map((type) => {
            const style = POKEMON_TYPE_STYLES[type] ?? DEFAULT_TYPE_STYLE;

            return (
              <span
                key={type}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}
              >
                {formatTypeLabel(type)}
              </span>
            );
          })}
        </div>
      </div>

      <div
        className={[
          "relative z-10 mt-4 flex w-full items-center justify-center overflow-hidden rounded-2xl md:h-56",
          isPicker ? "h-48 bg-white/80" : "h-44 bg-zinc-50",
        ].join(" ")}
      >
        {isPicker && (
          <div
            className={`pointer-events-none absolute h-24 w-24 rounded-full blur-2xl opacity-60 ${typeStyle.orb}`}
          />
        )}

        {spriteUrl ? (
          <Image
            src={spriteUrl}
            alt={pokemon.name}
            width={300}
            height={300}
            unoptimized={isUnoptimized}
            style={imageStyle}
            className={`relative z-10 ${imageClassName}`}
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-zinc-100 text-sm text-zinc-500">
            No Sprite
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4">
        <span className="block text-lg font-black text-zinc-900">
          {pokemon.name}
        </span>
      </div>
    </button>
  );
}
