import { Interpolation } from '@mui/system';
import { Theme } from '@mui/material/styles/createTheme';
import { ComponentsPropsList } from '@mui/material/styles/props';

export type ComponentsVariants = {
  [Name in keyof ComponentsPropsList]?: Array<{
    props: Partial<ComponentsPropsList[Name]>;
    style: Interpolation<{ theme: Theme }>;
  }>;
};
