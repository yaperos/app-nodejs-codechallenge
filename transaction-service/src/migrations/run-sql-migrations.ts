// Script para ejecutar migraciones SQL al iniciar el servicio
import { AppDataSource } from '../config/data-source';
import * as fs from 'fs';
import * as path from 'path';

async function runSqlFile(filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf-8');
  await AppDataSource.query(sql);
}

async function main() {
  try {
    await AppDataSource.initialize();
    const migrationsDir = path.join(__dirname);
    const files = [
      '001_create_tables.sql',
      '002_seed_catalogs.sql'
    ];
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Ejecutando: ${file}`);
      await runSqlFile(filePath);
    }
    await AppDataSource.destroy();
    console.log('Migraciones SQL ejecutadas correctamente.');
  } catch (error) {
    console.error('Error ejecutando migraciones SQL:', error);
    process.exit(1);
  }
}

main();
