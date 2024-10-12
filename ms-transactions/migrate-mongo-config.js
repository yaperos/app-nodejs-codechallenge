// In this file you can configure migrate-mongo

const config = {
  mongodb: {
    url: "mongodb://localhost:27017",
    databaseName: "yape-anti-fraud",
  },
  migrationsDir: "src/database/migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".ts",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
