import { FC } from 'react';
import CameraIcon from '@mui/icons-material/Camera';
import { Box, SxProps, Theme, alpha, keyframes } from '@mui/material';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const sx: Record<string, SxProps<Theme>> = {
  container: {
    alignItems: 'center',
    backgroundColor: (theme) => alpha(theme.palette.grey[900], theme.palette.action.disabledOpacity),
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    animation: `${spin} 3s infinite ease`,
  },
};

export const CameraPlaceholder: FC = () => {
  return (
    <Box sx={sx.container}>
      <CameraIcon fontSize="large" sx={sx.icon} />
    </Box>
  );
};
