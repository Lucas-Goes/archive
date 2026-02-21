import type { FontName } from "../fonts";
import { DarkTheme } from "./dark";
import { LightTheme } from "./light";


export const themes = {
  light: {
    component: LightTheme,
    font: "lexend" as FontName,
  },
  dark: {
    component: DarkTheme,
    font: "inter" as FontName,
  },
};

export type ThemeName = keyof typeof themes;