/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

// Start the server and connect to the database (only for local/dev)
const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected To MongoDb Successfully");

    await connectRedis();
    await seedSuperAdmin();

    server = app.listen(envVars.PORT, () => {
      console.log(`🚀 Server is Running Locally On Port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("❌ Server startup error:", error);
  }
};

// Run only if not on Vercel (NODE_ENV !== "production")
if (process.env.NODE_ENV !== "production") {
  startServer();
}

// Export app for Vercel serverless function
export default app;

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("Signal Termination Happened..! Server Is Shutting Down..!");
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("SIGINT", () => {
  console.log("Signal Interrupt Happened..! Server Is Shutting Down..!");
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("unhandledRejection", () => {
  console.log("Unhandled Rejection Happened..! Server Is Shutting Down..!");
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Happened..! Server Is Shutting Down..!", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
