import { FC } from 'react';
import { Container, Grid, SxProps, Theme, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useGetCheckinCountQuery, useGetCheckinCountPerTypeQuery, useGetTicketTypesQuery } from '../api/api.tickets';

const sx: Record<string, SxProps<Theme>> = {
  container: {
    alignItems: 'center',
    display: 'flex',
    height: 1,
    px: 0,
  },
};

export const LoginPage: FC = () => {
  const { t } = useTranslation();

  const { data: totalCount } = useGetCheckinCountQuery(undefined, {
    pollingInterval: 3000,
  });
  const { data: countPerType = {} } = useGetCheckinCountPerTypeQuery(undefined, {
    pollingInterval: 3000,
  });
  const { data: ticketTypes } = useGetTicketTypesQuery(undefined, {
    pollingInterval: 3000,
  });

  return (
    <>
      <Helmet>
        <title>{`${t('pages.login.label')} - eEntry | ${t('slogan')}`}</title>
        <meta content={`${t('pages.login.label')} - eEntry | ${t('slogan')}`} name="description" />
      </Helmet>
      <Container maxWidth="sm" sx={sx.container}>
        <Grid container spacing={2} sx={sx.container}>
          <Grid item sx={sx.item} xs={12}>
            <Typography variant="h3">{t('apps.stats.heading')}</Typography>
          </Grid>
          <Grid item sx={sx.item} xs={12}>
            <Typography variant="h3">{totalCount}</Typography>
          </Grid>
          {Object.values(countPerType).map((type, count) => (
            <Grid key={type} item sx={sx.item} xs={Object.keys(countPerType).length / 12}>
              <Typography variant="h3">
                <>
                  {count}
                  <br />
                  {ticketTypes?.find(({ id }) => type === id)?.name}
                </>
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};
