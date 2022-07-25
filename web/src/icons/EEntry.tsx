import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent } from '../assets/icon.svg';

export const EEntryIcon: React.FC<Omit<SvgIconProps, 'component' | 'inheritViewBox'>> = (props) => (
  <SvgIcon {...props} component={ReactComponent} inheritViewBox />
);
