import express from 'express';
import client from 'prom-client';

import logger from './logger';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const app = express();

app.get('/metrics', (req, res) => {
  res.send(client.register.metrics());
});

export function listen(host: string, port: number) {
  return new Promise<void>((resolve, reject) => {
    app
      .listen(port, host, () => {
        logger.info(`Server listening on port ${port}`);

        resolve();
      })
      .on('error', err => reject(err));
  });
}

export default app;
