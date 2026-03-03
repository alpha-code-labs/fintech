import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4fc3f7' },
    secondary: { main: '#81c784' },
    background: {
      default: '#0a0e17',
      paper: '#111827',
    },
    success: { main: '#4caf50' },
    warning: { main: '#ff9800' },
    error: { main: '#f44336' },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.7)',
      disabled: 'rgba(255,255,255,0.38)',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h4: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    subtitle1: { fontWeight: 500, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' },
    subtitle2: { fontWeight: 500, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' },
    body1: { fontSize: '0.9rem' },
    body2: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' },
    caption: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.15) transparent',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundImage: 'none',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': { paddingBottom: 20 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgba(255,255,255,0.06)',
          fontSize: '0.85rem',
        },
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.5)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.8rem',
        },
      },
    },
  },
});

export default theme;
