// Import Prisma to use the database query tools
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
const prisma = new PrismaClient();
export default prisma;
