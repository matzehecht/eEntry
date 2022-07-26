import { FC, useCallback, useEffect, useRef } from 'react';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { saveAs } from 'file-saver';
import JsBarcode from 'jsbarcode';
import { useTranslation } from 'react-i18next';

const barcodeOptions = {
  format: 'CODE128',
  height: 50,
  margin: 10,
  marginTop: 30,
  width: 1,
};

export const DeviceCodeDialog: FC<DeviceCodeDialogProps> = ({ code, name, open, onClose }) => {
  const { t } = useTranslation();

  const barcodeRef = useRef<HTMLDivElement>(null);
  const barcodeCanvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    barcodeCanvasRef.current = document.createElement('canvas');
    JsBarcode(barcodeCanvasRef.current, code, barcodeOptions);

    const context = barcodeCanvasRef.current.getContext('2d');

    if (context) {
      context.textAlign = 'center';
      context.fillText(name, -200, 20);
    }

    barcodeRef.current?.appendChild(barcodeCanvasRef.current);

    return () => {
      barcodeCanvasRef.current?.remove();
      barcodeCanvasRef.current = undefined;
    };
  });

  const handleSave = useCallback(() => {
    const dataURL = barcodeCanvasRef.current?.toDataURL('image/png', 1.0);
    if (dataURL) {
      saveAs(dataURL, `${encodeURI(name)}.png`);
    }
  }, [name]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('components.deviceCodeDialog.title')}</DialogTitle>
      <DialogContent>
        <Stack gap={1}>
          <DialogContentText>{t('components.deviceCodeDialog.description')}</DialogContentText>
          <Box ref={barcodeRef} sx={{ display: 'flex', justifyContent: 'center' }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<SaveAsIcon />} variant="contained" onClick={handleSave}>
          {t('components.deviceCodeDialog.saveImage')}
        </Button>
        <Button variant="contained" onClick={onClose}>
          {t('buttons.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type DeviceCodeDialogProps = {
  code: string;
  name: string;
  onClose: () => void;
  open: boolean;
};
