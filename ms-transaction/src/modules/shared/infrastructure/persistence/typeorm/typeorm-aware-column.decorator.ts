import { Column, ColumnOptions, ColumnType } from 'typeorm';

const pgSqliteTypeMapping: { [key: string]: ColumnType } = {
  enum: 'text',
  timestamp: 'datetime',
};

function resolveType(type: ColumnType): ColumnType {
  const isTestEnv = process.env.NODE_ENV === 'test';
  if (isTestEnv && type.toString() in pgSqliteTypeMapping) {
    return pgSqliteTypeMapping[type.toString()];
  }
  return type;
}

export function AwareColumn(columnOptions: ColumnOptions): PropertyDecorator {
  if (columnOptions.type) {
    columnOptions.type = resolveType(columnOptions.type);
  }
  return Column(columnOptions);
}
