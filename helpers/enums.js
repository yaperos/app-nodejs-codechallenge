var Enum = require('enum');

const transactionType = new Enum({
    'Type A': 1,
    'Type B': 2,
    'Type C': 3,
    'Type D': 4,
    'Type E': 5
});

const transactionStatus = new Enum({
    'Pending': 1,
    'Approved': 2,
    'Rejected': 3
});

module.exports = {
    transactionType,
    transactionStatus
}