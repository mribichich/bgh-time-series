import axios from 'axios';
import { map, range, reduce } from 'ramda';
import logger from './logger';
import { AxiosError } from 'axios';

type Options = {
  influxDbHost: string;
  influxDbPort: number;
  influxDbDatabase: string;
  influxDbUser?: string;
  influxDbPassword?: string;

  sites: number;
  devicesPerSite: number;
  pointsPerDevice: number;
};

type Point = {
  site: number;
  device: number;
  point: number;
  value: number;
};

export default async function(options: Options) {
  const { sites, devicesPerSite, pointsPerDevice } = options;

  const TOTAL_POINTS = options.sites * options.devicesPerSite * options.pointsPerDevice;

  logger.debug(`Inserting ${TOTAL_POINTS} points into influxdb...`);

  const url = `http://${options.influxDbHost}:${options.influxDbPort}/write?db=${options.influxDbDatabase}`;

  const points = getPoints(sites, devicesPerSite, pointsPerDevice);

  const data = encodePoints(points);

  try {
    await axios.post(url, data);

    logger.debug(`Points inserted`);
  } catch (err) {
    const error = err as AxiosError;

    logger.error(error.message, { err: err.toString() });
  }
}

function getPoints(sites: number, devicesPerSite: number, pointsPerDevice: number) {
  // const TOTAL_SITES = 10;
  // // const TOTAL_DEVICES = 100;
  // const TOTAL_POINTS = 5;

  // const TOTAL_DEVICES = Math.floor(amount / (TOTAL_SITES * TOTAL_POINTS));

  const siteIds = range(0, sites + 1);
  const deviceIds = range(0, devicesPerSite + 1);
  const pointIds = range(0, pointsPerDevice + 1);

  const flatten = <T>(list: T[]) => reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [], list);

  return flatten(
    map(
      site =>
        map(
          device => map(point => ({ site, device, point, value: Math.random() * (1000 - 0) + 0 }), pointIds),
          deviceIds
        ),
      siteIds
    )
  );
}

export function encodePoints(points: Point[]) {
  const MEASUREMENT = 'metrics';

  return map(m => {
    const tags = new Map([['site', m.site], ['device', m.device], ['point', m.point]]);
    return encodePoint(MEASUREMENT, tags, m.value);
  }, points).join('\n');
}

export function encodePoint(measurement: string, tags: Map<string, number | string>, value: number) {
  const tagValues = map(m => `${m}=${tags.get(m)}`, Array.from(tags.keys()));

  return `${measurement},${tagValues} value=${value}`;
}
