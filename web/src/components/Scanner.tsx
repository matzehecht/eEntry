import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import FlashlightOffOutlinedIcon from '@mui/icons-material/FlashlightOffOutlined';
import FlashlightOnOutlinedIcon from '@mui/icons-material/FlashlightOnOutlined';
import { Box, Button, SxProps, Theme, IconButton, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { torchState, videoDeviceIdState } from '../store/recoil';
import { CameraPlaceholder } from './CameraPlaceholder';
import { canTorch, stopMediaStream } from './Scanner.utils';

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

const FORMATS = ['code_128'];

export const Scanner: FC<ScannerProps> = ({ onBack, onScanned }) => {
  const { t } = useTranslation();

  const [deviceId, setDeviceId] = useRecoilState(videoDeviceIdState);
  const [torchOn, setTorchOn] = useRecoilState(torchState);
  const [deviceIds, setDeviceIds] = useState<string[]>();
  const hasMultipleDevices = useMemo(() => Boolean(deviceIds && deviceIds.length > 1), [deviceIds]);

  const [hasTorch, setHasTorch] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>();
  const detector = useMemo(() => new window.BarcodeDetector({ formats: FORMATS }), []);

  const toggleTorch = useCallback(() => setTorchOn((prev) => !prev), [setTorchOn]);
  const handleCameraSwitch = useCallback(() => {
    if (deviceIds) {
      const index = deviceId ? deviceIds.indexOf(deviceId) : 0;
      const nextDeviceId = deviceIds[index + 1];

      setDeviceId(nextDeviceId ?? deviceIds[0]);
    }
  }, [deviceId, deviceIds, setDeviceId]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setDeviceIds(devices.filter(({ kind }) => kind === 'videoinput').map(({ deviceId }) => deviceId));
    });
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          aspectRatio: 9 / 16,
          deviceId: deviceId,
          height: { min: 500 },
          width: { min: 500 },
        },
      })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          const torchAvailable = canTorch(stream);
          setHasTorch(torchAvailable);
        } else {
          // If already unmounted
          stopMediaStream(stream);
        }
      });
    return () => {
      if (streamRef.current) {
        stopMediaStream(streamRef.current);
      }
    };
  }, [deviceId]);

  useEffect(() => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      // eslint-disable-next-line no-type-assertion/no-type-assertion
      videoTrack.applyConstraints({ advanced: [{ torch: torchOn } as MediaTrackConstraintSet] });
    }
  }, [torchOn]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current) {
        // eslint-disable-next-line no-type-assertion/no-type-assertion
        const barcodes = (await detector.detect(videoRef.current)) as Barcode[];

        if (barcodes.length > 0) {
          onScanned(barcodes[0].rawValue);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [detector, onScanned]);

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

type Barcode = {
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number }[];
  format: string;
  orientation: number;
  quality: number;
  rawValue: string;
};
