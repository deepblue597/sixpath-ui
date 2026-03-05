import { createTheme, type PaletteMode } from "@mui/material/styles";

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        light: "#7fd0ff",
        main: "#47a7dc",
        dark: "#006a9c",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff8d50",
        main: "#d37a4f",
        dark: "#c96b39",
        contrastText: "#000",
      },
      action: {
        hover: "rgba(71, 167, 220, 0.08)",
        selected: "rgba(71, 167, 220, 0.16)",
        focus: "rgba(71, 167, 220, 0.20)",
      },
    },
  });
}
