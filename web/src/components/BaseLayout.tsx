import { PropsWithChildren, useCallback, useState } from 'react';
import { SxProps, Theme, Container, ContainerProps, useMediaQuery, useTheme, Box, Stack } from '@mui/material';
import { App } from '../config/Apps.types';
import { AppBar } from './AppBar';
import { ResponsiveDrawer } from './ResponsiveDrawer';

const sx: Record<string, SxProps<Theme>> = {
  container: {
    overflowY: 'auto',
  },
  content: {
    flex: '1 0 auto',
    maxWidth: 1,
    position: 'relative',
  },
  drawer: {
    flex: '0 1 auto',
  },
  root: {
    display: 'flex',
    height: '100vh',
  },
};

export const BaseLayout: React.FC<BaseLayoutProps> = ({ app, children, maxWidth = 'lg' }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [drawerMobileOpen, setDrawerMobileOpen] = useState(false);
  const handleToggleDrawer = useCallback(() => setDrawerMobileOpen((prev) => !prev), []);
  const handleClose = useCallback(() => setDrawerMobileOpen(false), []);

  return (
    <Box sx={sx.root}>
      {!app.disableMenu && (
        <Box sx={sx.drawer}>
          <ResponsiveDrawer app={app} drawerMobileOpen={drawerMobileOpen} isDesktop={isDesktop} onClose={handleClose} />
        </Box>
      )}
      <Stack gap={2} sx={sx.content}>
        <AppBar app={app} disableMenuButton={app.disableMenu} toggleMenu={handleToggleDrawer} />
        <Container maxWidth={maxWidth} sx={sx.container}>
          {children}
        </Container>
      </Stack>
    </Box>
  );
};

type BaseLayoutProps = PropsWithChildren<{
  app: App;
  maxWidth?: ContainerProps['maxWidth'];
}>;
