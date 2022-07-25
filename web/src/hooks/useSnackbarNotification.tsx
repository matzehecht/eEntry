import { useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack';

export const useSnackbarNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const SnackbarCloseAction = useCallback(
    (key: SnackbarKey) => (
      <IconButton aria-label="close" color="inherit" size="small" onClick={() => closeSnackbar(key)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    ),
    [closeSnackbar]
  );

  const showSuccessSnackbar = useCallback(
    (message: SnackbarMessage, options: OptionsObject = {}) => {
      return enqueueSnackbar(message, {
        ...options,
        action: SnackbarCloseAction,
        variant: 'success',
      });
    },
    [SnackbarCloseAction, enqueueSnackbar]
  );

  const showErrorSnackbar = useCallback(
    (message: SnackbarMessage, options: OptionsObject = {}, hideReload: boolean = false) => {
      return enqueueSnackbar(message, {
        ...options,
        action: SnackbarCloseAction,
        variant: 'error',
      });
    },
    [SnackbarCloseAction, enqueueSnackbar]
  );

  return { closeSnackbar, enqueueSnackbar, showErrorSnackbar, showSuccessSnackbar };
};
