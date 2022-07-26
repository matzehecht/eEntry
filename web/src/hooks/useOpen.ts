import { useCallback, useState } from 'react';

export const useOpen = (initialState?: boolean): [boolean, () => void, () => void, () => void] => {
  const [open, setOpen] = useState(initialState ?? false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleReset = useCallback(() => setOpen(initialState ?? false), [initialState]);

  return [open, handleOpen, handleClose, handleReset];
};
