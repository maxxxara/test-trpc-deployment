import express, { Application, NextFunction, Request, Response } from 'express'

import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import cors from "cors";
import path from 'path';

const app: Application = express();
app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../../packages/client/dist')));

// The "catch all" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../packages/client/dist/index.html'));
});

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});
