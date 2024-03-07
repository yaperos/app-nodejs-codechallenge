const { Sequelize } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize('transacciones', 'postgres', 'nancy', {
    host: process.env.DB_HOST || 'localhost', // Cambiar a la dirección de tu base de datos si es remota
    dialect: 'postgres', // El dialecto para PostgreSQL
    port: 5432, // El puerto de PostgreSQL por defecto
    // Otros parámetros de configuración si son necesarios
  });

// Verificar la conexión a la base de datos
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente con la base de datos.');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

// Exportar la instancia de Sequelize para que pueda ser utilizada en otros archivos
module.exports = {
  sequelize,
  testDatabaseConnection,
};
