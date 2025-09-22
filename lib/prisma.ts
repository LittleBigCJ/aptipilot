import { PrismaClient } from "@prisma/client";

// Type-safe global cache to avoid multiple Prisma instances during dev HMR
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query"], // optional: enable for debugging
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
