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
      main: "#dc7b47",
      dark: "#c96b39",
      contrastText: "#000",
    },
  },
});

export default theme;
