import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SpriteSettingsProvider } from "@/components/providers/sprite-settings-provider";
import { SettingsSheet } from "@/components/settings-sheet";
import { ShinyToggleButton } from "@/components/shiny-toggle-button";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poke Picker",
  description: "Choose your favorite pokémon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.className} ${plusJakartaSans.variable} min-h-screen bg-white text-zinc-900 antialiased`}
      >
        <SpriteSettingsProvider>
          {children}
          <ShinyToggleButton />
          <SettingsSheet />
        </SpriteSettingsProvider>
      </body>
    </html>
  );
}
