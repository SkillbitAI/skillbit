//this file will be used to store methods to help us do backend actions like adding a user

// Import Prisma to use the database query tools
import prisma from "../database/prismaConnection";

const bcrypt = require("bcrypt");

export async function addUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  company: string
) {
  try {
    // Check if a user with the provided email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return "User already exists";
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Check to see if the company exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        name: company,
      },
    });

    if (existingCompany) {
      // Create a new user record using Prisma
      const newUser = await prisma.user.create({
        data: {
          email,
          password: encryptedPassword,
          firstName,
          lastName,
          companyID: existingCompany.id,
        },
      });
    } else {
      //Create a new company
      const newCompany = await prisma.company.create({
        data: {
          name: company,
        },
      });
      // Create a new user record using Prisma
      const newUser = await prisma.user.create({
        data: {
          email,
          password: encryptedPassword,
          firstName,
          lastName,
          companyID: newCompany.id,
        },
      });
    }
    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

export async function findUserById(id: string) {
  try {
    const user = await prisma.user.findFirst({
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
    const user = await prisma.user.findFirst({
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

export async function contactForm(
  firstName: string,
  lastName: string,
  email: string,
  message: string
) {
  try {
  } catch (error) {
    console.error(Error);
    return null;
  }
}
