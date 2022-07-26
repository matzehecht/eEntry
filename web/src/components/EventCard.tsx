import { FC } from 'react';
import { Card, CardMedia, CardContent, Typography, SxProps, Theme, Skeleton, CardActions, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetEventQuery } from '../api/api.event';

const sx: Record<string, SxProps<Theme>> = {
  cardContent: {
    flex: '1 0 auto',
  },
  cardMedia: {
    width: 151,
  },
  flexWrapper: {
    display: 'flex',
  },
};

export const EventCard: FC<EventCardProps> = ({ onEdit, onReset }) => {
  const { t } = useTranslation();

  const { data, isFetching } = useGetEventQuery(undefined, {
    selectFromResult: (response) => ({
      ...response,
      data: response.data && {
        ...response.data,
        date: response.data.date?.map((date) => new Date(Date.parse(date))),
      },
    }),
  });

  if (isFetching) {
    return (
      <Card sx={sx.card}>
        <Skeleton height={100} sx={sx.cardMedia} variant="rectangular" />
        <CardContent sx={sx.cardContent}>
          <Typography component="div" variant="h6">
            <Skeleton width="60%" />
          </Typography>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <Skeleton width="30%" />
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.name) {
    return (
      <Card>
        <CardContent>
          <Typography component="div" variant="h6">
            {t('components.eventCard.placeholder')} {new Date().toLocaleDateString()}
          </Typography>
        </CardContent>
        {onEdit && (
          <CardActions>
            {onEdit && (
              <Button variant="contained" onClick={onEdit}>
                {t('buttons.edit')}
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={sx.flexWrapper}>
        {data.image && <CardMedia component="img" image={data.image} sx={sx.cardMedia} />}
        <CardContent sx={sx.cardContent}>
          <Typography component="div" variant="h6">
            {data.name}
          </Typography>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            {data.date?.map((date) => date.toLocaleDateString()).join(' - ')}
          </Typography>
        </CardContent>
      </Box>
      {(onEdit || onReset) && (
        <CardActions>
          {onReset && (
            <Button variant="outlined" onClick={onReset}>
              {t('buttons.reset')}
            </Button>
          )}
          {onEdit && (
            <Button variant="contained" onClick={onEdit}>
              {t('buttons.edit')}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

type EventCardProps = {
  onEdit?: () => void;
  onReset?: () => void;
};
