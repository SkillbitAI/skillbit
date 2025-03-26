"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/loader/loader";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Sidebar from "@/components/sidebar/sidebar";
import { signOut, useSession } from "next-auth/react";
import TopMenuBar from "@/components/topmenubar/topmenubar";
import Plus from "../../public/assets/icons/plus.svg";
import Check from "../../public/assets/icons/check.svg";
import Cancel from "../../public/assets/icons/cancel.svg";

// dashboard icons
import DashboardIcon from "../../public/assets/icons/dashboard.svg";
import DashboardIconWhite from "../../public/assets/icons/dashboard_white.svg";
import ApplicantsIcon from "../../public/assets/icons/applicants.svg";
import CompanyIcon from "../../public/assets/icons/company.svg";
import SupportIcon from "../../public/assets/icons/support.svg";
import WorkshopIcon from "../../public/assets/icons/workshop.svg";
import ProfileIcon from "../../public/assets/icons/profile.svg";
import QuestionIcon from "../../public/assets/icons/question.svg";
import SearchIcon from "../../public/assets/icons/search.svg";
import { Toaster, toast } from "react-hot-toast";

interface Company {
  id: string;
  name: string;
}

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
}

interface Job {
  id: string;
  name: string;
}

const CompanyProfile = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [userCompanyName, setUserCompanyName] = useState<string | null>(null);
  const [userCompanyJoinCode, setUserCompanyJoinCode] = useState<string | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [joinCompany, setJoinCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [newCompanyButton, setNewCompanyButton] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);
  const [recruiterRequests, setRecruiterRequests] = useState<Employee[]>([]);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // --- JOB STATES ---
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJobName, setNewJobNameState] = useState("");
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // NEW: Delete Job Modal States
  const [showDeleteJobModal, setShowDeleteJobModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // -------------
  // Fetch Calls
  // -------------

  const findCompanies = async () => {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "findCompanies",
      }),
    });
    const data = await response.json();
    setCompanies(data.message);
  };

  const findRecruiterRequests = async (companyId: string) => {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "findRecruiterRequests",
        company: companyId,
      }),
    });
    const data = await response.json();
    setRecruiterRequests(data.message);
  };

  const findEmployees = async (companyId: string) => {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "findEmployees",
        company: companyId,
      }),
    });
    const data = await response.json();
    setEmployees(data.message);
  };

  // NEW: Fetch jobs for the company
  const getJobs = async (companyId: string) => {
    toast.loading("Loading jobs...");
    const response = await fetch("/api/database", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getCompanyJobs",
        companyId,
      }),
    });
    toast.remove();
    const data = await response.json();
    setJobs(data.message || []);
  };

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.remove();
        toast.loading("Looking for company...");
        setEmail(session.user?.email || "");

        // 1) Fetch user by email
        const userResponse = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "findUserByEmail",
            email: session.user?.email,
          }),
        });
        const userData = await userResponse.json();

        // 2) If user has a company, set relevant data
        if (
          userData.message.employee &&
          userData.message.employee.company.name &&
          userData.message.employee.company.join_code &&
          userData.message.employee.company.id &&
          userData.message.employee.isApproved != null
        ) {
          setUserCompanyName(userData.message.employee.company.name);
          setUserCompanyJoinCode(userData.message.employee.company.join_code);
          setUserCompanyId(userData.message.employee.company.id);
          setUserApprovalStatus(userData.message.employee.isApproved);

          // Additional calls
          await findRecruiterRequests(userData.message.employee.company.id);
          await findEmployees(userData.message.employee.company.id);
          await getJobs(userData.message.employee.company.id);
        }

        // 3) Retrieve overall list of companies
        await findCompanies();

        setCompanyDataLoaded(true);
        toast.remove();
      }
    };
    if (status === "authenticated") {
      getData();
    }
  }, []);

  // -------------
  // UI Handlers
  // -------------

  const handleCompanyEnroll = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!newCompanyName) {
      toast.remove();
      toast.error('Please fill in the "Company Name" field.');
      setIsLoading(false);
    } else {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "addCompany",
          email: email,
          company: newCompanyName,
        }),
      });
      setIsLoading(false);
      toast.remove();
      toast.success("Company added!");
      location.href = "/dashboard";
    }
  };

  const handleApproveRecruiter = async (userEmail: string) => {
    toast.loading("Approving recruiter...");
    await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "approveRecruiter",
        email: userEmail,
        company: userCompanyId,
      }),
    });
    location.reload();
  };

  const handleDenyRecruiter = async (userEmail: string) => {
    toast.loading("Denying recruiter...");
    await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "denyRecruiter",
        email: userEmail,
        company: userCompanyId,
      }),
    });
    location.reload();
  };

  const handleJoinCompany = async (companyId: string) => {
    toast.loading("Joining company...");
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "joinCompany",
        email: email,
        company: companyId,
      }),
    });
    const data = await response.json();
    if (data.message == "Success") {
      location.reload();
    } else {
      toast.remove();
      toast.error("Invalid join code.");
    }
  };

  const handleLeaveCompany = async (companyId: string) => {
    toast.loading("Leaving company...");
    await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "leaveCompany",
        email: email,
        company: companyId,
      }),
    });
    location.reload();
  };

  // NEW: create a job for the company
  const handleCreateJob = async (e: FormEvent) => {
    e.preventDefault();
    if (!newJobName) {
      toast.error("Please enter a job name.");
      return;
    }
    if (!userCompanyId) {
      toast.error("No company found.");
      return;
    }

    toast.loading("Creating job...");
    const response = await fetch("/api/database", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createJob",
        companyId: userCompanyId,
        name: newJobName,
      }),
    });
    toast.remove();
    const data = await response.json();
    if (data.message === "Success") {
      toast.success("Job created!");
      setShowAddJobModal(false);
      setNewJobNameState("");
      // refresh the job list
      getJobs(userCompanyId);
    } else {
      toast.error("Error creating job.");
    }
  };

  // NEW: set job for deletion and open confirmation modal
  const openDeleteJobModal = (job: Job) => {
    setJobToDelete(job);
    setShowDeleteJobModal(true);
  };

  // NEW: confirm deletion of job
  const handleDeleteJob = async () => {
    if (!jobToDelete || !userCompanyId) return;

    toast.loading("Deleting job...");

    // Call our new route action
    const response = await fetch("/api/database", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deleteJob",
        jobId: jobToDelete.id,
        companyId: userCompanyId,
      }),
    });
    toast.remove();
    const data = await response.json();

    if (data.message === "Success") {
      toast.success("Job deleted!");
      // remove the job from local state
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
    } else {
      toast.error("Error deleting job.");
    }
    setShowDeleteJobModal(false);
    setJobToDelete(null);
  };

  // -------------
  // Join Code Inputs
  // -------------

  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleInput = (index: number, event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const maxLength = parseInt(input.getAttribute("maxlength") || "0");

    if (input.value.length >= maxLength) {
      if (inputs.current[index + 1]) {
        inputs.current[index + 1]?.focus();
      }
    }

    // Check if all six inputs have values
    const allInputsFilled = inputs.current.every((input) => input?.value);
    if (allInputsFilled) {
      const joinCode = inputs.current.map((input) => input?.value).join("");
      handleJoinCompany(joinCode);
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && index > 0) {
      const input = event.currentTarget;
      if (input.value.length === 0 && inputs.current[index - 1]) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      // already handled in getData() above
    }
  }, [status]);

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-screen text-white flex overflow-x-hidden">
        <Sidebar />
        <div className="bg-slate-950 flex-1">
          <div className="p-6 relative">
            <div className="flex justify-between items-center pb-6">
              <h2>Company Profile</h2>
            </div>

            {/* Loading Spinner */}
            {!companyDataLoaded && (
              <div className="flex justify-center items-center scale-150">
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}

            {/* If no company or user not in company */}
            {companyDataLoaded && (!userCompanyName || !userCompanyId) && (
              <div className="m-auto flex justify-center items-center flex-col">
                <AnimatePresence>
                  {newCompanyButton && (
                    <motion.div
                      className="fixed left-0 right-0 bottom-0 top-0 z-50 flex justify-center items-center flex-col gap-3 bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: "backOut",
                      }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.button
                        className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center gap-2 mt-3"
                        onClick={() => setNewCompanyButton(false)}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.7,
                          ease: "backOut",
                        }}
                        exit={{ opacity: 0, y: 30 }}
                      >
                        <Image
                          src={Plus}
                          width={14}
                          height={14}
                          className="rotate-45"
                          alt="Exit"
                        />
                      </motion.button>
                      <motion.form
                        className="bg-slate-900 p-6 rounded-xl border border-slate-800"
                        onSubmit={handleCompanyEnroll}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
                        exit={{ opacity: 0, y: 30 }}
                      >
                        <h1>Add your company</h1>
                        <p className="mb-6">
                          If your company is not a part of Skillbit, enroll here!
                        </p>
                        <motion.p
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: "backOut",
                          }}
                        >
                          Company Name
                        </motion.p>
                        <motion.input
                          type="text"
                          placeholder="Skillbit"
                          className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: "backOut",
                          }}
                          onChange={(e) => setNewCompanyName(e.target.value)}
                        />
                        <motion.button
                          className="mt-3 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: "backOut",
                          }}
                        >
                          {!isLoading && (
                            <>
                              Enroll{" "}
                              <div className="arrow flex items-center justify-center">
                                <div className="arrowMiddle"></div>
                                <div>
                                  <Image
                                    src={Arrow}
                                    alt=""
                                    width={14}
                                    height={14}
                                    className="arrowSide"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {isLoading && (
                            <div className="lds-ring">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          )}
                        </motion.button>
                      </motion.form>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-center items-center w-full flex-col">
                  <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl p-6 pb-20">
                    <h1>Join your company on Skillbit!</h1>
                  </div>
                  <div className="mt-20 p-6 flex flex-col justify-center items-center text-center w-full">
                    <h1>Have a join code?</h1>
                    <p>Enter your join code here.</p>
                    <div className="mt-6 flex gap-3">
                      {Array.from({ length: 6 }, (_, index) => (
                        <input
                          ref={(el) => (inputs.current[index] = el)}
                          key={index}
                          type="text"
                          name={`code-${index}`}
                          id={`code-${index}`}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-3 outline-none flex-1 w-16 text-2xl flex justify-center items-center text-center"
                          maxLength={1}
                          onInput={(e) => handleInput(index, e)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center items-center">
                    <hr className="w-10 h-0 border-b-0 border-slate-700" />
                    <p className="text-slate-700">or</p>
                    <hr className="w-10 h-0 border-b-0 border-slate-700" />
                  </div>
                  <button
                    className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-6"
                    onClick={() => setNewCompanyButton(true)}
                  >
                    New company
                    <div className="flex items-center justify-center">
                      <div>
                        <Image src={Plus} alt="" width={14} height={14} />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* If user has a company & is approved */}
            {companyDataLoaded &&
              userCompanyName &&
              userCompanyJoinCode &&
              userCompanyId &&
              userApprovalStatus && (
                <div className="bg-gradient-to-br from-slate-900 to-transparent border border-slate-800 rounded-xl p-6">
                  <h1>{userCompanyName}</h1>
                  <p className="mt-2">
                    Join code:{" "}
                    <span className="bg-slate-800 border border-slate-700 py-1 px-2 rounded-xl">
                      {userCompanyJoinCode}
                    </span>
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h2>Team Management</h2>
                    <div className="flex flex-col lg:flex-row gap-6 mt-3">
                      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex-1">
                        <h1>Recruiter Requests</h1>
                        {recruiterRequests.length == 0 && (
                          <p className="text-slate-400">
                            {
                              "Join requests from your company's employees will appear here. You don't have any recruiter requests."
                            }
                          </p>
                        )}
                        {recruiterRequests.map((employee) => (
                          <div
                            className="p-3 bg-slate-800 border border-slate-700 mt-3 rounded-xl flex justify-between items-center"
                            key={employee.email}
                          >
                            <div>
                              <p>
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-slate-400">{employee.email}</p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                className="bg-slate-700 border border-slate-600 p-2 rounded-lg flex justify-center items-center gap-2"
                                onClick={() => handleApproveRecruiter(employee.email)}
                              >
                                <div className="flex items-center justify-center">
                                  <div>
                                    <Image src={Check} alt="" width={16} height={16} />
                                  </div>
                                </div>
                                Accept
                              </button>
                              <button
                                className="bg-slate-700 border border-slate-600 p-2 rounded-lg flex justify-center items-center gap-2"
                                onClick={() => handleDenyRecruiter(employee.email)}
                              >
                                <div className="flex items-center justify-center">
                                  <div>
                                    <Image src={Cancel} alt="" width={16} height={16} />
                                  </div>
                                </div>
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex-1">
                        <h1>Employees</h1>
                        {employees.map((employee) => (
                          <div
                            className="p-3 bg-slate-800 border border-slate-700 mt-3 rounded-xl flex justify-between items-center"
                            key={employee.email}
                          >
                            <div>
                              <p>
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-slate-400">{employee.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Job Management Section */}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h2>Job Management</h2>
                    <div className="flex flex-col md:flex-row gap-6 mt-3">
                      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex-1">
                        <div className="flex justify-between items-center">
                          <h1>Jobs</h1>
                          <button
                            className="bg-indigo-600 py-1 px-3 rounded-lg flex items-center gap-2"
                            onClick={() => setShowAddJobModal(true)}
                          >
                            <div className="flex items-center justify-center">
                              <Image src={Plus} alt="" width={14} height={14} />
                            </div>
                            Add Job
                          </button>
                        </div>

                        {/* Show list of existing jobs */}
                        {jobs && jobs.length > 0 ? (
                          <div className="mt-3">
                            {jobs.map((job) => (
                              <div
                                key={job.id}
                                className="p-3 bg-slate-800 border border-slate-700 mt-3 rounded-xl flex justify-between items-center"
                              >
                                <p>{job.name}</p>
                                <div className="flex items-center gap-4">
                                  <p className="text-slate-400 text-sm">ID: {job.id}</p>
                                  {/* DELETE button */}
                                  <button
                                    className="bg-red-600 px-3 py-1 rounded-lg text-sm"
                                    onClick={() => openDeleteJobModal(job)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 text-slate-400">No jobs yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* If user has a company but not approved */}
            {companyDataLoaded &&
              userCompanyName &&
              userCompanyJoinCode &&
              userCompanyId &&
              !userApprovalStatus && (
                <div className="flex justify-center items-center flex-col text-center">
                  <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl p-6 py-20 mb-20"></div>
                  <h1>Your request is under review.</h1>
                  <p>
                    {`Your recruiter request is currently under review by ${userCompanyName}. Once you are approved, you will have access to your company's profile.`}
                  </p>
                  <button
                    className="bg-slate-900 border border-slate-800 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                    onClick={() => handleLeaveCompany(userCompanyId)}
                  >
                    Withdraw request
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* ADD JOB MODAL */}
      <AnimatePresence>
        {showAddJobModal && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.form
              onSubmit={handleCreateJob}
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowAddJobModal(false)}
                className="absolute top-4 right-4 bg-slate-900 border border-slate-800 p-2 rounded-full"
              >
                <Image
                  src={Plus}
                  width={14}
                  height={14}
                  alt="close"
                  className="rotate-45"
                />
              </button>

              <h2 className="text-xl font-semibold mb-4">Create New Job</h2>
              <label className="text-sm mb-1 block">Job Name:</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm mb-4"
                value={newJobName}
                onChange={(e) => setNewJobNameState(e.target.value)}
              />

              <motion.button
                type="submit"
                className="mt-2 bg-indigo-600 py-2 px-4 rounded-lg w-full flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
              >
                Create Job
                <div className="arrow flex items-center justify-center ml-2">
                  <div className="arrowMiddle" />
                  <Image
                    src={Arrow}
                    alt=""
                    width={14}
                    height={14}
                    className="arrowSide"
                  />
                </div>
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE JOB MODAL */}
      <AnimatePresence>
        {showDeleteJobModal && jobToDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  setShowDeleteJobModal(false);
                  setJobToDelete(null);
                }}
                className="absolute top-4 right-4 bg-slate-900 border border-slate-800 p-2 rounded-full"
              >
                <Image
                  src={Plus}
                  width={14}
                  height={14}
                  alt="close"
                  className="rotate-45"
                />
              </button>

              <h2 className="text-xl font-semibold mb-4">Delete Job</h2>
              <p className="mb-4">
                If you delete the job "<strong>{jobToDelete.name}</strong>", 
                any templates made with it will also be deleted. 
                Are you sure you want to proceed?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  className="bg-slate-700 px-4 py-2 rounded-md"
                  onClick={() => {
                    setShowDeleteJobModal(false);
                    setJobToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 px-4 py-2 rounded-md"
                  onClick={handleDeleteJob}
                >
                  Delete Job
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompanyProfile;
