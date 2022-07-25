import { FC } from 'react';
import { Card, CardMedia, CardContent, Typography, SxProps, Theme, Skeleton } from '@mui/material';
import { useGetEventQuery } from '../api/api.event';

const sx: Record<string, SxProps<Theme>> = {
  card: {
    display: 'flex',
  },
  cardContent: {
    flex: '1 0 auto',
  },
  cardMedia: {
    width: 151,
  },
};

export const EventCard: FC = () => {
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
    // ? Should we add a placeholder card here?
    return null;
  }

  return (
    <Card sx={sx.card}>
      {data.image && <CardMedia component="img" image={data.image} sx={sx.cardMedia} />}
      <CardContent sx={sx.cardContent}>
        <Typography component="div" variant="h6">
          {data.name}
        </Typography>
        <Typography color="text.secondary" component="div" variant="subtitle1">
          {data.date?.map((date) => date.toLocaleDateString()).join(' - ')}
        </Typography>
      </CardContent>
    </Card>
  );
};
