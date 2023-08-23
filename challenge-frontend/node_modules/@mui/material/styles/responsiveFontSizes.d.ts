import { Breakpoint } from '@mui/system';
import { Typography } from '@mui/material/styles/createTypography';
import { Theme } from '@mui/material/styles/createTheme';

export interface ResponsiveFontSizesOptions {
  breakpoints?: Breakpoint[];
  disableAlign?: boolean;
  factor?: number;
  variants?: Array<keyof Typography>;
}

export default function responsiveFontSizes(
  theme: Theme,
  options?: ResponsiveFontSizesOptions,
): Theme;
