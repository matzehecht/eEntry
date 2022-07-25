import { FC } from 'react';
import { Dialog, SxProps, Theme, useMediaQuery } from '@mui/material';
import { Scanner } from './Scanner';

const sx: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.up('md')]: {
    height: 0.75,
  },
});

export const BarcodeDialog: FC<BarcodeDialogProps> = ({ onClose, onScanned, open }) => {
  const fullScreen = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <Dialog fullScreen={fullScreen} fullWidth open={open} PaperProps={{ sx }} onClose={onClose}>
      <Scanner onBack={onClose} onScanned={onScanned} />
    </Dialog>
  );
};

type BarcodeDialogProps = {
  onClose: () => void;
  onScanned: (code: string) => void;
  open: boolean;
};
