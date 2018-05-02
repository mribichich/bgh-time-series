interface Config {
  serviceHost: string;
  servicePort: number;

  influxDbHost: string;
  influxDbPort: number;
  influxDbDatabase: string;
  influxDbUser?: string;
  influxDbPassword?: string;

  /** Seconds */
  interval: number;

  sites: number;
  devicesPerSite: number;
  pointsPerDevice: number;
}

function defaultTo(...args) {
  let value;

  for (const arg of args) {
    value = arg || value;
  }

  return value;
}

const DEFAULT_CONFIG: Config = {
  serviceHost: '0.0.0.0',
  servicePort: 56178,

  influxDbHost: 'localhost',
  influxDbPort: 8086,
  influxDbDatabase: 'bgh_demo',
  influxDbUser: null,
  influxDbPassword: null,

  interval: 60,

  sites: 10,
  devicesPerSite: 100,
  pointsPerDevice: 5
};

let config: Config = {
  serviceHost: defaultTo(DEFAULT_CONFIG.serviceHost, process.env.SERVICE_HOST),
  servicePort: defaultTo(
    DEFAULT_CONFIG.servicePort,
    process.env.SERVICE_PORT ? parseInt(process.env.SERVICE_PORT) : null
  ),

  influxDbHost: defaultTo(DEFAULT_CONFIG.influxDbHost, process.env.INFLUXDB_HOST),
  influxDbPort: defaultTo(
    DEFAULT_CONFIG.influxDbPort,
    process.env.INFLUXDB_PORT ? parseInt(process.env.INFLUXDB_PORT) : null
  ),
  influxDbDatabase: defaultTo(DEFAULT_CONFIG.influxDbDatabase, process.env.INFLUXDB_DATABASE),
  influxDbUser: defaultTo(DEFAULT_CONFIG.influxDbUser, process.env.INFLUXDB_USER),
  influxDbPassword: defaultTo(DEFAULT_CONFIG.influxDbPassword, process.env.INFLUXDB_PASSWORD),

  interval: defaultTo(DEFAULT_CONFIG.interval, process.env.INTERVAL ? parseInt(process.env.INTERVAL) : null),

  sites: defaultTo(DEFAULT_CONFIG.sites, process.env.SITES ? parseInt(process.env.SITES) : null),
  devicesPerSite: defaultTo(
    DEFAULT_CONFIG.devicesPerSite,
    process.env.DEVICES_PER_SITE ? parseInt(process.env.DEVICES_PER_SITE) : null
  ),
  pointsPerDevice: defaultTo(
    DEFAULT_CONFIG.pointsPerDevice,
    process.env.POINTS_PER_DEVICE ? parseInt(process.env.POINTS_PER_DEVICE) : null
  )
};

export default Object.freeze(config);
