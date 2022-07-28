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
  item: {
    textAlign: 'center',
  },
};

export const Stats: React.FC<App> = (app) => {
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
    <BasePage app={app}>
      <Grid container spacing={2} sx={sx.container}>
        <Grid item sx={sx.item} xs={12}>
          <Typography variant="h3">{t('apps.stats.heading')}</Typography>
        </Grid>
        <Grid xs={12}>
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
    </BasePage>
  );
};
