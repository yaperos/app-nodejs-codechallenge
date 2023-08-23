import { CSSObject } from '@mui/styled-engine';
import { Breakpoints } from '@mui/system/createTheme/createBreakpoints';
import type { Breakpoint } from '@mui/system/createTheme';
import { ResponsiveStyleValue } from '@mui/system/styleFunctionSx';

export interface ResolveBreakpointValuesOptions<T> {
  values: ResponsiveStyleValue<T>;
  breakpoints?: Breakpoints['values'];
  base?: Record<string, boolean>;
}
export function resolveBreakpointValues<T>(
  options: ResolveBreakpointValuesOptions<T>,
): Record<string, T>;

export function mergeBreakpointsInOrder(breakpoints: Breakpoints, styles: CSSObject[]): CSSObject;

export function handleBreakpoints<Props>(
  props: Props,
  propValue: any,
  styleFromPropValue: (value: any, breakpoint?: Breakpoint) => any,
): any;
