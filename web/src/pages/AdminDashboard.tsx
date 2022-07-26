import { FC, useCallback } from 'react';
import { Stack, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDeleteImageMutation, usePatchEventMutation } from '../api/api.event';
import { useGetCheckinCountQuery } from '../api/api.tickets';
import { Devices } from '../components/Devices';
import { EventCard } from '../components/EventCard';
import { EventDialog } from '../components/EventDialog';
import { useOpen } from '../hooks/useOpen';

export const AdminDashboard: FC = () => {
  const { t } = useTranslation();

  const [patchEvent] = usePatchEventMutation();
  const [deleteImage] = useDeleteImageMutation();

  const { data } = useGetCheckinCountQuery();

  const [eventDialogOpen, handleEventDialogOpen, handleEventDialogClose] = useOpen(false);

  const handleReset = useCallback(() => {
    patchEvent({ date: null, name: null });
    deleteImage();
  }, [deleteImage, patchEvent]);

  return (
    <>
      <Stack gap={2}>
        <EventCard onEdit={handleEventDialogOpen} onReset={handleReset} />
        {/* TODO move to tickets */}
        <Typography>
          <strong>{t('pages.adminDashboard.checkincount')}:</strong> {data}
        </Typography>
        <Divider />
        <Devices />
      </Stack>
      <EventDialog open={eventDialogOpen} onClose={handleEventDialogClose} />
    </>
  );
};
