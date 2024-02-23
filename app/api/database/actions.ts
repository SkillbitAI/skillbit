//this file will be used to store methods to help us do backend actions like adding a user

// Import Prisma to use the database query tools
import { experimental_useOptimistic } from "react";
import { render } from '@react-email/render';
import logo_full_transparent_blue from "/public/assets/branding/logos/logo_full_transparent_blue.png"
import prisma from "../database/prismaConnection";
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
import "dotenv";

export async function sendMail(firstName: string, email: string, companyemail: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  const company = await prisma.user.findUnique({
    where: {
      email: companyemail,
    },
    include: {
      employee: {
        include: {
          company: true,
        },
      },
    },
  });

 const companyId = company.employee.company.name;
  
  const mailOptions = {
    from: "Skillbit <skillbitassessment@gmail.com>",
    to: email,
    subject: "Skillbit Assessment",
     attachments: [{
      filename: 'logo_full_transparent_blue.png', // Adjust the filename accordingly
      path: './public/assets/branding/logos/logo_full_transparent_blue.png',
      cid: 'logo1'
    }],
    html: `
    <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <!-- Include any necessary styles or head elements here -->
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
        <p style="font-size: 16px; line-height: 26px;color: #000000; margin: 16px 0">Hi ${firstName} !</p>
        <p style="font-size: 16px; line-height: 26px;color: #000000; margin: 16px 0">You have been selected by ${companyId} to participate in a personalized assessment. Click the link below to access your
        test dashboard.</p>
        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"
            style="text-align:center">
            <tbody>
                <tr>
                    <td><a href="example.com"
                            style="background-color:#008cff;border-radius:7px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:inline-block;margin:10px 0px 10px 0px;padding:12px 24px 12px 24px;line-height:100%;max-width:100%"
                            target="_blank"><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span
                            style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Get
                            started</span><span><!--[if mso]><i style="letter-spacing: 12px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                    </td>
                </tr>
            </tbody>
        </table>
        <p style="font-size: 16px; line-height: 26px;color: #000000; margin: 16px 0">Best, The Skillbit Team</p>
        <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
        <p style="font-size: 12px; line-height: 24px; margin: 16px 0; color: #8898aa">University of Florida</p>
    </div>
</body>

</html>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email Sent:", info.response);
  transporter.close();
}

export async function updateApplicantStatus(email: string) {
  try {
    // Find the applicant by email
    const applicant = await prisma.applicant.findUnique({
      where: {
        email: email,
      },
    });

    if (!applicant) {
      return "Applicant not found";
    }

    // Update the applicant status to "sent"
    const updatedApplicant = await prisma.applicant.update({
      where: {
        email: email,
      },
      data: {
        status: "Sent",
      },
    });

    return "Applicant status updated successfully";
  } catch (error) {
    console.error("Error updating applicant status:", error);
    throw error;
  }
}


export async function addApplicant(
  firstName: string,
  lastName: string,
  email: string,
  recruiterEmail: string
) {
  try {
    console.log(firstName);
    
    //Check if a user with the provided email already exists
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

   const companyId = company.employee.companyID;

    //Create a new user record using Prisma
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
