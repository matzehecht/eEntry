import { cloneElement, useMemo } from 'react';
import { Card, CardActionArea, Grid, Typography, SxProps, Theme, CardHeader, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { APPS_LIST } from '../config/Apps';
import { App } from '../config/Apps.types';
import { useJWTRoles } from '../hooks/jwt';
import { BasePage } from './BasePage';

const sx: Record<string, SxProps<Theme>> = {
  avatar: {
    bgcolor: (theme) => theme.palette.background.paper,
    color: (theme) => theme.palette.text.primary,
  },
  icon: {
    fill: (theme) => theme.palette.text.primary,
  },
};

export const Launcher: React.FC<App> = (app) => {
  const { t } = useTranslation();

  const roles = useJWTRoles();

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
    <BasePage app={app}>
      <Grid container spacing={2}>
        {filteredApps.map(({ label, path, Icon, description }, i) => (
          <Grid key={i} item sm={6} xs={12}>
            <Card>
              <CardActionArea component={Link} to={path}>
                <CardHeader
                  avatar={<Avatar sx={sx.avatar}>{Icon ? cloneElement(Icon, { sx: sx.icon }) : t(label).charAt(0)}</Avatar>}
                  subheader={description && t(description)}
                  title={<Typography variant="h6">{t(label)}</Typography>}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </BasePage>
  );
};
