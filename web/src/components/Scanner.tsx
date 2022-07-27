import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import FlashlightOffOutlinedIcon from '@mui/icons-material/FlashlightOffOutlined';
import FlashlightOnOutlinedIcon from '@mui/icons-material/FlashlightOnOutlined';
import { Box, Button, SxProps, Theme, IconButton, alpha } from '@mui/material';
import { BrowserMultiFormatOneDReader, IScannerControls, BarcodeFormat } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { torchState, videoDeviceIdState } from '../store/recoil';
import { playBeep } from '../utils/sounds';
import { CameraPlaceholder } from './CameraPlaceholder';

const sx: Record<string, SxProps<Theme>> = {
  container: {
    height: 1,
    position: 'relative',
    width: 1,
  },
  controls: {
    alignItems: 'center',
    backgroundColor: (theme) => alpha(theme.palette.background.default, 0.3),
    bottom: 0,
    display: 'flex',
    height: 0.1,
    justifyContent: 'space-between',
    left: 0,
    padding: 2,
    position: 'absolute',
    right: 0,
  },
  video: {
    bottom: 0,
    height: 1,
    left: 0,
    objectFit: 'cover',
    objectPosition: 'center',
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 1,
  },
  videoContainer: {
    height: 1,
    position: 'relative',
    width: 1,
  },
};

const DECODE_HINTS = new Map<DecodeHintType, any>([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]]] as const);

export const Scanner: FC<ScannerProps> = ({ onBack, onScanned }) => {
  const { t } = useTranslation();

  const [deviceId, setDeviceId] = useRecoilState(videoDeviceIdState);
  const [torchOn, setTorchOn] = useRecoilState(torchState);
  const [deviceIds, setDeviceIds] = useState<string[]>();
  const hasMultipleDevices = useMemo(() => Boolean(deviceIds && deviceIds.length > 1), [deviceIds]);

  const [hasTorch, setHasTorch] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControls = useRef<IScannerControls>();
  const barcodeReader = useMemo(() => new BrowserMultiFormatOneDReader(DECODE_HINTS), []);

  const toggleTorch = useCallback(() => setTorchOn((prev) => !prev), [setTorchOn]);
  const handleCameraSwitch = useCallback(() => {
    if (deviceIds) {
      const index = typeof deviceId === 'string' ? deviceIds.indexOf(deviceId) : 0;
      const nextDeviceId = deviceIds[index + 1];

      setDeviceId(nextDeviceId ?? deviceIds[0]);
    }
  }, [deviceId, deviceIds, setDeviceId]);

  useEffect(() => {
    BrowserMultiFormatOneDReader.listVideoInputDevices().then((devices) => {
      setDeviceIds(devices.filter(({ kind }) => kind === 'videoinput').map(({ deviceId }) => deviceId));
    });
  }, []);

  useEffect(() => {
    if (hasTorch) {
      scannerControls.current?.switchTorch?.(torchOn);
    }
  }, [hasTorch, torchOn]);

  useEffect(() => {
    if (videoRef.current) {
      barcodeReader
        .decodeFromVideoDevice(deviceId, videoRef.current, (result, error, controls) => {
          if (result?.getText()) {
            controls.stop();
            if (navigator.vibrate) {
              navigator.vibrate([100, 300, 200]);
            }
            playBeep();
            setTimeout(() => onScanned(result?.getText()), 100);
          }
        })
        .then((newScanner) => {
          setHasTorch(Boolean(newScanner.switchTorch));
          scannerControls.current = newScanner;
        });
    }

    return () => {
      scannerControls.current?.stop();
    };
  }, [barcodeReader, deviceId, onScanned]);

  return (
    <Box sx={sx.container}>
      <Box sx={sx.videoContainer}>
        <CameraPlaceholder />
        <Box ref={videoRef} autoPlay component="video" muted playsInline sx={sx.video} />
      </Box>
      <Box sx={sx.controls}>
        <Button variant="contained" onClick={onBack}>
          {t('buttons.back')}
        </Button>
        <Box>
          <IconButton disabled={!hasMultipleDevices} onClick={handleCameraSwitch}>
            <CameraswitchIcon />
          </IconButton>
          <IconButton disabled={!hasTorch} onClick={toggleTorch}>
            {torchOn ? <FlashlightOnOutlinedIcon /> : <FlashlightOffOutlinedIcon />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

type ScannerProps = {
  onBack: () => void;
  onScanned: (code: string) => void;
};

// type Barcode = {
//   boundingBox: DOMRectReadOnly;
//   cornerPoints: { x: number; y: number }[];
//   format: string;
//   orientation: number;
//   quality: number;
//   rawValue: string;
// };
