import { FC, useCallback, useEffect, useMemo } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  alpha,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Skeleton,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useTranslation } from 'react-i18next';
import { useCheckinMutation, useGetTicketByIdQuery, useGetTicketTypeByIdQuery } from '../api/api.tickets';
import { useSnackbarNotification } from '../hooks/useSnackbarNotification';
import { playError } from '../utils/sounds';
import { ValidIndicator } from './ValidIndicator';

const parseDate = (date: string) => new Date(Date.parse(date));

const sx: Record<string, SxProps<Theme>> = {
  cardError: {
    backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2),
  },
  cardSuccess: {
    backgroundColor: (theme) => alpha(theme.palette.success.main, 0.2),
  },
  cardWarning: {
    backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.2),
  },
};

const getSxValidity = (validity?: 'error' | 'warning' | 'success') => {
  switch (validity) {
    case 'error':
      return sx.cardError;
    case 'warning':
      return sx.cardWarning;
    case 'success':
      return sx.cardSuccess;
    default:
      return undefined;
  }
};

export const TicketCheckinConfirm: FC<TicketCheckinConfirmProps> = ({ code, onCancel, onConfirmed }) => {
  const { t } = useTranslation();

  const { showSuccessSnackbar } = useSnackbarNotification();

  const {
    data: ticketData,
    isError: isErrorTicket,
    isFetching: isFetchingTicket,
  } = useGetTicketByIdQuery(
    { id: code },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      selectFromResult: (response) => ({
        ...response,
        data: response.data && {
          ...response.data,
          lastModified: parseDate(response.data.lastModified),
        },
      }),
    }
  );
  const {
    data: ticketTypeData,
    isError: isErrorTicketType,
    isFetching: isFetchingTicketType,
  } = useGetTicketTypeByIdQuery(typeof ticketData?.type === 'number' ? { id: ticketData?.type } : skipToken, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    selectFromResult: (response) => ({
      ...response,
      data: response.data && {
        ...response.data,
        valid: { from: parseDate(response.data.valid.from), until: parseDate(response.data.valid.until) },
      },
    }),
  });
  const [checkin, { isLoading: isLoadingCheckin, isSuccess, isError }] = useCheckinMutation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkinValidity = useMemo(() => {
    if (ticketData?.state !== 'VALID' || isErrorTicket || isErrorTicketType || !ticketTypeData) {
      playError();
      return 'error';
    }
    const now = new Date(Date.now());
    if (now < ticketTypeData.valid.from || ticketTypeData.valid.until <= now) {
      return 'warning';
    }

    return 'success';
  }, [isErrorTicket, isErrorTicketType, ticketData?.state, ticketTypeData]);

  const handleConfirm = useCallback(() => {
    if (ticketData) {
      checkin({ id: ticketData.id });
    }
  }, [checkin, ticketData]);
  useEffect(() => {
    if (isSuccess) {
      onConfirmed();
      showSuccessSnackbar(t('components.ticketCheckinConfirm.successSnackBar'));
    }
  }, [showSuccessSnackbar, isSuccess, onConfirmed, t]);

  useEffect(() => {
    if (isErrorTicket || isErrorTicketType) {
      playError();
    }
  }, [isErrorTicket, isErrorTicketType]);

  if (isFetchingTicket || isFetchingTicketType) {
    return (
      <Card>
        <CardHeader
          avatar={<Skeleton height={50} variant="circular" width={50} />}
          title={<Skeleton width="50%" />}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <Skeleton width="75%" />
          </Typography>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <Skeleton width="40%" />
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (isErrorTicket || isErrorTicketType) {
    return (
      <Card sx={getSxValidity(checkinValidity)}>
        <CardHeader
          avatar={<ValidIndicator validity={checkinValidity} />}
          title={t('components.ticketCheckinConfirm.ticketCard.invalid')}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <strong>{t('components.ticketCheckinConfirm.ticketCard.details.code')}:</strong> {code}
          </Typography>
        </CardContent>
        <CardActions>
          <Button color="error" variant="contained" onClick={onCancel}>
            {t('buttons.cancel')}
          </Button>
        </CardActions>
      </Card>
    );
  }

  return (
    <Stack gap={2}>
      {isError && <Alert severity="error">{t('components.ticketCheckinConfirm.alert')}</Alert>}
      <Card sx={getSxValidity(checkinValidity)}>
        {ticketTypeData?.image && <CardMedia component="img" image={ticketTypeData.image} />}
        <CardHeader
          avatar={<ValidIndicator validity={checkinValidity} />}
          title={ticketTypeData?.name}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <CardContent>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <strong>{t('components.ticketCheckinConfirm.ticketCard.details.valid')}:</strong> {ticketTypeData?.valid.from.toLocaleString()}{' '}
            - {ticketTypeData?.valid.until.toLocaleString()}
          </Typography>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <strong>{t('components.ticketCheckinConfirm.ticketCard.details.code')}:</strong> {ticketData?.id}
          </Typography>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <strong>{t('components.ticketCheckinConfirm.ticketCard.details.state')}:</strong> {ticketData?.state}
          </Typography>
          <Typography color="text.secondary" component="div" variant="subtitle1">
            <strong>{t('components.ticketCheckinConfirm.ticketCard.details.lastModified')}:</strong>{' '}
            {ticketData?.lastModified?.toLocaleString()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button color="error" variant="outlined" onClick={onCancel}>
            {t('buttons.cancel')}
          </Button>
          {checkinValidity !== 'error' && (
            <LoadingButton color={checkinValidity} loading={isLoadingCheckin} variant="contained" onClick={handleConfirm}>
              {t('buttons.confirm')}
            </LoadingButton>
          )}
        </CardActions>
      </Card>
    </Stack>
  );
};

export type TicketCheckinConfirmProps = {
  code: string;
  onCancel: () => void;
  onConfirmed: () => void;
};
