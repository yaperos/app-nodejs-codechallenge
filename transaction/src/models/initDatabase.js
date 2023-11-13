const { sequelize } = require('./index');


const initDatabase = async () => {
  try {
    await sequelize.sync({force: true});
    console.log('Tablas creadas con éxito');
  } catch (error) {
    console.error('Error al crear tablas:', error);
  }
};

module.exports = initDatabase;
