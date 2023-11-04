const TYPES = require("tedious").TYPES;

const parametrizacion = (data) => {
    try {
        return data.map(({ name, value, type, schema }) => ({ nombre: name, valor: value, tipo: type }));
    } catch (error) {
        console.error(error);
        return error;
    }
}

class SpParam {
    name;
    value;
    type;
    schema;
    constructor(name, value, type, schema = null) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.schema = schema;
    }
}
function getType(type) {
    switch (type) {
        case 'BigInt':
            return TYPES.BigInt
        case 'Binary':
            return TYPES.Binary
        case 'Bit':
            return TYPES.Bit
        case 'Char':
            return TYPES.Char
        case 'Date':
            return TYPES.Date
        case 'DateTime2':
            return TYPES.DateTime2
        case 'DateTime':
            return TYPES.DateTime
        case 'DateTimeOffset':
            return TYPES.DateTimeOffset
        case 'Decimal':
            return TYPES.Decimal
        case 'Float':
            return TYPES.Float
        case 'Image':
            return TYPES.Image
        case 'Int':
            return TYPES.Int
        case 'Money':
            return TYPES.Money
        case 'NChar':
            return TYPES.NChar
        case 'NText':
            return TYPES.NText
        case 'NVarChar':
            return TYPES.NVarChar
        case 'Null':
            return TYPES.Null
        case 'Numeric':
            return TYPES.Numeric
        case 'Real':
            return TYPES.Real
        case 'SmallDateTime':
            return TYPES.SmallDateTime
        case 'SmallInt':
            return TYPES.SmallInt
        case 'SmallMoney':
            return TYPES.SmallMoney
        case 'TVP':
            return TYPES.TVP
        case 'Text':
            return TYPES.Text
        case 'Time':
            return TYPES.Time
        case 'TinyInt':
            return TYPES.TinyInt
        case 'UDT':
            return TYPES.UDT
        case 'UniqueIdentifier':
            return TYPES.UniqueIdentifier
        case 'VarBinary':
            return TYPES.VarBinary
        case 'VarChar':
            return TYPES.VarChar
        case 'Xml':
            return TYPES.Xml
        default:
            break;
    }
}
exports.parametros = (data) => {
    let createParam = [];
    let params = data.paramsSecurity;
    if(params != undefined && params != null && params.length > 0){
        params.forEach(param => {
            createParam.push(new SpParam(param.spName, param.spParam, getType(param.type)))
        });
    }
    return parametrizacion(createParam);
};
