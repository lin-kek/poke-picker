import type { GenerationMode } from "@/types/pokemon";

export const GENERATIONS: Array<{
  value: GenerationMode;
  label: string;
  subtitle: string;
}> = [
  {
    value: "generation-i",
    label: "Generation I",
    subtitle: "Kanto • Top 6",
  },
  {
    value: "generation-ii",
    label: "Generation II",
    subtitle: "Johto • Top 6",
  },
  {
    value: "generation-iii",
    label: "Generation III",
    subtitle: "Hoenn • Top 6",
  },
  {
    value: "generation-iv",
    label: "Generation IV",
    subtitle: "Sinnoh • Top 6",
  },
  {
    value: "generation-v",
    label: "Generation V",
    subtitle: "Unova • Top 6",
  },
  {
    value: "generation-vi",
    label: "Generation VI",
    subtitle: "Kalos • Top 6",
  },
  {
    value: "generation-vii",
    label: "Generation VII",
    subtitle: "Alola • Top 6",
  },
  {
    value: "generation-viii",
    label: "Generation VIII",
    subtitle: "Galar / Hisui • Top 6",
  },
  {
    value: "generation-ix",
    label: "Generation IX",
    subtitle: "Paldea • Top 6",
  },
];

export const VALID_MODES = [
  "all",
  ...GENERATIONS.map((item) => item.value),
] as const;
