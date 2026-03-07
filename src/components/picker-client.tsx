"use client";

import { ActivePickerContent } from "@/components/picker-client/active-picker-content";
import { FinishedPickerContent } from "@/components/picker-client/finished-picker-content";
import { PickerHeader } from "@/components/picker-client/picker-header";
import type { PickerClientProps } from "@/components/picker-client/types";
import { usePickerState } from "@/components/picker-client/use-picker-state";
import { getRemainingLabel } from "@/components/picker-client/utils";

export function PickerClient({ mode, initialPool }: PickerClientProps) {
  const {
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
  } = usePickerState({ mode, initialPool });

  const remainingLabel = getRemainingLabel({
    phase,
    mode,
    remainingPoolLength: remainingPool.length,
    finalistsLength: finalists.length,
    rankedTopLength: rankedTop.length,
  });

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <PickerHeader
        mode={mode}
        phase={phase}
        remainingLabel={remainingLabel}
        targetCount={targetCount}
      />

      {phase !== "finished" ? (
        <ActivePickerContent
          mode={mode}
          phase={phase}
          currentCards={currentCards}
          loadingPair={loadingPair}
          rankedTop={rankedTop}
          currentRankingCandidate={currentRankingCandidate}
          pendingRankingCandidates={pendingRankingCandidates}
          onPick={handlePick}
          onSelectionSkip={handleSelectionSkip}
        />
      ) : (
        <FinishedPickerContent
          mode={mode}
          targetCount={targetCount}
          loadingResult={loadingResult}
          resultCards={resultCards}
          remainingPoolLength={remainingPool.length}
          rankedTopLength={rankedTop.length}
          onRestart={handleRestart}
        />
      )}
    </section>
  );
}
