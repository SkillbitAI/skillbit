import { NextResponse } from "next/server";
import {
  addUser,
  findUserById,
  findUserByEmail,
  userSignIn,
  getApplicants,
  findCompanyById,
  findCompanies,
  addCompany,
  leaveCompany,
  joinCompany,
} from "./actions";

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
  } else if (data.action === "joinCompany") {
    const response = await joinCompany(data.email, data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error joining company." },
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
  } else if (data.action === "findUserById") {
    const response = await findUserById(data.id);
    if (response == null) {
      return NextResponse.json(
        { message: "No user found! Please sign up." },
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
