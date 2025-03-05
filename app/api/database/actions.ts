//this file will be used to store methods to help us do backend actions like adding a user

// Import Prisma to use the database query tools
import { experimental_useOptimistic } from "react";
import prisma from "../database/prismaConnection";
import { Resend } from "resend";
const bcrypt = require("bcrypt");
import path from "path";
import "dotenv";
import App from "next/app";
import { render } from "@react-email/render";
import logo_full_transparent_blue from "/assets/branding/logos/logo_full_transparent_blue.png";
import { Question } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://skillbit.org"
    : "http://localhost:3000";

export async function addApplicant(
  firstName: string,
  lastName: string,
  email: string,
  recruiterEmail: string
) {
  try {
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
      // Create a new test id record (INSTEAD OF APPLICANT)
      const newApplicant = await prisma.testID.create({
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          company: {
            connect: {
              id: companyId,
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

interface Applicant {
  firstName: string;
  lastName: string;
  email: string;
}

export async function addApplicants(
  applicants: Array<Applicant>,
  recruiterEmail: string
) {
  try {
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
      // Create a new test id record (INSTEAD OF APPLICANT)
      applicants.map(async (applicant) => {
        const newApplicant = await prisma.testID.create({
          data: {
            email: applicant.email,
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            company: {
              connect: {
                id: companyId,
              },
            },
          },
        });
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

export async function updateUser(
  oldEmail: string,
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

    //CUERRENTLY HAVE NOT IMPLEMENTED CHANGE PASSWORD OR CHANGE EMAIL

    // Hash the password
    // const encryptedPassword = await bcrypt.hash(password, 10);

    // Create a new user record using Prisma
    const updatedUser = await prisma.user.update({
      where: {
        email: oldEmail,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
      },
    });
    return "Success";
  } catch (error) {
    console.error("Error updating data:", error);
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

export async function updateQuestion(
  id: string,
  title: string,
  prompt: string,
  candidatePrompt: string,
) {
  try {
    const questions = await prisma.question.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        prompt: prompt,
        candidatePrompt: candidatePrompt,
      },
    });
    return "Success";
  } catch (error) {
    console.error("Error deleting question:", error);
    return null;
  }
}

export async function deleteQuestion(id: string) {
  try {
    const questions = await prisma.question.delete({
      where: {
        id: id,
      },
    });
    return "Success";
  } catch (error) {
    console.error("Error deleting question:", error);
    return null;
  }
}

export async function deleteApplicants(applicantData: Array<TestIDInterface>) {
  try {
    let count = 0;
    const promises = applicantData.map(async (applicant) => {
      if (applicant.selected) {
        count++;
        const applicants = await prisma.testID.delete({
          where: {
            id: applicant.id,
          },
        });
      }
    });

    await Promise.all(promises);

    if (count == 0) {
      return "No candidates selected.";
    } else {
      return "Success";
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    return null;
  }
}

export async function addQuestion(
  email: string,
  title: string,
  language: string,
  framework: string,
  prompt: string,
  type: string,
  expiration: string
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
                prompt: prompt,
                type: type,
                expiration: expiration,
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
                join_code: companyId,
              },
            },
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
      //creating new join code
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      const codeLength = 6;
      let randomCode = "";
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomCode += characters.charAt(randomIndex);
      }

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
                  join_code: randomCode,
                },
              },
              isApproved: true,
            },
          },
        },
      });
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
                join_code: true,
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

