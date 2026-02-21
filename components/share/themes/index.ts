import { DarkTheme } from "./dark";
import { LightTheme } from "./light";

export const themes = {
  dark: {
    component: DarkTheme,
    font: "lexend",
  },
  light: {
    component: LightTheme,
    font: "lexend",
  },
};

export type ThemeName = keyof typeof themes;
