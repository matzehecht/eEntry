import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetRolesQuery, usePostDeviceMutation } from '../api/api.devices';
import { useOpen } from '../hooks/useOpen';
import { useSnackbarNotification } from '../hooks/useSnackbarNotification';
import { CenteredLoading } from './CenteredLoading';
import { DeviceCodeDialog } from './DeviceCodeDialog';

export const DeviceDialog: FC<DeviceDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { showErrorSnackbar } = useSnackbarNotification();

  const [name, setName] = useState('');
  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value ?? ''), []);
  const [roles, setRoles] = useState<string[]>([]);

  const { data: availableRoles, isFetching } = useGetRolesQuery();
  const [postDevice, { data, isSuccess, isError, isLoading }] = usePostDeviceMutation();

  const [codeDialog, handleOpenCodeDialog, setCodeDialogClose] = useOpen(false);

  const handleClose = useCallback(() => {
    setName('');
    setRoles([]);
    onClose();
    setCodeDialogClose();
  }, [onClose, setCodeDialogClose]);

  const handleChangeRole = useCallback((role: string, newChecked: boolean) => {
    if (newChecked) {
      setRoles((prev) => prev.concat(role));
    } else {
      setRoles((prev) => prev.filter((r) => r !== role));
    }
  }, []);

  const renderedRoles = useMemo(() => {
    if (isFetching) {
      return <CenteredLoading />;
    }

    return availableRoles?.map(
      (role, i) => (
        <FormControlLabel
          key={i}
          control={<Checkbox checked={roles.includes(role)} name={role} onChange={(_, newChecked) => handleChangeRole(role, newChecked)} />}
          label={t(`components.deviceDialog.roles.${role}`)}
        />
      ),
      []
    );
  }, [availableRoles, handleChangeRole, isFetching, roles, t]);

  const [error, setError] = useState({ name: false, roles: false });

  const handleSave = useCallback(() => {
    const newError = { ...error };

    newError.name = !name;
    newError.roles = roles.length === 0;

    setError(newError);
    if (newError.name || newError.roles) {
      return;
    }

    postDevice({
      name,
      roles,
    });
  }, [error, name, postDevice, roles]);

  useEffect(() => {
    if (isError) {
      showErrorSnackbar(t('components.deviceDialog.error'));
    }
  }, [isError, showErrorSnackbar, t]);
  useEffect(() => {
    if (isSuccess) {
      handleOpenCodeDialog();
    }
  }, [handleOpenCodeDialog, isSuccess, showErrorSnackbar, t]);

  const handleCloseCodeDialog = useCallback(() => handleClose(), [handleClose]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('components.deviceDialog.title')}</DialogTitle>
        <DialogContent>
          <Stack gap={2} py={1}>
            <TextField
              error={error.name}
              label={t('components.deviceDialog.nameLabel')}
              required
              value={name}
              onChange={handleChangeName}
            />
            <FormControl component="fieldset" error={error.roles} variant="standard">
              <FormLabel component="legend">{t('components.deviceDialog.rolesLabel')}</FormLabel>
              <FormGroup>{renderedRoles}</FormGroup>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {t('buttons.cancel')}
          </Button>
          <LoadingButton loading={isLoading} variant="contained" onClick={handleSave}>
            {t('buttons.create')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {data && <DeviceCodeDialog code={data.token} name={data.name} open={codeDialog} onClose={handleCloseCodeDialog} />}
    </>
  );
};

type DeviceDialogProps = {
  onClose: () => void;
  open: boolean;
};