export async function getApplicants(company: string) {
  try {
    const applicants = await prisma.testID.findMany({
      where: {
        company: {
          id: company,
        },
      },
      include: {
        template: true,
      },
    });
    return applicants;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getIsSubmitted(id: string) {
  try {
    const applicants = await prisma.testID.findUnique({
      where: {
        id: id,
      },
      select: {
        submitted: true,
      },
    });
    return applicants;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getIsExpired(id: string) {
  try {
    const expirationDateResult = await prisma.testID.findUnique({
      where: {
        id: id,
      },
      select: {
        expirationDate: true,
      },
    });
    const expirationDate = expirationDateResult?.expirationDate;
    return expirationDate && new Date(expirationDate) < new Date();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function markSubmitted(id: string) {
  try {
    await prisma.testID.update({
      where: {
        id: id,
      },
      data: {
        submitted: true,
        status: "Submitted",
      },
    });
    return "Success";
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface TestIDInterface {
  companyID: string;
  id: string;
  selected: boolean;
  created: Date;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  score: string;
  submitted: boolean;
  template: Question;
  expirationDate: Date;
}

export async function assignTemplate(
  applicantData: Array<TestIDInterface>,
  templateID: string,
  company: string
) {
  try {
    const template = await prisma.question.findUnique({
      where: {
        id: templateID,
      },
    });

    const expiration = new Date();

    switch (template?.expiration) {
      case "1 day":
        expiration.setDate(expiration.getDate() + 1);
        break;
      case "1 week":
        expiration.setDate(expiration.getDate() + 7);
        break;
      case "2 weeks":
        expiration.setDate(expiration.getDate() + 14);
        break;
      case "1 month":
        expiration.setMonth(expiration.getMonth() + 1);
        break;
      case "2 months":
        expiration.setMonth(expiration.getMonth() + 2);
        break;
      default:
        return null;
    }

    let count = 0;
    const promises = applicantData.map(async (applicant) => {
      if (applicant.selected) {
        count++;
        await prisma.testID.update({
          where: {
            id: applicant.id,
          },
          data: {
            template: {
              connect: {
                id: templateID,
              },
            },
            expirationDate: expiration,
          },
        });
        try {
          const emailHtml = `
            <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                <style>
                  body {
                    text-align: center;
                    background-color: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                  }
                  .content {
                    max-width: 600px;
                    margin: 0 auto;
                  }
                </style>
              </head>
              <body>
                <div class="content" style="margin: 12px auto; font-family: sans-serif;">
                  <img alt="SkillBit" height="100" src="cid:logo1" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" />
                  <p style="font-size: 16px; line-height: 26px; color: #000000; margin: 16px 0">Hi ${
                    applicant.firstName
                  }!</p>
                  <p style="font-size: 16px; line-height: 26px; color: #000000; margin: 16px 0">
                    You have been selected by ${company} to participate in a personalized assessment. Click the link below to access your test dashboard.
                  </p>
                  <p style="font-size: 16px; line-height: 26px; color: #000000; margin: 16px 0">
                    **Please note:** This assessment will expire on ${expiration.toLocaleDateString()}.
                  </p>
                  <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center">
                    <tbody>
                      <tr>
                        <td>
                          <a href="${baseUrl}/prescreen/${applicant.id}"
                             style="background-color:#008cff; border-radius:7px; color:#fff; font-size:16px; text-decoration:none; text-align:center; display:inline-block; margin:10px 0px; padding:12px 24px; line-height:100%; max-width:100%"
                             target="_blank">
                            <span style="max-width:100%; display:inline-block; line-height:120%; mso-padding-alt:0px; mso-text-raise:9px">Get started</span>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p style="font-size: 16px; line-height: 26px; color: #000000; margin: 16px 0">Best, The Skillbit Team</p>
                  <hr style="width:100%; border:none; border-top:1px solid #eaeaea; border-color:#cccccc; margin:20px 0" />
                  <p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #8898aa">University of Florida</p>
                </div>
              </body>
            </html>
          `;

          const data = await resend.emails.send({
            from: "Skillbit <hello@skillbit.org>",
            to: applicant.email,
            subject: "Skillbit Assessment",
            html: emailHtml,
          });

          console.log("Email sent:", data);

          await prisma.testID.update({
            where: {
              id: applicant.id,
            },
            data: {
              status: "Sent",
            },
          });
        } catch (error) {
          console.error("Error sending test:", error);
          return null;
        }
      }
    });
    await Promise.all(promises);

    if (count == 0) {
      return "No candidates selected.";
    } else {
      return "Success";
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function contactForm(
  firstName: string,
  lastName: string,
  email: string,
  message: string
) {
  try {
    const emailHtml = `
      <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <style>
          body {
              text-align: center;
              background-color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          }
          .content {
              max-width: 600px;
              margin: 0 auto;
          }
      </style>
      </head>
      <body>
          <div class="content" style="margin: 12px auto; font-family: sans-serif;">
          <img alt="SkillBit" height="100" src="cid:logo1" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"  />
              <p style="font-size: 16px; line-height: 26px;color: #000000; margin: 16px 0">You have a new contact form submission!</p>
              <p style="font-size: 16px; line-height: 26px;color: #000000; margin: 16px 0">
              First name: ${firstName}<br/>
              Last name: ${lastName}<br/>
              Email: ${email}<br/>
              Message: ${message}
              </p>
              <p style="font-size: 16px; line-height: 26px;color: #000000; margin: 16px 0">Best, The Skillbit Server</p>
              <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
              <p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #8898aa">University of Florida</p>
          </div>
      </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: "Skillbit <hello@skillbit.org>",
      to: "skillbitassessment@gmail.com",
      subject: "Skillbit Contact Form Submission",
      html: emailHtml,
    });

    console.log("Email sent:", data);
    return "Success";
  } catch (error) {
    console.error(Error);
    return null;
  }
}

export async function getTestById(id: string) {
  try {
    const test = await prisma.testID.findUnique({
      where: {
        id: id,
      },
      include: {
        template: true,
        company: true,
      },
    });
    return test;
  } catch (error) {
    console.error("Error fetching test by ID:", error);
    throw error;
  }
}

export async function startTest(testId: string) {
  try {
    const now = new Date();
    const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 60 minutes
    console.log("Start Time:", now);
    console.log("Calculated End Time:", endTime);
    const test = await prisma.testID.update({
      where: { id: testId },
      data: {
        startTime: now,
        endTime: endTime,
      },
    });
    return test;
  } catch (error) {
    console.error("Error starting test:", error);
    throw error;
  }
}
