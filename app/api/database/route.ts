import { NextResponse } from "next/server";
import {
  addUser,
  sendMail,
  findUserByEmail,
  userSignIn,
  getApplicants,
  findCompanyById,
  findCompanies,
  addCompany,
  leaveCompany,
  joinCompany,
  approveRecruitrer,
  denyRecruiter,
  findRecruiterRequests,
  findEmployees,
  leaveAndDeleteCompany,
  addApplicant,
  addQuestion,
} from "./actions";
import { send } from "process";

export async function POST(req: Request) {
  const data = await req.json();

  if (data.action === "addUser") {
    const response = await addUser(
      data.email,
      data.password,
      data.firstName,
      data.lastName
    );
    if (response == "User already exists") {
      return NextResponse.json(
        { message: "User already exists! Please sign in." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Registration successful." },
      { status: 200 }
    );
  } else if (data.action === "addApplicant") {
    const response = await addApplicant(
      data.firstName,
      data.lastName,
      data.email,
      data.recruiterEmail
    );
    if (response == null) {
      return NextResponse.json(
        { message: "Error adding applicant." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "addQuestion") {
    const response = await addQuestion(
      data.email,
      data.title,
      data.language,
      data.framework,
      data.type
    );
    if (
      response == "Title already exists. Please choose a unique question title."
    ) {
      return NextResponse.json(
        {
          message:
            "Title already exists. Please choose a unique question title.",
        },
        { status: 400 }
      );
    }
    if (response == null) {
      return NextResponse.json(
        { message: "Error adding question." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "sendMail") {
    const response = await sendMail(data.firstName, data.email);
    if (response == null) {
      return NextResponse.json(
        { message: "Error sending mail." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "findEmployees") {
    const response = await findEmployees(data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error finding employees." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "findRecruiterRequests") {
    const response = await findRecruiterRequests(data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error finding recruiter requests." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "denyRecruiter") {
    const response = await denyRecruiter(data.email, data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error denying recruiter." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "approveRecruiter") {
    const response = await approveRecruitrer(data.email, data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error approving recruiter." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "joinCompany") {
    const response = await joinCompany(data.email, data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error joining company." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "leaveAndDeleteCompany") {
    const response = await leaveAndDeleteCompany(data.email, data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error leaving company." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "leaveCompany") {
    const response = await leaveCompany(data.email, data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error leaving company." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "addCompany") {
    const response = await addCompany(data.email, data.company);
    if (response == "Company already exists.") {
      return NextResponse.json(
        { message: "Error adding company." },
        { status: 400 }
      );
    }
    if (response == null) {
      return NextResponse.json(
        { message: "Error adding company." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "findCompanies") {
    const response = await findCompanies();
    if (response == null) {
      return NextResponse.json(
        { message: "Error finding companies." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "findCompanyById") {
    const response = await findCompanyById(data.id);
    if (response == null) {
      return NextResponse.json(
        { message: "No company found! Please create one." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "findUserByEmail") {
    const response = await findUserByEmail(data.email);
    if (response == null) {
      return NextResponse.json(
        { message: "No user found! Please sign up." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "userSignIn") {
    const response = await userSignIn(data.email, data.password);
    if (response == "No user found") {
      return NextResponse.json(
        { message: "No user found! Please sign up." },
        { status: 400 }
      );
    } else if (response == "Incorrect password") {
      return NextResponse.json(
        { message: "Incorrect password." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "getApplicants") {
    const response = await getApplicants();
    return NextResponse.json({ message: response }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Not a valid action." },
      { status: 500 }
    );
  }
}
