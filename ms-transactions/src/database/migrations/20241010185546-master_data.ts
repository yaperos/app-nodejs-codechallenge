module.exports = {
  async up(db, _client) {

    await db.collection('transactionstatuses').insertMany([
      { code: 'PENDING', name: "Pending" },
      { code: 'APPROVED', name: "Approved" },
      { code: 'REJECTED', name: "Rejected" },
    ]);

    await db.collection('transactiontypes').insertMany([
      { code: 1, name: "Transaferencia Bancaria" },
      { code: 2, name: "Pago de Cuentas" },
    ]);

  },

  async down(db, _client) {
    
  }
};
