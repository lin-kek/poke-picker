"use client";

import Image from "next/image";
import { useSpriteSettings } from "@/components/providers/sprite-settings-provider";

export function ShinyToggleButton() {
  const { isShiny, toggleShiny } = useSpriteSettings();

  return (
    <button
      type="button"
      onClick={toggleShiny}
      aria-label={isShiny ? "Disable shiny sprites" : "Enable shiny sprites"}
      title={isShiny ? "Disable shiny sprites" : "Enable shiny sprites"}
      className={[
        "cursor-pointer fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border bg-white shadow-lg transition",
        isShiny
          ? "border-amber-300 ring-2 ring-amber-200"
          : "border-zinc-200 hover:bg-zinc-50",
      ].join(" ")}
    >
      <Image
        src="/images/shiny_charm.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
      />
    </button>
  );
}
