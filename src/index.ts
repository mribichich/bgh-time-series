import fs from 'fs';
import path from 'path';

import config from './config';
import logger from './logger';
import { listen } from './app';
import mainProcess from './main';
import { AxiosError } from 'axios';

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

logger.info(`Starting service v${packageJson.version} ...`);

process.on('SIGINT', function() {
  logger.info('Stopping service...');

  process.exit();
});

(async function() {
  logger.info(`Configuration: ${JSON.stringify(config)}`, { config });

  await listen(config.serviceHost, config.servicePort);

  await main();

  setInterval(async () => {
    await main();
  }, 1000 * config.interval);
})();

async function main() {
  try {
    await mainProcess({
      influxDbHost: config.influxDbHost,
      influxDbPort: config.influxDbPort,
      influxDbDatabase: config.influxDbDatabase,
      influxDbUser: config.influxDbUser,
      influxDbPassword: config.influxDbPassword,
      pointsAmount: config.pointsAmount
    });
  } catch (err) {
    logger.error(err, { error: err });
  }
}
