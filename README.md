# Poke Picker

A simple web app for choosing your favorite Pokémon through head-to-head matchups.

Users can start a general picker with all Pokémon, or choose a specific generation. In the general mode, the picker continues until only one Pokémon remains. In the generation modes, the final result is a top 6, which can help when deciding on a team for that generation.

## Stack

- Next.js
- Tailwind
- Axios
- PokéAPI

## Main Features

- General picker with all available Pokémon
- Generation-based picker
- Sprite settings with multiple image sources from PokéAPI

## Data Source

This project uses the [PokéAPI v2](https://pokeapi.co/docs/v2) as its Pokémon data source.

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in your terminal.
