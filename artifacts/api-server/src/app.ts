import express, { type Express } from "express";
import cors from "cors";
import * as pinoHttpLib from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
import router from "./routes";
import { logger } from "./lib/logger";

// pino-http is a CJS module; with moduleResolution:bundler and no esModuleInterop
// the callable is exposed as .default — fall back to the namespace itself at runtime.
const pinoHttp: typeof pinoHttpLib.default =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pinoHttpLib as any).default ?? pinoHttpLib;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: unknown }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
