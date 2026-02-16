import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
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
      active: "rgba(0, 0, 0, 0.60)",
      hover: "rgba(71, 167, 220, 0.08)", // subtle primary tint
      selected: "rgba(71, 167, 220, 0.16)",
      disabled: "rgba(0, 0, 0, 0.30)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      focus: "rgba(71, 167, 220, 0.20)",
    },
  },
});

export default theme;
