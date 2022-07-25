import { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { APPS, APP_KEYS } from './config/Apps';
import { Entry } from './pages/Entry';
import { Launcher } from './pages/Launcher';

const APP_PAGES: Record<APP_KEYS, ReactElement> = {
  admin: <></>,
  // boxOffice: <></>,
  entry: <Entry {...APPS.entry} />,
  launcher: <Launcher {...APPS.launcher} />,
};

export const App: React.FC = () => {
  return (
    <Routes>
      {Object.entries(APPS).map(([key, { path }], i) => (
        // eslint-disable-next-line no-type-assertion/no-type-assertion
        <Route key={i} element={APP_PAGES[key as APP_KEYS]} path={`${path}/*`} />
      ))}
    </Routes>
  );
};
