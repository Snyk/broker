const logger = require('../log');
const socket = require('./socket');
const relay = require('../relay');
const version = require('../version');
const promBundle = require('express-prom-bundle');

module.exports = ({ config = {}, port = null, filters = {} }) => {
  logger.info({ version }, 'running in server mode');

  // start the local webserver to listen for relay requests
  const { app, server } = require('../webserver')(config, port);

  // bind the socket server to the web server
  const { io, connections } = socket({
    server,
    filters: filters.private,
    config,
  });

  // basic prometheus metrics
  const metricsMiddleware = promBundle({
    buckets: [0.1, 0.4, 0.7, 1, 1.5, 2, 2.5, 5, 10, 30],
    includeMethod: true,
    includePath: false,
    metricsPath: '/metrics',
    promClient: {
      collectDefaultMetrics: {
        timeout: 3000,
      },
    },
  });

  app.use(metricsMiddleware);

  app.get('/connection-status/:token', (req, res) => {
    const token = req.params.token;
    const maskedToken = token.slice(0, 4) + '-...-' + token.slice(-4);

    if (connections.has(token)) {
      const clientsMetadata = connections.get(token).map((conn) => ({
        version: conn.metadata && conn.metadata.version,
        filters: conn.metadata && conn.metadata.filters,
      }));
      return res.status(200).json({ ok: true, clients: clientsMetadata });
    }
    logger.warn({ maskedToken }, 'no matching connection found');
    return res.status(404).json({ ok: false });
  });

  app.all(
    '/broker/:token/*',
    (req, res, next) => {
      const token = req.params.token;
      const maskedToken = token.slice(0, 4) + '-...-' + token.slice(-4);

      // check if we have this broker in the connections
      if (!connections.has(token)) {
        logger.warn({ maskedToken }, 'no matching connection found');
        return res.status(404).json({ ok: false });
      }

      // Grab a first (newest) client from the pool
      res.locals.io = connections.get(token)[0].socket;

      // strip the leading url
      req.url = req.url.slice(`/broker/${token}`.length);
      logger.debug({ url: req.url }, 'request');

      next();
    },
    relay.request(filters.public),
  );

  app.get('/healthcheck', (req, res) =>
    res.status(200).json({ ok: true, version }),
  );

  return {
    io,
    close: (done) => {
      logger.info('server websocket is closing');
      server.close();
      io.destroy(function () {
        logger.info('server websocket is closed');
        if (done) {
          return done();
        }
      });
    },
  };
};
