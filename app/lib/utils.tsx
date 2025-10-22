import { type ClassValue, clsx } from "clsx";
import type { FlagComponent } from "country-flag-icons/react/1x1";
import * as Flags from "country-flag-icons/react/3x2";
import { sha256 } from "js-sha256";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { AppUser } from "@/auth/auth-client";

const LOCAL_STORAGE_TERMINAL_THEME_KEY = "terminal-theme";

const flagsByCountry = new Map<string, FlagComponent>(
  Object.entries(Flags) as [string, FlagComponent][],
);

const emojiMap = import.meta.env.APP_LOCALES.reduce<
  Record<string, FlagComponent>
>((acc, locale) => {
  const countryCode = locale.split("-")[1];
  if (!countryCode) return acc;

  const flag = flagsByCountry.get(countryCode);
  if (flag) {
    acc[countryCode] = flag;
  }

  return acc;
}, {});

export function setTerminalTheme(theme: string) {
  localStorage.setItem(LOCAL_STORAGE_TERMINAL_THEME_KEY, theme);
}

export function getTerminalTheme() {
  return localStorage.getItem(LOCAL_STORAGE_TERMINAL_THEME_KEY) || "mocha";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGravatarUrl(email: string) {
  return `https://www.gravatar.com/avatar/${sha256(email)}?d=404`;
}

export function languageEmoji(locale: string): ReactNode {
  if (locale === "lol-US") {
    return "🐱";
  }

  const countryCode = locale.split("-")[1];
  if (!countryCode) return "";

  const Flag = emojiMap[countryCode];
  if (!Flag) return "";

  return <Flag className="mx-1 size-4 align-middle" />;
}

export function getLanguageName(languageCode: string, displayLanguage: string) {
  if (languageCode === "lol-US") {
    return "LOLCAT";
  }

  const displayNames = new Intl.DisplayNames([displayLanguage], {
    type: "language",
  });
  return displayNames.of(languageCode) || languageCode;
}

export function runAsync(fn: () => Promise<void>) {
  void fn().catch(console.error);
}

export function appUserName(user: AppUser) {
  return (
    user.name ||
    user.displayUsername ||
    user.username ||
    user.email ||
    "Unknown"
  );
}

export function smartEntries<T extends object>(
  obj: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(obj).map(([key, value]) => [
    key as keyof T,
    value as T[keyof T],
  ]);
}
