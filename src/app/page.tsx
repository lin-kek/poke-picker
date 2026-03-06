import Link from "next/link";
import { GENERATIONS } from "@/lib/generations";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
        <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">
          Pokémon Picker
        </span>

        <h1 className="mt-4 text-3xl font-black leading-tight text-zinc-900 md:text-5xl">
          Choose your favorite Pokémon in a head-to-head showdown
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 md:text-base">
          You'll see two Pokémon at a time and choose the one you prefer. In
          this mode, only one remains.
        </p>

        <div className="mt-6">
          <Link
            href="/picker/all"
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-zinc-900 px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
          >
            <span className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
            <span className="absolute inset-x-0 top-1/2 h-0.75 -translate-y-1/2 bg-zinc-900" />
            <span className="absolute left-1/2 top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-zinc-900 bg-white">
              <span className="h-3 w-3 rounded-full bg-zinc-200" />
            </span>

            <span className="relative z-20 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white shadow-sm">
              Start with all Pokémon
            </span>
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-black text-zinc-900 md:text-2xl">
            Choose by generation
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Ideal for building a team of 6 within a specific generation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GENERATIONS.map((generation) => (
            <Link
              key={generation.value}
              href={`/picker/${generation.value}`}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
            >
              <p className="text-lg font-bold text-zinc-900">
                {generation.label}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {generation.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
