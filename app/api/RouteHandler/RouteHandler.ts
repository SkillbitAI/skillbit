import { PrismaClient } from "@prisma/client";
import { generateUniqueId } from "./generateId"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export default async function handler(req: Request, res: Response) {
  if (req.method === "POST") {
    //Generate test id using generate function.
    const  testID  = generateUniqueId();

    // Create new id record using prisma.
    const test = await prisma.testid.findUnique({
      where: {
        id: testID,
      },
    });

    if (test) {
      // Test ID is valid
      res.status(200).json({ status: "success", message: "Valid Test ID", testID });
    } else {
      // Test ID is not valid
      res.status(400).json({ status: "error", message: "Invalid Test ID" });
    }
    } else {
      // Handle other HTTP methods besides POST
      res.status(405).json({ status: "error", message: "Method Not Allowed" });
    }
}