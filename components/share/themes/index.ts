import type { FontName } from "../fonts";
import { DarkTheme } from "./dark";
import { LightTheme } from "./light";
import { Vision1Theme } from "./vision1";


export const themes = {
  light: {
    component: LightTheme,
    font: "lexend" as FontName,
  },
  dark: {
    component: DarkTheme,
    font: "inter" as FontName,
  },
   vision1: {
    component: Vision1Theme,
    font: "lexend" as FontName,
  },
};

export type ThemeName = keyof typeof themes;