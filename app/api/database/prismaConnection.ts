import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// // Import Prisma to use the database query tools
// import { PrismaClient } from "@prisma/client";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// const prisma = new PrismaClient();
// export default prisma;
