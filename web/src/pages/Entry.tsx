import { useCallback } from 'react';
import { Container, Divider, Stack, Step, StepLabel, Stepper, SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { BarcodeDialog } from '../components/BarcodeDialog';
import { BarcodeForm } from '../components/BarcodeForm';
import { EventCard } from '../components/EventCard';
import { TicketCheckinConfirm } from '../components/TicketCheckinConfirm';
import { App } from '../config/Apps.types';
import { useOpen } from '../hooks/useOpen';
import { BasePage } from './BasePage';

const sx: Record<string, SxProps<Theme>> = {
  container: {
    marginTop: 2,
  },
};

export const Entry: React.FC<App> = (app) => {
  const { t } = useTranslation();

  const { '*': code } = useParams<'*'>();
  const navigate = useNavigate();

  const [scanning, handleScan, handleStopScan] = useOpen(false);

  const handleSubmit = useCallback((code: string) => navigate(code), [navigate]);

  const handleCancelConfirm = useCallback(() => navigate('.'), [navigate]);
  const handleConfirmed = useCallback(() => navigate('.'), [navigate]);

  return (
    <>
      <BasePage app={app}>
        <Stack gap={2}>
          <EventCard />
          <Divider />
          <Container maxWidth="sm" sx={sx.container}>
            <Routes>
              <Route
                element={<TicketCheckinConfirm code={code || ''} onCancel={handleCancelConfirm} onConfirmed={handleConfirmed} />}
                path="/*"
              />
              <Route element={<BarcodeForm onScan={handleScan} onSubmit={handleSubmit} />} path="/" />
            </Routes>
          </Container>
          <Container maxWidth="sm" sx={sx.container}>
            <Stepper activeStep={code ? 1 : 0} alternativeLabel>
              <Step>
                <StepLabel>{t('pages.entry.steps.code')}</StepLabel>
              </Step>
              <Step>
                <StepLabel>{t('pages.entry.steps.confirm')}</StepLabel>
              </Step>
            </Stepper>
          </Container>
        </Stack>
      </BasePage>
      <BarcodeDialog open={scanning} onClose={handleStopScan} onScanned={handleSubmit} />
    </>
  );
};
