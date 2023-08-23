import { CSSObject } from '@mui/styled-engine';
import { Breakpoints, BreakpointsOptions } from '@mui/system/createTheme/createBreakpoints';
import { Shape, ShapeOptions } from '@mui/system/createTheme/shape';
import { Spacing, SpacingOptions } from '@mui/system/createTheme/createSpacing';
import { SxConfig, SxProps } from '@mui/system/styleFunctionSx';

export { Breakpoint, BreakpointOverrides } from '@mui/system/createTheme/createBreakpoints';

export type Direction = 'ltr' | 'rtl';

export interface ThemeOptions {
  shape?: ShapeOptions;
  breakpoints?: BreakpointsOptions;
  direction?: Direction;
  mixins?: unknown;
  palette?: Record<string, any>;
  shadows?: unknown;
  spacing?: SpacingOptions;
  transitions?: unknown;
  components?: Record<string, any>;
  typography?: unknown;
  zIndex?: Record<string, number>;
  unstable_sxConfig?: SxConfig;
}

export interface Theme {
  shape: Shape;
  breakpoints: Breakpoints;
  direction: Direction;
  palette: Record<string, any> & { mode: 'light' | 'dark' };
  shadows?: unknown;
  spacing: Spacing;
  transitions?: unknown;
  components?: Record<string, any>;
  mixins?: unknown;
  typography?: unknown;
  zIndex?: unknown;
  unstable_sxConfig: SxConfig;
  unstable_sx: (props: SxProps<Theme>) => CSSObject;
}

/**
 * Generate a theme base on the options received.
 * @param options Takes an incomplete theme object and adds the missing parts.
 * @param args Deep merge the arguments with the about to be returned theme.
 * @returns A complete, ready-to-use theme object.
 */
export default function createTheme(options?: ThemeOptions, ...args: object[]): Theme;
