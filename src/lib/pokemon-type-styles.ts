export interface PokemonTypeStyle {
  gradientFrom: string;
  gradientTo: string;
  ring: string;
  orb: string;
  badge: string;
}

export const DEFAULT_TYPE_STYLE: PokemonTypeStyle = {
  gradientFrom: "from-zinc-100",
  gradientTo: "to-zinc-100",
  ring: "border-zinc-200",
  orb: "bg-zinc-200/60",
  badge: "bg-zinc-700 text-white",
};

export const POKEMON_TYPE_STYLES: Record<string, PokemonTypeStyle> = {
  normal: {
    gradientFrom: "from-stone-100",
    gradientTo: "to-stone-50",
    ring: "border-stone-300",
    orb: "bg-stone-300/50",
    badge: "bg-stone-500 text-white",
  },
  fire: {
    gradientFrom: "from-orange-100",
    gradientTo: "to-red-100",
    ring: "border-orange-300",
    orb: "bg-orange-300/50",
    badge: "bg-orange-500 text-white",
  },
  water: {
    gradientFrom: "from-sky-100",
    gradientTo: "to-blue-100",
    ring: "border-sky-300",
    orb: "bg-sky-300/50",
    badge: "bg-sky-500 text-white",
  },
  electric: {
    gradientFrom: "from-yellow-100",
    gradientTo: "to-amber-100",
    ring: "border-yellow-300",
    orb: "bg-yellow-300/50",
    badge: "bg-yellow-500 text-white",
  },
  grass: {
    gradientFrom: "from-green-100",
    gradientTo: "to-emerald-100",
    ring: "border-green-300",
    orb: "bg-green-300/50",
    badge: "bg-green-600 text-white",
  },
  ice: {
    gradientFrom: "from-cyan-100",
    gradientTo: "to-sky-100",
    ring: "border-cyan-300",
    orb: "bg-cyan-300/50",
    badge: "bg-cyan-500 text-white",
  },
  fighting: {
    gradientFrom: "from-red-100",
    gradientTo: "to-orange-100",
    ring: "border-red-300",
    orb: "bg-red-300/50",
    badge: "bg-red-600 text-white",
  },
  poison: {
    gradientFrom: "from-fuchsia-100",
    gradientTo: "to-purple-100",
    ring: "border-fuchsia-300",
    orb: "bg-fuchsia-300/50",
    badge: "bg-fuchsia-600 text-white",
  },
  ground: {
    gradientFrom: "from-amber-100",
    gradientTo: "to-yellow-50",
    ring: "border-amber-300",
    orb: "bg-amber-300/50",
    badge: "bg-amber-600 text-white",
  },
  flying: {
    gradientFrom: "from-indigo-100",
    gradientTo: "to-sky-100",
    ring: "border-indigo-300",
    orb: "bg-indigo-300/50",
    badge: "bg-indigo-500 text-white",
  },
  psychic: {
    gradientFrom: "from-pink-100",
    gradientTo: "to-rose-100",
    ring: "border-pink-300",
    orb: "bg-pink-300/50",
    badge: "bg-pink-500 text-white",
  },
  bug: {
    gradientFrom: "from-lime-100",
    gradientTo: "to-green-100",
    ring: "border-lime-300",
    orb: "bg-lime-300/50",
    badge: "bg-lime-600 text-white",
  },
  rock: {
    gradientFrom: "from-yellow-100",
    gradientTo: "to-stone-100",
    ring: "border-yellow-400",
    orb: "bg-yellow-400/40",
    badge: "bg-yellow-700 text-white",
  },
  ghost: {
    gradientFrom: "from-violet-100",
    gradientTo: "to-purple-100",
    ring: "border-violet-300",
    orb: "bg-violet-300/50",
    badge: "bg-violet-600 text-white",
  },
  dragon: {
    gradientFrom: "from-violet-100",
    gradientTo: "to-indigo-100",
    ring: "border-violet-400",
    orb: "bg-violet-400/50",
    badge: "bg-violet-700 text-white",
  },
  dark: {
    gradientFrom: "from-zinc-200",
    gradientTo: "to-stone-100",
    ring: "border-zinc-400",
    orb: "bg-zinc-400/40",
    badge: "bg-zinc-800 text-white",
  },
  steel: {
    gradientFrom: "from-slate-100",
    gradientTo: "to-zinc-100",
    ring: "border-slate-300",
    orb: "bg-slate-300/50",
    badge: "bg-slate-600 text-white",
  },
  fairy: {
    gradientFrom: "from-pink-100",
    gradientTo: "to-fuchsia-100",
    ring: "border-pink-300",
    orb: "bg-pink-300/50",
    badge: "bg-pink-500 text-white",
  },
};
