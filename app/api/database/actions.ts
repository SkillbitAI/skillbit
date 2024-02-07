//this file will be used to store methods to help us do backend actions like adding a user

// Import Prisma to use the database query tools
import { experimental_useOptimistic } from "react";
import prisma from "../database/prismaConnection";
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
import "dotenv";

export async function sendMail(firstName: string, email: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Skillbit <skillbitassessment@gmail.com>",
    to: email,
    subject: "Skillbit Assessment",
    text: `Hi ${firstName},
    Hello world!`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email Sent:", info.response);
  transporter.close();
}

export async function addApplicant(
  firstName: string,
  lastName: string,
  email: string,
  recruiterEmail: string
) {
  try {
    console.log(recruiterEmail);
    // Check if a user with the provided email already exists
    const existingUser = await prisma.applicant.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return "Applicant already exists";
    }

    //finding company id from recruiter email
    const company = await prisma.user.findUnique({
      where: {
        email: recruiterEmail,
      },
      include: {
        employee: {
          include: {
            company: true,
          },
        },
      },
    });

    if (company && company.employee) {
      const companyId = company.employee.companyID;
      // Create a new user record using Prisma
      const newApplicant = await prisma.applicant.create({
        data: {
          email,
          firstName,
          lastName,
          testId: {
            create: {
              company: {
                connect: {
                  id: companyId,
                },
              },
            },
          },
        },
      });
      return "Success";
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}

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

export async function findQuestions(companyId: string) {
  try {
    const questions = await prisma.question.findMany({
      where: {
        company: {
          id: companyId,
        },
      },
    });
    return questions;
  } catch (error) {
    console.error("Error finding questions:", error);
    return null;
  }
}

export async function addQuestion(
  email: string,
  title: string,
  language: string,
  framework: string,
  type: string
) {
  try {
    //getting user company
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        questions: true,
        employee: {
          include: {
            company: true,
          },
        },
      },
    });

    if (user?.employee?.companyID) {
      const questionTitle = await prisma.question.findFirst({
        where: {
          user: {
            email: email,
          },
          title: title,
        },
      });
      if (questionTitle && questionTitle?.title == title) {
        return "Title already exists. Please choose a unique question title.";
      } else {
        const question = await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            questions: {
              create: {
                company: {
                  connect: {
                    id: user?.employee?.companyID,
                  },
                },
                title: title,
                language: language,
                framework: framework,
                type: type,
              },
            },
          },
        });
      }
    } else {
      return null;
    }
    return "Success";
  } catch (error) {
    console.error("Error finding employees:", error);
    return null;
  }
}

export async function findEmployees(companyId: string) {
  try {
    const employees = await prisma.user.findMany({
      where: {
        employee: {
          company: {
            id: companyId,
          },
          isApproved: true,
        },
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    return employees;
  } catch (error) {
    console.error("Error finding employees:", error);
    return null;
  }
}

export async function findRecruiterRequests(companyId: string) {
  try {
    const employees = await prisma.user.findMany({
      where: {
        employee: {
          company: {
            id: companyId,
          },
          isApproved: false,
        },
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    return employees;
  } catch (error) {
    console.error("Error finding recruiter requests:", error);
    return null;
  }
}

export async function approveRecruitrer(email: string, companyId: string) {
  try {
    console.log(companyId);
    const user = await prisma.user.update({
      where: {
        email: email,
        employee: {
          company: {
            id: companyId,
          },
        },
      },
      data: {
        employee: {
          update: {
            isApproved: true,
          },
        },
      },
    });
    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
}

export async function denyRecruiter(email: string, companyId: string) {
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
        employee: {
          company: {
            id: companyId,
          },
        },
      },
      data: {
        employee: {
          delete: true,
        },
      },
    });
    return "Success";
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
}

export async function joinCompany(email: string, companyId: string) {
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        employee: {
          create: {
            company: {
              connect: {
                id: companyId,
              },
            },
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
        employee: {
          company: {
            id: companyId,
          },
        },
      },
      data: {
        employee: {
          delete: true,
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

export async function leaveAndDeleteCompany(email: string, companyId: string) {
  try {
    const user = await prisma.company.delete({
      where: {
        id: companyId,
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
          employee: {
            create: {
              company: {
                create: {
                  name: companyName,
                },
              },
              isApproved: true,
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
        image: true,
        firstName: true,
        lastName: true,
        employee: {
          select: {
            isApproved: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
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
