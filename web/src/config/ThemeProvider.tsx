import { PropsWithChildren, useMemo, FC } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { themePreferenceState } from '../store/recoil';
import { darkTheme, lightTheme } from './theme';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const themePreference = useRecoilValue(themePreferenceState);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => {
    if (themePreference === 'system') {
      return prefersDarkMode ? darkTheme : lightTheme;
    }

    return themePreference === 'light' ? lightTheme : darkTheme;
  }, [prefersDarkMode, themePreference]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
