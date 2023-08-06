export enum varMsjDto {
    ISNUMBERSTRING_MESSAGE = '{"name": "$property", "reason": "$property debe ser de tipo numérico"}',
    MAXLENGTH_MESSAGE = '{"name": "$property", "reason": "$property debe ser maximo $constraint1 de largo"}',
    MINLENGTH_MESSAGE = '{"name": "$property", "reason": "$property debe ser minimo $constraint1 de largo"}',
    ISNOTEMPTY_MESSAGE = '{"name": "$property", "reason": "$property no puede ser vacío"}',
    ISSTRING_MESSAGE = '{"name": "$property", "reason": "$property debe ser de tipo cadena"}',
    ISARRAY_MESSAGE = '{"name": "$property", "reason": "$property debe ser de tipo array"}',
    LENGTH_MESSAGE = '{"name":"$property", "reason":"$property debe ser menor a $constraint2 y mayor a $constraint1"}',
    ISNUMBER_MESSAGE = '{"name": "$property", "reason": "$property debe ser de tipo numérico"}',
}