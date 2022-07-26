import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BaseLayout } from '../components/BaseLayout';
import { App } from '../config/Apps.types';

export const BasePage: React.FC<PropsWithChildren<BasePageProps>> = ({ children, app }) => {
  const { t } = useTranslation();

  return (
    <BaseLayout app={app}>
      <Helmet>
        <title>{`${t(app.label)} - eEntry | ${t('slogan')}`}</title>
        <meta content={`${t(app.label)} - eEntry | ${app.description ? t(app.description) : ''}`} name="description" />
      </Helmet>
      {children}
    </BaseLayout>
  );
};

type BasePageProps = {
  app: App;
};
