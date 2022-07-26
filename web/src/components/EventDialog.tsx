import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Event } from '@eentry/types';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { useGetEventQuery, usePatchEventMutation } from '../api/api.event';
import { useSnackbarNotification } from '../hooks/useSnackbarNotification';

type EventForm = {
  from?: Date | null;
  name?: string;
  to?: Date | null;
};

const eventFormDataFromEvent = ({ name, date }: Event): EventForm => ({
  from: date?.[0] ? new Date(Date.parse(date[0])) : undefined,
  name: name ?? undefined,
  to: date?.[1] ? new Date(Date.parse(date[1])) : undefined,
});

export const EventDialog: FC<EventDialogProps> = ({ open, onClose }) => {
  const { showErrorSnackbar } = useSnackbarNotification();

  const { t } = useTranslation();

  const { data } = useGetEventQuery(undefined);
  const [patchEvent, { isSuccess, isError, isLoading, reset }] = usePatchEventMutation();

  const [formData, setFormData] = useState(data && eventFormDataFromEvent(data));

  const handleClose = useCallback(() => {
    onClose();
    setFormData(data && eventFormDataFromEvent(data));
    reset();
  }, [data, onClose, reset]);

  useEffect(() => {
    setFormData(data && eventFormDataFromEvent(data));
  }, [data]);
  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [data, handleClose, isSuccess]);
  useEffect(() => {
    if (isError) {
      showErrorSnackbar(t('components.eventDialog.errorPatch'));
    }
  }, [data, handleClose, isError, isSuccess, showErrorSnackbar, t]);

  const handleSubmit = useCallback(() => {
    if ((!formData?.from && formData?.to) || (formData?.from && !formData?.to)) {
      showErrorSnackbar(t('components.eventDialog.errorDate'));
      return;
    }

    const date: string[] = [];
    if (formData?.from && formData?.to) {
      date.push(formData.from.toISOString());
      date.push(formData.to.toISOString());
    }

    patchEvent({ date, name: formData?.name });
  }, [formData, patchEvent, showErrorSnackbar, t]);

  const handleChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: event.target.value }));
  }, []);
  const handleFrom = useCallback((newValue: Date | null | undefined) => {
    setFormData((prev) => ({ ...prev, from: newValue }));
  }, []);
  const handleTo = useCallback((newValue: Date | null | undefined) => {
    setFormData((prev) => ({ ...prev, to: newValue }));
  }, []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('components.eventDialog.title')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ paddingTop: 2 }}>
          <TextField
            error={!Boolean(formData?.name)}
            fullWidth
            label={t('components.eventDialog.name')}
            required
            value={formData?.name}
            onChange={handleChangeName}
          />
          <DatePicker
            label={t('components.eventDialog.dateFrom')}
            renderInput={(props) => <TextField {...props} />}
            value={formData?.from}
            onChange={handleFrom}
          />
          <DatePicker
            label={t('components.eventDialog.dateTo')}
            renderInput={(props) => <TextField {...props} />}
            value={formData?.to}
            onChange={handleTo}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {t('buttons.cancel')}
        </Button>
        <LoadingButton loading={isLoading} variant="contained" onClick={handleSubmit}>
          {t('buttons.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

type EventDialogProps = {
  onClose: () => void;
  open: boolean;
};
