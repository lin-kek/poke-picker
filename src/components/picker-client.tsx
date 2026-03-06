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

type PickerPhase = "selection" | "ranking" | "finished";

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

  const [phase, setPhase] = useState<PickerPhase>("selection");

  const [remainingPool, setRemainingPool] = useState<PokemonListItem[]>(
    shuffleArray(initialPool),
  );

  const [currentCards, setCurrentCards] = useState<PokemonCardData[]>([]);
  const [resultCards, setResultCards] = useState<PokemonCardData[]>([]);

  const [loadingPair, startLoadingPair] = useTransition();
  const [loadingResult, startLoadingResult] = useTransition();

  const [finalists, setFinalists] = useState<PokemonListItem[]>([]);
  const [rankedTop, setRankedTop] = useState<PokemonListItem[]>([]);
  const [currentRankingCandidate, setCurrentRankingCandidate] =
    useState<PokemonListItem | null>(null);
  const [pendingRankingCandidates, setPendingRankingCandidates] = useState<
    PokemonListItem[]
  >([]);
  const [rankingCompareIndex, setRankingCompareIndex] = useState(0);

  const currentComparisonPair = useMemo(() => {
    if (phase === "selection") {
      if (remainingPool.length < 2) {
        return [];
      }

      return remainingPool.slice(0, 2);
    }

    if (phase === "ranking") {
      if (!currentRankingCandidate || rankedTop.length === 0) {
        return [];
      }

      const comparedPokemon = rankedTop[rankingCompareIndex];

      if (!comparedPokemon) {
        return [];
      }

      return [currentRankingCandidate, comparedPokemon];
    }

    return [];
  }, [
    phase,
    remainingPool,
    currentRankingCandidate,
    rankedTop,
    rankingCompareIndex,
  ]);

  useEffect(() => {
    if (mode === "all" && phase === "selection" && remainingPool.length <= 1) {
      setPhase("finished");
    }
  }, [mode, phase, remainingPool]);

  useEffect(() => {
    if (
      mode !== "all" &&
      phase === "selection" &&
      remainingPool.length <= targetCount
    ) {
      const finalistsPool = [...remainingPool];

      setFinalists(finalistsPool);

      if (finalistsPool.length === 0) {
        setRankedTop([]);
        setCurrentRankingCandidate(null);
        setPendingRankingCandidates([]);
        setPhase("finished");
        return;
      }

      if (finalistsPool.length === 1) {
        setRankedTop(finalistsPool);
        setCurrentRankingCandidate(null);
        setPendingRankingCandidates([]);
        setPhase("finished");
        return;
      }

      setRankedTop([finalistsPool[0]]);
      setCurrentRankingCandidate(finalistsPool[1]);
      setPendingRankingCandidates(finalistsPool.slice(2));
      setRankingCompareIndex(0);
      setPhase("ranking");
    }
  }, [mode, phase, remainingPool, targetCount]);

  useEffect(() => {
    if (
      mode !== "all" &&
      phase === "ranking" &&
      !currentRankingCandidate &&
      pendingRankingCandidates.length === 0
    ) {
      setPhase("finished");
    }
  }, [mode, phase, currentRankingCandidate, pendingRankingCandidates]);

  useEffect(() => {
    if (phase === "finished" || currentComparisonPair.length < 2) {
      setCurrentCards([]);
      return;
    }

    startLoadingPair(async () => {
      const cards = await loadPokemonCards(
        currentComparisonPair.map((pokemon) => pokemon.id),
      );
      setCurrentCards(cards);
    });
  }, [currentComparisonPair, phase]);

  useEffect(() => {
    if (phase !== "finished") {
      setResultCards([]);
      return;
    }

    const resultPool = mode === "all" ? remainingPool : rankedTop;

    startLoadingResult(async () => {
      const cards = await loadPokemonCards(
        resultPool.map((pokemon) => pokemon.id),
      );
      setResultCards(cards);
    });
  }, [phase, mode, remainingPool, rankedTop]);

  function moveToNextRankingCandidate(nextRankedTop: PokemonListItem[]) {
    if (pendingRankingCandidates.length === 0) {
      setRankedTop(nextRankedTop);
      setCurrentRankingCandidate(null);
      setRankingCompareIndex(0);
      return;
    }

    const [nextCandidate, ...restCandidates] = pendingRankingCandidates;

    setRankedTop(nextRankedTop);
    setCurrentRankingCandidate(nextCandidate);
    setPendingRankingCandidates(restCandidates);
    setRankingCompareIndex(0);
  }

  function handleSelectionPick(winnerId: number) {
    setRemainingPool((prev) => {
      const [first, second, ...rest] = prev;

      if (!first || !second) {
        return prev;
      }

      const winner = first.id === winnerId ? first : second;

      return shuffleArray([...rest, winner]);
    });
  }

  function handleSelectionSkip() {
    setRemainingPool((prev) => {
      const [first, second, ...rest] = prev;

      if (!first || !second) {
        return prev;
      }

      return shuffleArray([...rest, first, second]);
    });
  }

  function handleRankingPick(winnerId: number) {
    if (!currentRankingCandidate) {
      return;
    }

    const comparedPokemon = rankedTop[rankingCompareIndex];

    if (!comparedPokemon) {
      return;
    }

    const candidateWon = winnerId === currentRankingCandidate.id;

    if (candidateWon) {
      const nextRankedTop = [...rankedTop];
      nextRankedTop.splice(rankingCompareIndex, 0, currentRankingCandidate);
      moveToNextRankingCandidate(nextRankedTop);
      return;
    }

    const isLastComparison = rankingCompareIndex >= rankedTop.length - 1;

    if (isLastComparison) {
      const nextRankedTop = [...rankedTop, currentRankingCandidate];
      moveToNextRankingCandidate(nextRankedTop);
      return;
    }

    setRankingCompareIndex((prev) => prev + 1);
  }

  function handlePick(winnerId: number) {
    if (phase === "selection") {
      handleSelectionPick(winnerId);
      return;
    }

    if (phase === "ranking") {
      handleRankingPick(winnerId);
    }
  }

  function handleRestart() {
    setPhase("selection");
    setRemainingPool(shuffleArray(initialPool));
    setCurrentCards([]);
    setResultCards([]);
    setFinalists([]);
    setRankedTop([]);
    setCurrentRankingCandidate(null);
    setPendingRankingCandidates([]);
    setRankingCompareIndex(0);
  }

  const remainingLabel =
    phase === "selection"
      ? remainingPool.length
      : phase === "ranking"
        ? finalists.length
        : mode === "all"
          ? remainingPool.length
          : rankedTop.length;

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
              Remaining: {remainingLabel}
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

      {phase !== "finished" ? (
        <>
          <div className="mb-4">
            {phase === "selection" ? (
              <p className="text-sm text-zinc-600">
                Tap your favorite between the two.
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-zinc-600">
                  Choose which Pokémon deserves the higher rank.
                </p>
                <p className="text-xs text-zinc-500">
                  Ranking finalists: {rankedTop.length}
                  {currentRankingCandidate ? " + 1 current candidate" : ""} •
                  Pending: {pendingRankingCandidates.length}
                </p>
              </div>
            )}
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

          {phase === "selection" &&
            currentCards.length === 2 &&
            !loadingPair && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleSelectionSkip}
                  className="cursor-pointer rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  Keep both for now
                </button>
              </div>
            )}

          {phase === "ranking" && mode !== "all" && (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-zinc-900">
                Current ordered ranking
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {rankedTop.map((pokemon, index) => (
                  <span
                    key={pokemon.id}
                    className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700"
                  >
                    #{index + 1} {pokemon.name}
                  </span>
                ))}
              </div>
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
                : "These are your final ranked choices for this generation."}
            </p>
          </div>

          {loadingResult ||
          resultCards.length !==
            (mode === "all" ? remainingPool.length : rankedTop.length) ? (
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
              {resultCards.map((pokemon, index) => (
                <div
                  key={pokemon.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  {mode !== "all" && (
                    <div className="mb-3">
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-white">
                        #{index + 1}
                      </span>
                    </div>
                  )}

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
              className="cursor-pointer rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
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
