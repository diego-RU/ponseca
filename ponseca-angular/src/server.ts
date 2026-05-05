import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Static assets shipped by the Angular build (favicon, fonts, images, ...)
 * are served straight from the browser dist folder.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Hand every other request to Angular SSR — the server router decides
 * whether the response comes from a prerendered file or from a live
 * server-side render.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the Node server when this file is the entry point.
 * Useful for `node dist/<project>/server/server.mjs` style deployments.
 */
if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] ?? 4000);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Recreo Ponceca SSR escuchando en http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
