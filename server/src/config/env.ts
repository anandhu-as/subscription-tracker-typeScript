import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_URI = process.env.DB_URI;

const rawJwtSecret = process.env.JWT_SECRET;
const rawJwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!rawJwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

if (!rawJwtExpiresIn) {
  throw new Error("JWT_EXPIRES_IN is not defined");
}

export const JWT_SECRET: string = rawJwtSecret;
export const JWT_EXPIRES_IN: string = rawJwtExpiresIn; 