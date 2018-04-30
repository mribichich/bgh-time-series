import { Logger, transports, addColors, config as winstonConfig } from 'winston';

import config from './config';

const logger = new Logger({
  level: 'debug',
  transports: [
    new transports.Console({
      colorize: true,
      timestamp: true
    })
  ]
});

logger.setLevels(winstonConfig.syslog.levels);
addColors(winstonConfig.syslog.colors);

export default logger;
