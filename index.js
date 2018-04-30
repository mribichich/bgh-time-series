const path = require('path');
const argv = require('yargs').argv;

const configPath = path.resolve(argv.dotenvConfigPath || process.cwd(), '.env');

require('dotenv').config({ path: configPath });

try {
  require('./dist');
} catch (error) {
  console.error(error);
}
