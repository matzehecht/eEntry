import { FC, useMemo } from 'react';
import { Box, CircularProgress, LinearProgress, SxProps, Theme } from '@mui/material';

const sx: SxProps<Theme> = {
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
};

export const CenteredLoading: FC<CeneteredLoadingProps> = ({ loader = 'circular' }) => {
  const LoaderComponent = useMemo(() => (loader === 'circular' ? <CircularProgress /> : <LinearProgress />), [loader]);

  return <Box sx={sx}>{LoaderComponent}</Box>;
};

type CeneteredLoadingProps = {
  loader?: 'cirular' | 'linear';
};
