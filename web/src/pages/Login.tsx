import { FC, useCallback, useEffect, useState } from 'react';
import { Container, SxProps, Theme } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { useLoginMutation } from '../api/api.auth';
import { BarcodeDialog } from '../components/BarcodeDialog';
import { CenteredLoading } from '../components/CenteredLoading';
import { LoginForm } from '../components/LoginForm';
import { useOpen } from '../hooks/useOpen';
import { useSnackbarNotification } from '../hooks/useSnackbarNotification';
import { tokenState } from '../store/recoil';

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

  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarNotification();

  const [login, { originalArgs, isLoading, isSuccess, isError }] = useLoginMutation();
  const [token, setToken] = useRecoilState(tokenState);

  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    if (token) {
      login({ token }).then((response) => {
        if ('error' in response) {
          setToken(undefined);
        }
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  }, [isSuccess, login, originalArgs?.token, setToken, token]);

  const [scanning, handleScan, handleStopScan] = useOpen(false);

  const handleSubmit = useCallback(
    (newToken: string) => {
      handleStopScan();
      login({ token: newToken }).then((response) => {
        if (!('error' in response)) {
          setToken(newToken);
          showSuccessSnackbar(t('pages.login.successSnackBar'));
        } else {
          showErrorSnackbar(t('pages.login.errorSnackBar'));
        }
      });
    },
    [handleStopScan, login, setToken, showErrorSnackbar, showSuccessSnackbar, t]
  );

  return (
    <>
      <Helmet>
        <title>{`${t('pages.login.label')} - eEntry | ${t('slogan')}`}</title>
        <meta content={`${t('pages.login.label')} - eEntry | ${t('slogan')}`} name="description" />
      </Helmet>
      <Container maxWidth="sm" sx={sx.container}>
        {refreshing || isLoading ? <CenteredLoading /> : <LoginForm isError={isError} onScan={handleScan} onSubmit={handleSubmit} />}
      </Container>
      <BarcodeDialog open={scanning} onClose={handleStopScan} onScanned={handleSubmit} />
    </>
  );
};
