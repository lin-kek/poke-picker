import { pokeApi } from "@/lib/axios";
import type {
  GenerationApiResponse,
  GenerationMode,
  NamedApiResource,
  PokemonApiResponse,
  PokemonCardData,
  PokemonListItem,
  PokemonListResponse,
  PokemonSpriteOption,
} from "@/types/pokemon";

function extractIdFromResourceUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);

  if (!match) {
    throw new Error(`Não foi possível extrair o ID da URL: ${url}`);
  }

  return Number(match[1]);
}

function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function mapNamedResourceToListItem(
  resource: NamedApiResource,
): PokemonListItem {
  return {
    id: extractIdFromResourceUrl(resource.url),
    name: formatPokemonName(resource.name),
  };
}

export async function getAllPokemonPool(): Promise<PokemonListItem[]> {
  const response = await pokeApi.get<PokemonListResponse>(
    "/pokemon?limit=2000",
  );

  return response.data.results
    .map(mapNamedResourceToListItem)
    .sort((a, b) => a.id - b.id);
}

export async function getGenerationPokemonPool(
  generation: GenerationMode,
): Promise<PokemonListItem[]> {
  const response = await pokeApi.get<GenerationApiResponse>(
    `/generation/${generation}`,
  );

  return response.data.pokemon_species
    .map(mapNamedResourceToListItem)
    .sort((a, b) => a.id - b.id);
}

export async function getPokemonCardById(id: number): Promise<PokemonCardData> {
  const response = await pokeApi.get<PokemonApiResponse>(`/pokemon/${id}`);
  const pokemon = response.data;

  return {
    id: pokemon.id,
    name: formatPokemonName(pokemon.name),
    types: pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map((item) => item.type.name),
    sprites: {
      front_default: pokemon.sprites.front_default,
      dream_world: pokemon.sprites.other?.dream_world?.front_default ?? null,
      home: pokemon.sprites.other?.home?.front_default ?? null,
      "official-artwork":
        pokemon.sprites.other?.["official-artwork"]?.front_default ?? null,
      showdown: pokemon.sprites.other?.showdown?.front_default ?? null,
    },
  };
}

export async function getPokemonCardsByIds(
  ids: number[],
): Promise<PokemonCardData[]> {
  const uniqueIds = [...new Set(ids)];
  const cards = await Promise.all(
    uniqueIds.map((id) => getPokemonCardById(id)),
  );

  return uniqueIds
    .map((id) => cards.find((card) => card.id === id))
    .filter((card): card is PokemonCardData => Boolean(card));
}

export function getPokemonSpriteUrl(
  pokemon: PokemonCardData,
  spriteOption: PokemonSpriteOption,
  isShiny = false,
): string | null {
  const baseUrl =
    pokemon.sprites[spriteOption] ?? pokemon.sprites.front_default ?? null;

  if (!baseUrl) {
    return null;
  }

  if (!isShiny) {
    return baseUrl;
  }

  if (spriteOption === "dream_world") {
    return baseUrl;
  }

  return baseUrl.replace(
    /\/(\d+)\.(png|gif|svg|jpg|jpeg|webp)$/i,
    "/shiny/$1.$2",
  );
}
