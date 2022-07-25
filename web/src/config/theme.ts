import { createTheme, ThemeOptions } from '@mui/material';
import { deepmerge } from '@mui/utils';

const baseTheme: ThemeOptions = {};

// Based on: https://colorhunt.co/palette/f0ebe3e4dccf7d9d9c576f72
const baseLightTheme: ThemeOptions = {
  palette: {
    background: {
      default: '#f0ebe3',
      paper: '#fff9f1',
    },
    mode: 'light',
    primary: {
      contrastText: '#ffffff',
      dark: '#3C4D4F',
      light: '#788B8E',
      main: '#576F72',
    },
    secondary: {
      contrastText: 'rgba(0, 0, 0, 0.87)',
      dark: '#576D6D',
      light: '#97B0AF',
      main: '#7d9d9c',
    },
  },
};

// Based on: https://colorhunt.co/palette/2c36393f4e4fa27b5cdcd7c9
const baseDarkTheme: ThemeOptions = {
  palette: {
    background: {
      default: '#2c3639',
      paper: '#364246',
    },
    mode: 'dark',
    primary: {
      contrastText: '#ffffff',
      dark: '#715640',
      light: '#B4957C',
      main: '#a27b5c',
    },
    secondary: {
      contrastText: 'rgba(0, 0, 0, 0.87)',
      dark: '#9A968C',
      light: '#E3DFD3',
      main: '#dcd7c9',
    },
  },
};

export const lightTheme = createTheme(deepmerge(baseTheme, baseLightTheme));
export const darkTheme = createTheme(deepmerge(baseTheme, baseDarkTheme));
