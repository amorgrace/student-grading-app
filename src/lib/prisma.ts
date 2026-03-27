import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = `${process.env.DATABASE_URL}`;
const enableQueryLogging = process.env.PRISMA_LOG_QUERIES === "true";
const slowQueryThresholdMs = Number(process.env.PRISMA_SLOW_QUERY_MS ?? 300);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: enableQueryLogging ? [{ emit: "event", level: "query" }] : [],
  });

if (enableQueryLogging) {
  prisma.$on("query", (event) => {
    if (event.duration >= slowQueryThresholdMs) {
      console.log(
        `[prisma] ${event.duration}ms ${event.query.replace(/\s+/g, " ").trim()}`,
      );
    }
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
