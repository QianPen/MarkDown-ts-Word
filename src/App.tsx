import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { MarkdownConverter } from './components/MarkdownConverter';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0071e3',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MarkdownConverter />
    </ThemeProvider>
  );
}

export default App;
