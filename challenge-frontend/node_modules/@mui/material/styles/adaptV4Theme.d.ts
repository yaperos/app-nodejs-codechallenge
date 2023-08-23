import { BreakpointsOptions, ShapeOptions, SpacingOptions } from '@mui/system';
import { MixinsOptions } from '@mui/material/styles/createMixins';
import { Palette, PaletteOptions } from '@mui/material/styles/createPalette';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { Shadows } from '@mui/material/styles/shadows';
import { TransitionsOptions } from '@mui/material/styles/createTransitions';
import { ZIndexOptions } from '@mui/material/styles/zIndex';
import { ComponentsOverrides } from '@mui/material/styles/overrides';
import { ComponentsVariants } from '@mui/material/styles/variants';
import { ComponentsProps } from '@mui/material/styles/props';
import { Theme } from '@mui/material/styles/createTheme';

export type Direction = 'ltr' | 'rtl';

export interface DeprecatedThemeOptions {
  shape?: ShapeOptions;
  breakpoints?: BreakpointsOptions;
  direction?: Direction;
  mixins?: MixinsOptions;
  overrides?: ComponentsOverrides;
  palette?: PaletteOptions;
  props?: ComponentsProps;
  shadows?: Shadows;
  spacing?: SpacingOptions;
  transitions?: TransitionsOptions;
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
  variants?: ComponentsVariants;
  zIndex?: ZIndexOptions;
  unstable_strictMode?: boolean;
}

/**
 * Generate a theme base on the V4 theme options received.
 * @deprecated Follow the upgrade guide on https://mui.com/r/migration-v4#theme
 * @param options Takes an incomplete theme object and adds the missing parts.
 * @returns A complete, ready-to-use theme object.
 */
export default function adaptV4Theme(options?: DeprecatedThemeOptions): Theme;
