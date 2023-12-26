import {
  Between,
  Equal,
  FindOperator,
  In,
  IsNull,
  Like,
  Not,
  ObjectLiteral,
} from 'typeorm';
import { Workbook } from 'exceljs';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import * as tmp from 'tmp';

/**
 * Look for the param format and translate it to a language that TypeORM could understand.<br>
 * In case that the param is null, just will return an undefined
 *
 * @param rawQuery DTO Param
 * @param dataType Which type correspond to the value in DB
 *
 * @return TypeORM formatted param. Ex:
 * - '1163431|515313435' -> Between(1163431, 515313435)
 * - 'some,thing,like,this' -> In('some,thing,like,this'
 * - 'null' -> IsNull()
 * - undefined | null -> undefined
 */
export function parseSimpleCondition(
  rawQuery: string | number | boolean,
  dataType: 'string' | 'number' | 'boolean',
): FindOperator<any> | undefined {
  let query: FindOperator<any> = undefined;
  if (!rawQuery) return query;
  query = Equal(rawQuery);
  if (typeof rawQuery === 'boolean') return query;
  if (typeof rawQuery === 'number') return query;

  if (rawQuery.indexOf('|') !== -1) {
    const querySplit = rawQuery.split('|');
    if (querySplit.length < 2) return undefined;
    query = Between(querySplit[0], querySplit[1]);
  }
  else if (rawQuery.indexOf(',') !== -1) {
    const paramSplit = rawQuery.split(',');
    query = In(paramSplit.map((p) => {
      const cleanedParam = cleanSimpleParam(p, dataType);
      if (!!cleanedParam) return cleanedParam;
    }));
  }
  else if (rawQuery.indexOf('!') !== -1) {
    if (rawQuery.slice(1).toUpperCase() === 'NULL') query = Not(IsNull());
    else if (rawQuery.indexOf('like:') !== -1) {
      const cleanedParam = cleanSimpleParam(rawQuery.slice(1), dataType);
      query = !!cleanedParam ? Not(Like(cleanedParam)) : undefined;
    }
    else {
      const cleanedParam = cleanSimpleParam(rawQuery, dataType);
      query = !!cleanedParam ? Not(cleanedParam) : undefined;
    }
  }
  else {
    if (rawQuery.toUpperCase() === 'NULL') query = IsNull();
    else if (rawQuery.indexOf('like:') !== -1) {
      const cleanedParam = cleanSimpleParam(rawQuery, dataType);
      query = !!cleanedParam ? Not(Like(cleanedParam)) : undefined;
    }
    else {
      const cleanedParam = cleanSimpleParam(rawQuery, dataType);
      query = !!cleanedParam ? Equal(cleanedParam) : undefined;
    }
  }
  return query;
}

function cleanSimpleParam(
  rawParam: string,
  dataType: 'string' | 'number' | 'boolean',
): string | number | boolean {
  let param = undefined;
  if (rawParam.indexOf('!') !== -1) param = rawParam.slice(1);
  else if (rawParam.indexOf('like:') !== -1) param = rawParam.slice(5);
  else param = rawParam;

  if (dataType === 'number') {
    param = +param;
    if (isNaN(param)) param = undefined;
  }
  if (dataType === 'boolean') {
    param = (param?.toUpperCase() === 'TRUE') ? true : (param?.toUpperCase() === 'FALSE' ? false : undefined);
  }
  return param;
}

/**
 * Look for the param format and translate it to a language that TypeORM could understand.<br>
 * In case that the param is null, just will return an empty object.
 * @param param DTO Object
 *
 * @return TypeORM formatted param. Ex:
 * - {number: '1163431|515313435'} -> {number: Between(1163431, 515313435)}
 * - {word: 'some,thing,like,this'} -> [{word: 'some'}, {word: 'thing'}, {word: 'like'}, {word: 'this'}]
 * - null -> {}
 */
export function setParamCondition(
  param: object,
): ObjectLiteral | Array<ObjectLiteral> {
  let parsedParameter = {};
  const keys = Object.keys(param);
  if (keys.length < 1) return parsedParameter;
  const type = keys[0];
  if (!param[type]) return parsedParameter;
  if (param[type].indexOf('|') !== -1) {
    const paramSplit = param[type].split('|');
    parsedParameter = { [type]: Between(paramSplit[0], paramSplit[1]) };
  }
  else if (param[type].indexOf(',') !== -1) {
    const paramSplit = param[type].split(',');
    const paramArray = [];
    paramSplit.forEach((p) => {
      paramArray.push({ [type]: paramCase(p) });
    });
    parsedParameter = paramArray;
  }
  else {
    parsedParameter = { [type]: paramCase(param[type]) };
  }
  return parsedParameter;
}

/**
 * Find specific decorators on the query and translate to something that TypeORM could
 * understand.
 * @param param RAW param
 *
 * @return Param translated in case it needed. Ex:
 * - 'something' -> Equal('something')
 * - '!this' -> Not(Equal('this'))
 * - 'null' -> IsNull()
 */
