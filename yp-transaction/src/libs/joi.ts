import Joi from "joi"

export const joiError = ({ msg = 'Code Error => ', code = "" }) => new Error(`${msg} ${code}`);
export const joiInteger = (min: number, max?: number) => {
    let ret = Joi.number().integer().min(min);

    if(max !== undefined){
        ret = ret.max(max);
    }

    return ret
}
export const joiDouble = (min: number, max?: number) => {
    let ret = Joi.number().min(min);

    if(max !== undefined){
        ret = ret.max(max);
    }

    return ret
}
export const joiString = (min: number, max: number) => {
    return Joi.string().min(min).max(max)
}
export const joiObj = (rules = {}) => Joi.object({ ...rules })