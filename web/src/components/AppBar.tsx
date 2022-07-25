import { cloneElement, ReactNode, useCallback, useMemo } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  IconButton,
  SxProps,
  Theme,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { App } from '../config/Apps.types';
import { ThemePreference, themePreferenceState } from '../store/recoil';

const sx: Record<string, SxProps<Theme>> = {
  appBarTitle: {
    flexGrow: 1,
    mx: 2,
  },
  icon: {
    fill: (theme) => theme.palette.text.primary,
  },
};

type NextThemePreference = {
  icon: ReactNode;
  key: ThemePreference;
};
const NEXT_THEME: Record<ThemePreference, NextThemePreference> = {
  dark: { icon: <SettingsSuggestIcon />, key: 'system' },
  light: { icon: <Brightness4Icon />, key: 'dark' },
  system: { icon: <LightModeIcon />, key: 'light' },
};

export const AppBar: React.FC<AppBarProps> = ({ app, disableMenuButton, toggleMenu, ...rest }) => {
  const { t } = useTranslation();

  const [themePreference, setThemePreference] = useRecoilState(themePreferenceState);

  const nextTheme = useMemo(() => NEXT_THEME[themePreference], [themePreference]);
  const handleNextTheme = useCallback(() => setThemePreference(nextTheme.key), [nextTheme.key, setThemePreference]);

  return (
    <MuiAppBar {...rest} color="transparent" position="sticky">
      <Toolbar>
        {disableMenuButton ? (
          cloneElement(app.Icon, { sx: sx.icon })
        ) : (
          <IconButton color="inherit" edge="start" onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography sx={sx.appBarTitle} variant="h6">
          {t(app.label)}
        </Typography>
        {/* eslint-disable-next-line sonarjs/no-nested-template-literals */}
        <Tooltip title={`${t('theme.switch')} ${t(`theme.${nextTheme.key}`)}`}>
          <IconButton color="inherit" size="large" onClick={handleNextTheme}>
            {nextTheme.icon}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </MuiAppBar>
  );
};

type AppBarProps = Omit<MuiAppBarProps, 'position' | 'children' | 'color'> & {
  app: App;
  disableMenuButton?: boolean;
  toggleMenu: () => void;
};
