import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#263238',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#ffb300',
    },
    neutral: {
      main: '#E1E2E1',
      light: '#F5F5F6',
    },
  },
  status: {
    danger: '#0052cc',
  },
  typography: {
    h1: {
      fontSize: '2.8rem',
      marginBottom: '50px',
    },
    h2: {
      fontSize: '2.1rem',
      marginBottom: '20px',
    },
    h3: {
      fontSize: '1.5rem',
      marginTop: '20px',
      marginBottom: '5px',
    },
    h4: {
      fontSize: '1.3rem',
      marginTop: '20px',
      marginBottom: '5px',
    },
    h5: {
      fontSize: '1.2rem',
      marginTop: '10px',
      marginBottom: '5px',
    },
    // for some weird reason these adds to body tag
    /* body1: {
      marginBottom: "5px"
    } */
  },
});
