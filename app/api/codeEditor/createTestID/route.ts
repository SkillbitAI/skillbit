import { PrismaClient } from "@prisma/client";
import { generateUniqueId } from "./generateId";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  //Generate test id using generate function.
  const testID = generateUniqueId();

  // Create new id record using prisma
  const test = await prisma.testID.create({
    data: {
      uid: testID,
    },
  });

  if (test) {
    // Test ID is valid
    return Response.json({
      testID,
    });
  }
}
