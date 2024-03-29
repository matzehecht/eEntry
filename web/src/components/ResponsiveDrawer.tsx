import { PropsWithChildren, useMemo } from 'react';
import {
  Divider,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Theme,
  Toolbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { APPS, APPS_LIST } from '../config/Apps';
import { App } from '../config/Apps.types';
import { useJWTRoles } from '../hooks/jwt';

const sx: Record<string, SxProps<Theme>> = {
  drawer: {
    '& .MuiDrawer-paper': { boxSizing: 'border-box', maxWidth: (theme) => theme.spacing(30), position: 'static' },
    display: { sm: 'block' },
    height: 1,
  },
  text: {
    '& *': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
};

const DrawerSwitch: React.FC<DrawerSwitchProps> = ({ children, drawerMobileOpen, isDesktop, onClose }) => {
  if (isDesktop) {
    return (
      <Drawer open sx={sx.drawer} variant="permanent">
        {children}
      </Drawer>
    );
  }

  return (
    <Drawer
      ModalProps={{
        keepMounted: true,
      }}
      open={drawerMobileOpen}
      sx={sx.drawer}
      variant="temporary"
      onClose={onClose}
    >
      {children}
    </Drawer>
  );
};

type DrawerSwitchProps = PropsWithChildren<{
  drawerMobileOpen: boolean;
  isDesktop: boolean;
  onClose: DrawerProps['onClose'];
}>;

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ app, ...rest }) => {
  const { t } = useTranslation();

  const roles = useJWTRoles();

  const subPages = useMemo(() => {
    if (!app.subpages) {
      return null;
    }

    return (
      <List>
        {app.subpages.map(({ label, path }, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton component={Link} to={path}>
              <ListItemText primary={t(label)} sx={sx.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }, [app.subpages, t]);

  const filteredApps = useMemo(
    () =>
      APPS_LIST.filter(({ role }) => {
        if (!role) {
          return true;
        }
        return roles?.includes(role);
      }),
    [roles]
  );

  return (
    <DrawerSwitch {...rest}>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton href={APPS.launcher.path}>
            <ListItemIcon>{APPS.launcher.Icon}</ListItemIcon>
            <ListItemText
              primary={t(APPS.launcher.label)}
              secondary={APPS.launcher.description && t(APPS.launcher.description)}
              sx={sx.text}
            />
          </ListItemButton>
        </ListItem>
        {filteredApps.map(({ label, path, Icon, description }, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton component={Link} to={path}>
              <ListItemIcon>{Icon}</ListItemIcon>
              <ListItemText primary={t(label)} secondary={description && t(description)} sx={sx.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {subPages}
    </DrawerSwitch>
  );
};

type ResponsiveDrawerProps = Omit<DrawerSwitchProps, 'children'> & { app: App };
