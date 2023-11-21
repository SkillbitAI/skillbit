import prisma from "../../database/prismaConnection";
import { generateUniqueId } from "./generateId";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { applicants } = body;

  // console.log(applicants);

  //Generate test id using generate function.
  for (let i = 0; i < applicants.length; i++) {
    //applicant data
    const firstName = applicants[i].firstName;
    const lastName = applicants[i].lastName;
    const email = applicants[i].email;

    const testID = generateUniqueId();
    const result = await insertApplicantWithTestID(
      firstName,
      lastName,
      email,
      testID
    );
    if (result == null) {
      return NextResponse.json(
        { message: "Error inserting applicant details" },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ message: "Success" }, { status: 200 });
}

// Function to insert applicant details and assign a test ID
async function insertApplicantWithTestID(
  firstName: string,
  lastName: string,
  email: string,
  testID: string
) {
  try {
    //preset applicant data
    const status = "Sent";
    const score = "90%";

    // Step 1: Create a new applicant if not exists
    const newOrExistingApplicant = await prisma.applicant.upsert({
      where: {
        email: email,
      },
      update: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        status: status,
        score: score,
      },
      create: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        status: status,
        score: score,
      },
    });

    // Step 2: Create a new test ID
    const newTestID = await prisma.testID.create({
      data: {
        uid: testID,
        applicantID: newOrExistingApplicant.id,
      },
    });

    // Step 3: Associate the test ID with the applicant
    await prisma.applicant.update({
      where: { id: newOrExistingApplicant.id },
      data: {
        testIDs: {
          connect: [{ uid: newTestID.uid }],
        },
      },
    });
    console.log("Applicant details inserted successfully.");
    return testID;
  } catch (error) {
    console.error("Error inserting applicant details:", error);
    return null;
  }
}
