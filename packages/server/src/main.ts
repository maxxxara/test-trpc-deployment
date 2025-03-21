import express, { Application } from 'express'
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import cors from "cors";

const app: Application = express();

// Configure CORS - allow requests from any origin in this example
app.use(cors({
  origin: '*'
}));

// Set up tRPC middleware
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT: number = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on Port: ${PORT}`);
});
