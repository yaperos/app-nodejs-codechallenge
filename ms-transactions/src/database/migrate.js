require('ts-node/register');

require('./dbConfig').migrator.runAsCLI();
