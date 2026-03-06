export type PokemonSpriteOption =
  | "front_default"
  | "dream_world"
  | "home"
  | "official-artwork"
  | "showdown";

export type GenerationMode =
  | "generation-i"
  | "generation-ii"
  | "generation-iii"
  | "generation-iv"
  | "generation-v"
  | "generation-vi"
  | "generation-vii"
  | "generation-viii"
  | "generation-ix";

export type PickerMode = "all" | GenerationMode;

export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListItem {
  id: number;
  name: string;
}

export interface PokemonSpritesMap {
  front_default: string | null;
  dream_world: string | null;
  home: string | null;
  "official-artwork": string | null;
  showdown: string | null;
}

export interface PokemonCardData {
  id: number;
  name: string;
  sprites: PokemonSpritesMap;
  types: string[];
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  sprites: {
    front_default: string | null;
    other?: {
      dream_world?: {
        front_default: string | null;
      };
      home?: {
        front_default: string | null;
      };
      "official-artwork"?: {
        front_default: string | null;
      };
      showdown?: {
        front_default: string | null;
      };
    };
  };
}

export interface PokemonListResponse {
  results: NamedApiResource[];
}

export interface GenerationApiResponse {
  id: number;
  name: string;
  pokemon_species: NamedApiResource[];
}
