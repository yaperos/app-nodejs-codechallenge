import * as React from 'react';
import { OverridableComponent } from '@mui/types';
import { GridTypeMap } from '@mui/system/Unstable_Grid/GridProps';
declare const defaultCreateStyledComponent: import("@mui/styled-engine").CreateStyledComponent<import("@mui/system/createStyled").MUIStyledCommonProps<any>, Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof React.ClassAttributes<HTMLDivElement> | keyof React.HTMLAttributes<HTMLDivElement>>, {}, any>;
declare function useThemePropsDefault<T extends {}>(props: T): T & {};
export default function createGrid(options?: {
    createStyledComponent?: typeof defaultCreateStyledComponent;
    useThemeProps?: typeof useThemePropsDefault;
    componentName?: string;
}): OverridableComponent<GridTypeMap<{}, "div">>;
export {};
