import { useEffect, useMemo, useState, useTransition } from "react";
import { loadPokemonCards } from "@/app/actions/picker";
import { shuffleArray } from "@/components/picker-client/utils";
import type {
  PickerClientProps,
  PickerPhase,
  UsePickerStateResult,
} from "@/components/picker-client/types";
import type { PokemonCardData, PokemonListItem } from "@/types/pokemon";

export function usePickerState({
  mode,
  initialPool,
}: PickerClientProps): UsePickerStateResult {
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

  return {
    targetCount,
    phase,
    remainingPool,
    currentCards,
    resultCards,
    loadingPair,
    loadingResult,
    finalists,
    rankedTop,
    currentRankingCandidate,
    pendingRankingCandidates,
    handlePick,
    handleSelectionSkip,
    handleRestart,
  };
}
