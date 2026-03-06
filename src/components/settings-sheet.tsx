"use client";

import { useState } from "react";
import { useSpriteSettings } from "@/components/providers/sprite-settings-provider";
import type { PokemonSpriteOption } from "@/types/pokemon";

const OPTIONS: Array<{ value: PokemonSpriteOption; label: string }> = [
  { value: "official-artwork", label: "Official Artwork" },
  { value: "front_default", label: "Sprite" },
  { value: "dream_world", label: "Dream World" },
  { value: "home", label: "Home" },
  { value: "showdown", label: "Showdown" },
];

export function SettingsSheet() {
  const [open, setOpen] = useState(false);
  const { spriteOption, setSpriteOption } = useSpriteSettings();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer fixed bottom-4 right-4 z-50 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-lg"
      >
        Settings
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40">
          <button
            type="button"
            aria-label="Close settings"
            onClick={() => setOpen(false)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Settings</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Choose which sprite type to display in the app.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {option.label}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="sprite-option"
                    value={option.value}
                    checked={spriteOption === option.value}
                    onChange={() => setSpriteOption(option.value)}
                    className="h-4 w-4"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
