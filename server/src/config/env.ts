import dotenv from "dotenv";

dotenv.config();

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "5000", 10),
  MONGO_URI: required(process.env.MONGO_URI, "MONGO_URI"),
  /**
   * For demo purposes we provide a default JWT secret so that the
   * server can start even if no auth-related env has been configured.
   * Authentication is not required anywhere in the current frontend,
   * and the auth middleware has been relaxed to a no-op.
   */
  JWT_SECRET: process.env.JWT_SECRET ?? "demo-secret",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
};

