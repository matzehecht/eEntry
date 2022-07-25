import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
// import StorefrontIcon from '@mui/icons-material/Storefront';
import { EEntryIcon } from '../icons/EEntry';
import { App } from './Apps.types';

// export type APP_KEYS = 'admin' | 'boxOffice' | 'entry' | 'launcher';
export type APP_KEYS = 'admin' | 'entry' | 'launcher';
export const APPS: Record<APP_KEYS, App> = {
  admin: {
    description: 'apps.admin.description',
    Icon: <SettingsIcon />,
    label: 'apps.admin.label',
    order: 2,
    path: '/admin',
    role: 'admin',
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
    order: 3,
    path: '/',
  },
} as const;

export const APPS_LIST = Object.values(APPS)
  .filter((app) => !app.hideInApps)
  .sort((a, b) => a.order - b.order);
