import { Alert, AlertTitle, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BarcodeForm, BarcodeFormProps } from './BarcodeForm';

export const LoginForm: React.FC<LoginFormProps> = ({ onScan, onSubmit, isError }) => {
  const { t } = useTranslation();

  return (
    <Stack gap={2} px={2} width="100%">
      {isError ? (
        <Alert severity="error">{t('components.loginForm.errorAlert.message')}</Alert>
      ) : (
        <Alert severity="warning">
          <AlertTitle>{t('components.loginForm.warningAlert.title')}</AlertTitle>
          {t('components.loginForm.warningAlert.message')}
        </Alert>
      )}
      <BarcodeForm onScan={onScan} onSubmit={onSubmit} />
    </Stack>
  );
};

type LoginFormProps = BarcodeFormProps & {
  isError: boolean;
};
