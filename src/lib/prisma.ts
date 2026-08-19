import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development.
// Hot Module Replacement (HMR) reloads files on save, which would otherwise 
// exhaust database connections by spawning a new client every time.
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
};