import { FC, useCallback } from 'react';
import { Divider, Button, Stack } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextFieldSubmit } from './TextFieldSubmit';

type TLoginForm = {
  code: string;
};

export const BarcodeForm: FC<BarcodeFormProps> = ({ onScan, onSubmit }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginForm>();

  const submit: SubmitHandler<TLoginForm> = useCallback(({ code }) => onSubmit(code), [onSubmit]);

  return (
    <Stack gap={2} px={2}>
      <form onSubmit={handleSubmit(submit)}>
        <TextFieldSubmit
          {...register('code', { required: true })}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          error={Boolean(errors.code)}
          fullWidth
          helperText={errors.code ? t('components.barcodeForm.fieldRequired') : undefined}
          placeholder={t('components.barcodeForm.placeholder')}
        />
      </form>
      <Divider>{t('components.barcodeForm.divider')}</Divider>
      <Button fullWidth variant="contained" onClick={onScan}>
        {t('components.barcodeForm.openScan')}
      </Button>
    </Stack>
  );
};

export type BarcodeFormProps = {
  onScan: () => void;
  onSubmit: (code: string) => void;
};
