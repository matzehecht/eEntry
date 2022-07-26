import { FC } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const ValidIndicator: FC<ValidIndicatorProps> = ({ validity }) => {
  switch (validity) {
    case 'error':
      return <ErrorOutlineIcon color="error" fontSize="large" />;
    case 'warning':
      return <WarningAmberIcon color="warning" fontSize="large" />;
    case 'success':
      return <CheckCircleOutlineIcon color="success" fontSize="large" />;
    default:
      return <HelpOutlineIcon fontSize="large" />;
  }
};

type ValidIndicatorProps = {
  validity: 'error' | 'warning' | 'success';
};
