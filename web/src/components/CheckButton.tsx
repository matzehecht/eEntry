import { forwardRef } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, IconButtonProps } from '@mui/material';

export const CheckButton = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'ref' | 'children'>>((props, ref) => {
  return (
    <IconButton {...props} ref={ref}>
      <CheckIcon />
    </IconButton>
  );
});
