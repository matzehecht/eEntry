import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill';

export declare global {
  interface Window {
    BarcodeDetector: typeof BarcodeDetectorPolyfill;
  }
}