function paramCase(param: string): FindOperator<any> {
  let parsedParam;
  if (param.indexOf('!') !== -1) {
    const fixParam = param.slice(1);
    if (fixParam.toUpperCase() === 'NULL') {
      parsedParam = Not(IsNull());
    }
    else {
      parsedParam = Not(Equal(fixParam));
    }
  }
  else {
    if (param.toUpperCase() === 'NULL') {
      parsedParam = IsNull();
    }
    else {
      parsedParam = Equal(param);
    }
  }
  return parsedParam ?? param;
}

/**
 * Build an object with the parameters cleaned for QueryBuilder
 * @param param
 * @param key
 * @param paramType
 */
export function structParamObjectForQuery(
  param: string,
  key: string,
  paramType: 'boolean' | 'number' | 'string',
): object {
  let parsedParameter = {};
  if (!param) return parsedParameter;
  if (param.indexOf('|') !== -1) {
    const paramSplit = param.split('|');
    parsedParameter[`${key}_0`] = paramSplit[0];
    parsedParameter[`${key}_1`] = paramSplit[1];
  }
  else if (param.indexOf(',') !== -1) {
    const paramSplit = param.split(',');
    parsedParameter = {};
    paramSplit.forEach((p, index) => {
      parsedParameter[`${key}_${index}`] = cleanParam(p, paramType);
    });
  }
  else {
    parsedParameter = { [`${key}_0`]: cleanParam(param, paramType) };
  }
  return parsedParameter;
}

/**
 * Clear the parameter from any decorator
 * @param param
 * @param paramType
 */
function cleanParam(
  param: string,
  paramType: 'boolean' | 'number' | 'string',
): any {
  let cleanedParam: any = param;
  if (param.indexOf('!') !== -1) {
    cleanedParam = param.slice(1);
  }
  switch (paramType) {
    case 'boolean':
      cleanedParam = cleanedParam?.toUpperCase();
      if (cleanedParam === 'TRUE') cleanedParam = true;
      if (cleanedParam === 'FALSE') cleanedParam = false;
      break;
    case 'number':
      cleanedParam = +cleanedParam;
      break;
    case 'string':
      cleanedParam = cleanedParam?.toUpperCase();
      break;
  }
  return cleanedParam;
}

/**
 * List in an object the parameters cleaned
 * @param relation
 * @param param
 * @param key
 */
export function structParamStringForQuery(
  relation: string,
  param: string,
  key: string,
): string {
  let parsedParameter = '';
  if (!param) return parsedParameter;
  if (param.indexOf('|') !== -1) {
    parsedParameter = `${relation} BETWEEN :${key}_0 AND :${key}_1`;
  }
  else if (param.indexOf(',') !== -1) {
    const paramNumber = param.split(',');
    const paramList = paramNumber.map((elem, index) => {
      return checkIfNullParam(relation, key, elem, index);
    });
    parsedParameter = `(${paramList.join(' OR ')})`;
  }
  else {
    parsedParameter = checkIfNullParam(relation, key, param);
  }
  return parsedParameter;
}

/**
 * Validate if the parameter is null and return the query condition
 * @param relation
 * @param key
 * @param param
 * @param index
 */
function checkIfNullParam(
  relation: string,
  key: string,
  param: string,
  index = 0,
) {
  let parsedParam = param;
  if (param.indexOf('!') !== -1) {
    if (param.slice(1).toUpperCase() === 'NULL')
      parsedParam = `NOT(${relation} IS NULL)`;
    else parsedParam = `NOT(${relation} = :${key}_${index})`;
  }
  else {
    if (param.slice(1).toUpperCase() === 'NULL')
      parsedParam = `${relation} IS NULL`;
    else parsedParam = `${relation} = :${key}_${index}`;
  }
  return parsedParam;
}

/**
 * Generate a pseudo-random string with the given length
 * @param length
 */
export function generateRandomString(length: number): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Format the date to DateType
 * @param date
 */
export function dateFormat(date: number): Date | string {
  if (!date) return '';
  return new Date(date * 1000);
}

/**
 * Returns a XLSX file
 * @param book
 * @param name
 */
export async function returnXlsxFile(book: Workbook, name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    tmp.file(
      {
        discardDescriptor: true,
        prefix: name,
        postfix: '.xlsx',
        mode: parseInt('0600', 8),
      },
      async (err, file) => {
        if (err) throw new BadRequestException(err);

        book.xlsx
          .writeFile(file)
          .then((_) => {
            resolve(file);
          })
          .catch((err) => {
            throw new BadRequestException(err);
          });
      },
    );
  });
}

/**
 * Format the HttpException to the  RRG Labs Standard.
 * @param status In most cases this is false... 💣
 * @param code HttpStatus Code
 * @param message Could be a simple text message or a object with many messages
 * @param data Any additional data for the client
 */
export function errorException(status: boolean, code: HttpStatus, message: string|object, data = []): HttpException {
  return new HttpException(
    {
      code: code,
      data: data,
      message: message,
      status: status,
    },
    code,
  );
}
