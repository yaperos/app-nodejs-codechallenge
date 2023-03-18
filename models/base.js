const dayjs = require('dayjs');

const schemaBase = {

    createdAt: {
        type: Date,
        default: dayjs()
    }
};

module.exports = {
    schemaBase
};