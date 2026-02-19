import { DarkTheme } from "./dark";
import { LightTheme } from "./light";

export const themes = {
  dark: DarkTheme,
  light: LightTheme,
};

export type ThemeName = keyof typeof themes;
