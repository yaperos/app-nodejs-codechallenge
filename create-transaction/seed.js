const { Pool } = require('pg');

const dataTransfer = [
  {
      id:"clnl1tgew000fdo7e1m4hexm1",
      name:"Transferencia Bancaria"
  },
  {
      id:"clnl1tgew000gdo7eei7yungt",
      name:"Transferencia Electrónica"
  },
  {
      id:"clnl1tgew000ido7ekdsthd5r",
      name:"Transferencia Interna"
  }
]

// Configuración de la conexión a la base de datos
const pool = new Pool({
    host: "aws-0-us-east-1.pooler.supabase.com",
    user: "postgres.gcgiowqadhayysmzgoai",
    database: "postgres",
    password:"Luis95112308084",
    port:5432
  });

// Consulta SQL para crear una tabla
const CreateTypeTransfer = `
  CREATE TABLE IF NOT EXISTS TypeTransfer (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50)  NOT NULL
  )
`;
const createTableInfoTransaction = `
  CREATE TABLE IF NOT EXISTS InfoTransaction (
    id VARCHAR(50) PRIMARY KEY,
    accountDebit VARCHAR(50)  NOT NULL,
    accountCredit VARCHAR(50)  NOT NULL,
    value  VARCHAR(6)  NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDIENTE',
    idTypeTransfer VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createValidateTransaction = `
  CREATE TABLE IF NOT EXISTS ValidateTransaction (
    id VARCHAR(50) PRIMARY KEY,
    idTransaction VARCHAR(50) NOT NULL,
    typeTransaction VARCHAR(50) NOT NULL DEFAULT 'TRANSFERENCIA',
    value  VARCHAR(6)  NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idTransaction) REFERENCES InfoTransaction(id)
  )
`;

// Función para ejecutar la consulta de creación de tabla
async function createTable() {
  try {
    const client = await pool.connect();
    await client.query(CreateTypeTransfer);
    await client.query(createTableInfoTransaction);
    await client.query(createValidateTransaction);
    dataTransfer.map(async(data)=>{
      await pool.query( `
      INSERT INTO TypeTransfer (id, name) VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name
      `,
      [data.id, data.name])
    })
    console.log('Tablas creadas exitosamente');
    client.release();
  } catch (error) {
    console.error('Error al crear la tabla:', error);
  } finally {
    pool.end(); // Cerrar la conexión cuando haya terminado
  }
}

createTable();