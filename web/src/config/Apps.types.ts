import { ReactElement } from 'react';

export type App = Readonly<{
  Icon: ReactElement;
  description?: string;
  disableMenu?: boolean;
  hideInApps?: boolean;
  label: string;
  order: number;
  path: string;
  role?: string;
}>;
