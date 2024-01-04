/* eslint-disable @typescript-eslint/ban-types */
import { MixedList } from "typeorm"
import { TransactionRefactoring1704343754031 } from "./1704343754031-TransactionRefactoring"
import { TransactionRefactoring1704346663466 } from "./1704346663466-TransactionRefactoring"

export const MIGRATIONS: MixedList<Function> = [
  TransactionRefactoring1704343754031,
  TransactionRefactoring1704346663466
]