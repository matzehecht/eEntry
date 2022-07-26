import { PropsWithChildren } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { AuthProvider } from './config/AuthProvider';
import { ThemeProvider } from './config/ThemeProvider';
import { store } from './store/store';

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <RecoilRoot>
      <HelmetProvider>
        <BrowserRouter>
          <Provider store={store}>
            <SnackbarProvider maxSnack={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider>
                  <AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
              </LocalizationProvider>
            </SnackbarProvider>
          </Provider>
        </BrowserRouter>
      </HelmetProvider>
    </RecoilRoot>
  );
};

type ProvidersProps = PropsWithChildren;
