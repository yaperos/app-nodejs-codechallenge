import React from "react";
import { Link } from "react-router-dom";
import { BodyText, HeaderText } from "../atomos";
import { ITransaction } from "../../types/transaction/Transaction";
import { formatDate } from "../../utils/DateFormat";
import {
  SegmentOutlined,
  AutofpsSelectOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type PermissionTableProps = {
  transaction: ITransaction | undefined;
};

const PermissionTable: React.FC<PermissionTableProps> = ({ transaction }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <AutofpsSelectOutlined fontSize="small" color="disabled" />
                <HeaderText label="transactionExternalId" />
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <SegmentOutlined fontSize="small" color="disabled" />
                <HeaderText label="transactionType" />
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <SegmentOutlined fontSize="small" color="disabled" />
                <HeaderText label="value" />
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <SegmentOutlined fontSize="small" color="disabled" />
                <HeaderText label="transactionStatus" />
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthOutlined fontSize="small" color="disabled" />
                <HeaderText label="createdAt" />
              </Box>
            </TableCell>
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarMonthOutlined fontSize="small" color="disabled" />
                <HeaderText label="updatedAtStatus" />
              </Box>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transaction && (
            <TableRow>
              <TableCell>
                <BodyText label={transaction.transactionExternalId} />
              </TableCell>
              <TableCell>
                <BodyText label={transaction.transactionType.name} />
              </TableCell>
              <TableCell>
                <BodyText label={transaction.value} />
              </TableCell>
              <TableCell>
                <BodyText label={transaction.transactionStatus.name} />
              </TableCell>
              <TableCell>
                <BodyText label={formatDate(transaction.createdAt)} />
              </TableCell>
              <TableCell>
                <BodyText label={formatDate(transaction.updatedAtStatus)} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionTable;
