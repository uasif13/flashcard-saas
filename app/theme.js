import { createTheme } from "@mui/material/styles";

const discoTheme = createTheme({
  palette: {
    primary: {
      main: '#FF1493', // Deep pink
    },
    secondary: {
      main: '#00FFFF', // Cyan
    },
    background: {
      default: '#000000', // Black background
      paper: '#1A1A1A',   // Dark gray for Paper components
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#FF69B4', // Hot pink for secondary text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)',
          border: 0,
          color: 'white',
          padding: '0 30px',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #1A1A1A 30%, #2C2C2C 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .1)',
        },
      },
    },
  },
});

export default discoTheme;