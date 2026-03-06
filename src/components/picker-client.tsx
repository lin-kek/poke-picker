"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { PokemonCard } from "@/components/pokemon-card";
import { loadPokemonCards } from "@/app/actions/picker";
import type {
  PickerMode,
  PokemonCardData,
  PokemonListItem,
} from "@/types/pokemon";

interface PickerClientProps {
  mode: PickerMode;
  initialPool: PokemonListItem[];
}

function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];

  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
}

function getModeTitle(mode: PickerMode) {
  if (mode === "all") {
    return "General Picker";
  }

  return `${mode.replace("generation-", "Generation ").toUpperCase()} Picker`;
}

export function PickerClient({ mode, initialPool }: PickerClientProps) {
  const targetCount = mode === "all" ? 1 : 6;

  const [remainingPool, setRemainingPool] = useState<PokemonListItem[]>(
    shuffleArray(initialPool),
  );
  const [currentCards, setCurrentCards] = useState<PokemonCardData[]>([]);
  const [resultCards, setResultCards] = useState<PokemonCardData[]>([]);
  const [loadingPair, startLoadingPair] = useTransition();
  const [loadingResult, startLoadingResult] = useTransition();

  const isFinished = remainingPool.length <= targetCount;

  const currentPair = useMemo(() => {
    if (isFinished) return [];
    return remainingPool.slice(0, 2);
  }, [isFinished, remainingPool]);

  useEffect(() => {
    if (isFinished || currentPair.length < 2) {
      setCurrentCards([]);
      return;
    }

    startLoadingPair(async () => {
      const cards = await loadPokemonCards(
        currentPair.map((pokemon) => pokemon.id),
      );
      setCurrentCards(cards);
    });
  }, [currentPair, isFinished]);

  useEffect(() => {
    if (!isFinished) {
      setResultCards([]);
      return;
    }

    startLoadingResult(async () => {
      const cards = await loadPokemonCards(
        remainingPool.map((pokemon) => pokemon.id),
      );
      setResultCards(cards);
    });
  }, [isFinished, remainingPool]);

  function handlePick(winnerId: number) {
    setRemainingPool((prev) => {
      const [first, second, ...rest] = prev;

      if (!first || !second) {
        return prev;
      }

      const winner = first.id === winnerId ? first : second;

      return shuffleArray([...rest, winner]);
    });
  }

  function handleRestart() {
    setRemainingPool(shuffleArray(initialPool));
    setCurrentCards([]);
    setResultCards([]);
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-10">
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
              Remaining: {remainingPool.length}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700">
              Objective: {targetCount}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-zinc-900">
            {getModeTitle(mode)}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {mode === "all"
              ? "Choose until only 1 Pokémon remains."
              : "Choose until you reach your generation's top 6."}
          </p>
        </div>
      </div>

      {!isFinished ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-zinc-600">
              Tap your favorite between the two.
            </p>
          </div>

          {loadingPair || currentCards.length < 2 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="h-80 animate-pulse rounded-3xl bg-zinc-200" />
              <div className="h-80 animate-pulse rounded-3xl bg-zinc-200" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentCards.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onPick={handlePick}
                  disabled={loadingPair}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-black text-zinc-900">
              {mode === "all" ? "Your champion" : "Your top 6"}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              {mode === "all"
                ? "After all your choices, this was the final winner."
                : "These were the 6 Pokémon that survived the generation picker."}
            </p>
          </div>

          {loadingResult || resultCards.length !== remainingPool.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: targetCount }).map((_, index) => (
                <div
                  key={index}
                  className="h-70 animate-pulse rounded-3xl bg-zinc-200"
                />
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
              {resultCards.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <PokemonCard
                    pokemon={pokemon}
                    onPick={() => {}}
                    disabled
                    variant="result"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleRestart}
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
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
      )}
    </section>
  );
}
