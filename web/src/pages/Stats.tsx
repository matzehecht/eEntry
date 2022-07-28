import { SxProps, Theme, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetCheckinCountPerTypeQuery, useGetCheckinCountQuery, useGetTicketTypesQuery } from '../api/api.tickets';
import { App } from '../config/Apps.types';
import { BasePage } from './BasePage';

const sx: Record<string, SxProps<Theme>> = {
  container: {
    alignItems: 'center',
    display: 'flex',
    height: 1,
    px: 0,
  },
};

export const Stats: React.FC<App> = (app) => {
  const { t } = useTranslation();

  const { data: totalCount } = useGetCheckinCountQuery();
  const { data: countPerType = {} } = useGetCheckinCountPerTypeQuery();
  const { data: ticketTypes } = useGetTicketTypesQuery();

  return (
    <BasePage app={app}>
      <Grid container spacing={2} sx={sx.container}>
        <Grid xs={12}>
          <Typography variant="h3">{t('apps.stats.heading')}</Typography>
        </Grid>
        <Grid xs={12}>
          <Typography variant="h3">{totalCount}</Typography>
        </Grid>
        {Object.values(countPerType).map((type, count) => (
          <Grid key={type} xs={Object.keys(countPerType).length / 12}>
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
    </BasePage>
  );
};
