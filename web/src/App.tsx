import { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { APPS, APP_KEYS } from './config/Apps';
import { Admin } from './pages/Admin';
import { Entry } from './pages/Entry';
import { Launcher } from './pages/Launcher';
import { Stats } from './pages/Stats';

const APP_PAGES: Record<APP_KEYS, ReactElement> = {
  admin: <Admin {...APPS.admin} />,
  // boxOffice: <></>,
  entry: <Entry {...APPS.entry} />,
  launcher: <Launcher {...APPS.launcher} />,
  stats: <Stats {...APPS.stats} />,
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
