import { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import { App } from '../config/Apps.types';
import { AdminDashboard } from './AdminDashboard';
import { AdminTickets } from './AdminTickets';
import { BasePage } from './BasePage';

const ADMIN_PAGES: Record<string, ReactElement> = {
  dashboard: <AdminDashboard />,
  tickets: <AdminTickets />,
};

export const Admin: React.FC<App> = (app) => {
  return (
    <BasePage app={app}>
      <Routes>
        {app.subpages?.map(({ path, key }, i) => (
          <Route key={i} element={ADMIN_PAGES[key]} path={`/${path}/*`}></Route>
        ))}
        <Route element={ADMIN_PAGES['dashboard']} path="/*"></Route>
      </Routes>
    </BasePage>
  );
};
