import { env } from '../config/env.js';

export const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

export const errorHandler = (err, _req, res, _next) => {
  console.error('❌', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status >= 500 && env.isProd ? 'Internal server error' : (err.message || 'Internal server error'),
    ...(env.isProd ? {} : { stack: err.stack }),
  });
};
