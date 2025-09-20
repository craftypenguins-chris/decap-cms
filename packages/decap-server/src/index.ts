// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import express from 'express';

import { registerCommonMiddlewares } from './middlewares/common';
import { registerMiddleware as registerLocalGit } from './middlewares/localGit';
import { registerMiddleware as registerLocalFs } from './middlewares/localFs';
import { createLogger } from './logger';

const app = express();
const port = Number(process.env.PORT) || 8081;
const host = process.env.HOST || '0.0.0.0';
const level = process.env.LOG_LEVEL || 'info';
const SERVER_DEBUG_VERSION = 'srv-2025-09-20-01';

(async () => {
  const logger = createLogger({ level });
  try { logger.info(`[DecapServer] version ${SERVER_DEBUG_VERSION}`); } catch (_) {}
  const options = {
    logger,
  };

  registerCommonMiddlewares(app, options);

  try {
    const mode = process.env.MODE || 'fs';
    if (mode === 'fs') {
      registerLocalFs(app, options);
    } else if (mode === 'git') {
      registerLocalGit(app, options);
    } else {
      throw new Error(`Unknown proxy mode '${mode}'`);
    }
  } catch (e) {
    logger.error(e instanceof Error ? e.message : 'Unknown error');
    process.exit(1);
  }

  return app.listen(port, host, () => {
    logger.info(`Decap CMS Proxy Server listening on ${host}:${port}`);
  });
})();
