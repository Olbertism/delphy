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
  },
  status: {
    danger: '#0052cc',
  },
});
