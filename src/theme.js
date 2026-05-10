import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#4da6ff',
      main: '#1a73e8',
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#6c7a89',
      main: '#34495e',
      dark: '#1a252f',
      contrastText: '#ffffff',
    },
    success: {
      light: '#81c784',
      main: '#2e7d32',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
    },
    danger: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#b71c1c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.2)',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default theme
