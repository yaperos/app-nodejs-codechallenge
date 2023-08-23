import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx';

export default function extendSxProp<Props extends { sx?: SxProps<any> } = {}>(props: Props): Props;
