import { NextResponse } from "next/server";

import {
  addUser,
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
  findQuestions,
  deleteQuestion,
  updateQuestion,
  addApplicants,
  updateUser,
  assignTemplate,
  deleteApplicants,
  contactForm,
  markSubmitted,
  getIsSubmitted,
  getIsExpired,
  getTestById,
  startTest,
  getInstructions,
  assignSampleTemplate,
  getIsSample,
  createJobRecord,
  getCompanyJobsForCompany,
  deleteJobRecord
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
  } else if (data.action === "updateUser") {
    const response = await updateUser(
      data.oldEmail,
      data.email,
      data.password,
      data.firstName,
      data.lastName
    );
    if (response == "User already exists") {
      return NextResponse.json(
        { message: "User already exists!" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Update successful." },
      { status: 200 }
    );
  } else if (data.action === "addApplicant") {
    const response = await addApplicant(
      data.firstName,
      data.lastName,
      data.email,
      data.recruiterEmail,
      data.isSample,
      data.jobId // <--- NEW
    );
    if (response == null) {
      return NextResponse.json(
        { message: "Error adding applicant." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "addApplicants") {
    const response = await addApplicants(
      data.applicants,
      data.recruiterEmail,
      data.isSample
    );
    if (response == null) {
      return NextResponse.json(
        { message: "Error adding applicants." },
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
      data.prompt,
      data.type,
      data.expiration,
      data.jobId  // pass the jobId from the front end
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
  } else if (data.action === "updateQuestion") {
    const response = await updateQuestion(data.id, data.title, data.prompt);
    if (response == null) {
      return NextResponse.json(
        { message: "Error updating question." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "deleteQuestion") {
    const response = await deleteQuestion(data.id);
    if (response == null) {
      return NextResponse.json(
        { message: "Error deleting question." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }

  // NEW JOB-RELATED ACTIONS (Refactored)
  else if (data.action === "createJob") {
    const { companyId, name } = data;
    const newJob = await createJobRecord(companyId, name);
    if (!newJob) {
      return NextResponse.json(
        { message: "Error creating job." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: "Success", job: newJob }, { status: 200 });
  } else if (data.action === "getCompanyJobs") {
    const { companyId } = data;
    const jobs = await getCompanyJobsForCompany(companyId);
    if (!jobs) {
      return NextResponse.json(
        { message: "Error retrieving jobs." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: jobs }, { status: 200 });
  }

  else if (data.action === "findQuestions") {
    const response = await findQuestions(data.company);
    if (response == null) {
      return NextResponse.json(
        { message: "Error finding questions." },
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
  } else if (data.action === "deleteJob") {
    const { jobId, companyId } = data;
    const response = await deleteJobRecord(jobId, companyId);
    if (response == null) {
      return NextResponse.json(
        { message: "Error deleting job." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  }
  else if (data.action === "findCompanies") {
    const response = await findCompanies();
    if (response == null) {
      return NextResponse.json(
        { message: "Error finding companies." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "markSubmitted") {
    console.log(data.id);
    const response = await markSubmitted(data.id);
    if (response == null) {
      return NextResponse.json(
        { message: "Error marking testID as submitted." },
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
  } else if (data.action === "getInstructions") {
    const response = await getInstructions(data.id);
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "getIsSample") {
    const response = await getIsSample(data.id);
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "getApplicants") {
    const response = await getApplicants(data.company, data.isSample);
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "getIsSubmitted") {
    const response = await getIsSubmitted(data.id);
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "getIsExpired") {
    const response = await getIsExpired(data.id);
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "assignTemplate") {
    const response = await assignTemplate(
      data.applicantData,
      data.template,
      data.company,
      data.jobId  // <-- NEW: Pass jobId to actions
    );
    if (response == null) {
      return NextResponse.json(
        { message: "Error assigning templates." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "assignSampleTemplate") {
    const response = await assignSampleTemplate(
      data.applicantData,
      data.template
    );
    if (response == null) {
      return NextResponse.json(
        { message: "Error assigning templates." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "deleteApplicants") {
    const response = await deleteApplicants(data.applicantData);
    if (response == null) {
      return NextResponse.json(
        { message: "Error deleting applicants." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "contactForm") {
    const response = await contactForm(
      data.firstName,
      data.lastName,
      data.email,
      data.message
    );
    if (response == null) {
      return NextResponse.json(
        { message: "Error submitting contact form." },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "getTestById") {
    const response = await getTestById(data.id);
    if (response == null) {
      return NextResponse.json({ message: null }, { status: 400 });
    }
    return NextResponse.json({ message: response }, { status: 200 });
  } else if (data.action === "startTest") {
    const startResponse = await startTest(data.testId);
    if (startResponse == null) {
      return NextResponse.json({ message: null }, { status: 400 });
    }
    return NextResponse.json({ message: startResponse }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Not a valid action." },
      { status: 500 }
    );
  }
}
