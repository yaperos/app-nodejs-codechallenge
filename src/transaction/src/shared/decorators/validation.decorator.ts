import Ajv from 'ajv'
import addFormats from "ajv-formats"
import { HttpResponse } from '../dto'
const ajv = new Ajv({ allErrors: true, coerceTypes: true })
addFormats(ajv)

interface ValidateSchema {
    valid: boolean
    errors: any
}

const validateSchema = (schema: any, payload: any): ValidateSchema => {
    const valid = ajv.validate(schema, payload)
    let validateDTO: ValidateSchema = {
        valid: valid,
        errors: ajv.errors
    }
    return validateDTO
}


const ValidationRequest = (schema: any) => {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalValue = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const { valid, errors } = validateSchema(schema, args[0])
            if (!valid) return new HttpResponse(400, errors)
            return originalValue.apply(this, args);
        };
    };
}

export {
    ValidationRequest
}