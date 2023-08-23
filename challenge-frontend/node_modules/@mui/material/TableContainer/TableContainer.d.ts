import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';
import { OverridableComponent, OverrideProps } from '@mui/material/OverridableComponent';
import { TableContainerClasses } from '@mui/material/TableContainer/tableContainerClasses';

export interface TableContainerTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    /**
     * The content of the component, normally `Table`.
     */
    children?: React.ReactNode;
    /**
     * Override or extend the styles applied to the component.
     */
    classes?: Partial<TableContainerClasses>;
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps<Theme>;
  };
  defaultComponent: D;
}
/**
 *
 * Demos:
 *
 * - [Table](https://mui.com/material-ui/react-table/)
 *
 * API:
 *
 * - [TableContainer API](https://mui.com/material-ui/api/table-container/)
 */
declare const TableContainer: OverridableComponent<TableContainerTypeMap>;

export type TableContainerProps<
  D extends React.ElementType = TableContainerTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<TableContainerTypeMap<P, D>, D>;

export default TableContainer;
