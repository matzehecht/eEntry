import { ReactElement } from 'react';

type SubPage = Readonly<{
  key: string;
  label: string;
  path: string;
}>;

export type App = Readonly<{
  Icon: ReactElement;
  description?: string;
  disableMenu?: boolean;
  hideInApps?: boolean;
  label: string;
  order: number;
  path: string;
  role?: string;
  subpages?: Readonly<SubPage[]>;
}>;
