import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const tokenState = atom<string | undefined>({
  default: undefined,
  effects_UNSTABLE: [persistAtom],
  key: 'token',
});

export const videoDeviceIdState = atom<string | undefined>({
  default: undefined,
  effects_UNSTABLE: [persistAtom],
  key: 'videoDeviceId',
});

export const torchState = atom<boolean>({
  default: false,
  effects_UNSTABLE: [persistAtom],
  key: 'torchState',
});

export type ThemePreference = 'system' | 'light' | 'dark';
export const themePreferenceState = atom<ThemePreference>({
  default: 'system',
  effects_UNSTABLE: [persistAtom],
  key: 'themePreference',
});
