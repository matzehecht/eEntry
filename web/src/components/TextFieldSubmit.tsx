import { forwardRef, useMemo } from 'react';
import { InputBaseProps, TextField, TextFieldProps } from '@mui/material';
import { CheckButton } from './CheckButton';

export const TextFieldSubmit = forwardRef<HTMLInputElement, Omit<TextFieldProps, 'ref'>>(({ InputProps, ...rest }, ref) => {
  const inputProps = useMemo<InputBaseProps>(() => ({ ...InputProps, endAdornment: <CheckButton type="submit" /> }), [InputProps]);

  return <TextField {...rest} ref={ref} InputProps={inputProps} />;
});
