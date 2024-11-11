'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Commissioner", sans-serif', // Set Commissioner as the default font
    button: {
      fontFamily: '"Commissioner", sans-serif',
    },
  },
});

export default theme;
export { rem } from './functions';
