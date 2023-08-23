import { BoxTypeMap } from '@mui/system';
import { OverridableComponent } from '@mui/types';
import { OverrideProps } from '@mui/material/OverridableComponent';
import { Theme as MaterialTheme } from '@mui/material/styles';

/**
 *
 * Demos:
 *
 * - [Box](https://mui.com/material-ui/react-box/)
 *
 * API:
 *
 * - [Box API](https://mui.com/material-ui/api/box/)
 */
declare const Box: OverridableComponent<BoxTypeMap<{}, 'div', MaterialTheme>>;

export type BoxProps<
  D extends React.ElementType = BoxTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<BoxTypeMap<P, D, MaterialTheme>, D>;

export default Box;
