import { PropsWithChildren } from 'react';
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
              <ThemeProvider>
                <AuthProvider>{children}</AuthProvider>
              </ThemeProvider>
            </SnackbarProvider>
          </Provider>
        </BrowserRouter>
      </HelmetProvider>
    </RecoilRoot>
  );
};

type ProvidersProps = PropsWithChildren;
