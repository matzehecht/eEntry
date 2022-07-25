import { PropsWithChildren } from 'react';
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

export const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = (props) => {
  const { t } = useTranslation();

  return (
    <DrawerSwitch {...props}>
      <Toolbar />
      <Divider />
      <List dense>
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
        {APPS_LIST.map(({ label, path, Icon, description }, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton component={Link} to={path}>
              <ListItemIcon>{Icon}</ListItemIcon>
              <ListItemText primary={t(label)} secondary={description && t(description)} sx={sx.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </DrawerSwitch>
  );
};

type ResponsiveDrawerProps = Omit<DrawerSwitchProps, 'children'>;
