import prisma from "../../database/prismaConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const testID = body.testID;

  if (!testID) {
    return Response.json({
      testID,
    });
  }

  const test = await prisma.testID.findUnique({
    where: {
      uid: testID,
    },
  });

  if (test) {
    return Response.json({
      valid: "valid",
    });
  } else {
    return Response.json({
      invalid: "invalid",
    });
  }
}
