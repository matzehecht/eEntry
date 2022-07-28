import AppsIcon from '@mui/icons-material/Apps';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
// import StorefrontIcon from '@mui/icons-material/Storefront';
import { EEntryIcon } from '../icons/EEntry';
import { App } from './Apps.types';

// export type APP_KEYS = 'admin' | 'boxOffice' | 'entry' | 'launcher';
export type APP_KEYS = 'admin' | 'entry' | 'launcher' | 'stats';
export const APPS: Record<APP_KEYS, App> = {
  admin: {
    description: 'apps.admin.description',
    Icon: <SettingsIcon />,
    label: 'apps.admin.label',
    order: 2,
    path: '/admin',
    role: 'admin',
    subpages: [
      {
        key: 'tickets',
        label: 'apps.admin.subpages.tickets.label',
        path: 'tickets',
      },
    ],
  },
  // boxOffice: {
  //   description: 'apps.boxOffice.description',
  //   Icon: <StorefrontIcon />,
  //   label: 'apps.boxOffice.label',
  //   order: 1,
  //   path: '/box-office',
  //   role: 'boxoffice',
  // },
  entry: {
    description: 'apps.entry.description',
    Icon: <EEntryIcon />,
    label: 'apps.entry.label',
    order: 0,
    path: '/entry',
    role: 'entry',
  },
  launcher: {
    disableMenu: true,
    hideInApps: true,
    Icon: <AppsIcon />,
    label: 'apps.launcher.label',
    order: 4,
    path: '/',
  },
  stats: {
    description: 'apps.stats.description',
    disableMenu: true,
    Icon: <InsightsIcon />,
    label: 'apps.stats.label',
    order: 3,
    path: '/stats',
    role: 'admin',
  },
} as const;

export const APPS_LIST = Object.values(APPS)
  .filter((app) => !app.hideInApps)
  .sort((a, b) => a.order - b.order);
