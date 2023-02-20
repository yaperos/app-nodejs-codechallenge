const STATUS_TRANSACTION = {
    PENDING: 1,
    APPROVED: 2, 
    REJECTED: 3, 
};

const STATUS_ID_TRANSACTION = {
   1: 'pending',
   2: 'approved' ,
   3: 'reject'  
};

const TYPE_TRANSACTION = {
    SEND: 'SEND PAYMENT',
    REQUEST: 'REQUEST PAYMENT',  
};
const VALUE_VALID = {
     VALUE : 1000
}

module.exports = {
    STATUS_TRANSACTION,
    TYPE_TRANSACTION,
    VALUE_VALID,
    STATUS_ID_TRANSACTION
};
