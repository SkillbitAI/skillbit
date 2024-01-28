//this file will be used to store methods to help us do backend actions like adding a user

// Import Prisma to use the database query tools
import prisma from "../database/prismaConnection";

const bcrypt = require("bcrypt");

export async function addUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    // Check if a user with the provided email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return "User already exists";
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create a new user record using Prisma
    const newUser = await prisma.user.create({
      data: {
        email,
        password: encryptedPassword,
        firstName,
        lastName,
      },
    });

    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}

export async function joinCompany(email: string, companyId: string) {
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
    console.log(user);
    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
}

export async function leaveCompany(email: string, companyId: string) {
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        company: {
          disconnect: {
            id: companyId,
          },
        },
      },
    });
    console.log(user);
    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
}

export async function addCompany(email: string, companyName: string) {
  try {
    const company = await prisma.company.findFirst({
      where: {
        name: companyName,
      },
    });
    if (company) {
      return "Company already exists.";
    } else {
      const user = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          company: {
            create: {
              name: companyName,
            },
          },
        },
      });
      console.log(user);
    }
    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
}

export async function findCompanies() {
  try {
    const company = await prisma.company.findMany();
    console.log(company);
    return company;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function findCompanyById(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: id,
      },
    });
    console.log(company);
    return company;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        companyID: true,
        image: true,
        firstName: true,
        lastName: true,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

export async function userSignIn(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        return user;
      } else {
        return "Incorrect password";
      }
    } else {
      return "No user found";
    }
  } catch (error) {
    return error;
  }
}

export async function getApplicants() {
  try {
    const applicants = await prisma.applicant.findMany();
    return applicants;
  } catch (error) {
    return error;
  }
}
