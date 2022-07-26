import { PropsWithChildren } from 'react';
import { useCheckAuthQuery } from '../api/api.auth';
import { CenteredLoading } from '../components/CenteredLoading';
import { LoginPage } from '../pages/Login';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: isAuthenticated, isFetching } = useCheckAuthQuery();

  if (isFetching) {
    return <CenteredLoading />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};
