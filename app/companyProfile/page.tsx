"use client";

import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/loader/loader";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Sidebar from "@/components/sidebar/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopMenuBar from "@/components/topmenubar/topmenubar";
import Plus from "../../public/assets/icons/plus.svg";
import Check from "../../public/assets/icons/check.svg";
import Cancel from "../../public/assets/icons/cancel.svg";

//dashboard icons
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

const CompanyProfile = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [userCompanyName, setUserCompanyName] = useState(null);
  const [userCompanyJoinCode, setUserCompanyJoinCode] = useState(null);
  const [userCompanyId, setUserCompanyId] = useState(null);
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
  const [lastEmployeeWarning, setLastEmployeeWarning] = useState(false);

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

  const handleCompanyEnroll = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      newCompanyName == "" ||
      newCompanyName == null ||
      newCompanyName == undefined
    ) {
      toast.remove();
      toast.error('Please fill in the "Company Name" field.');
      setIsLoading(false);
    } else {
      console.log(newCompanyName);
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
      location.reload();
    }
  };

  const handleApproveRecruiter = async (userEmail: string) => {
    toast.loading("Approving recruiter...");
    const response = await fetch("/api/database", {
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
    const response = await fetch("/api/database", {
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

  const handleLeaveCompanySafety = async (companyId: string) => {
    if (employees.length == 1) {
      setLastEmployeeWarning(true);
    } else {
      handleLeaveCompany(companyId);
    }
  };

  const handleLeaveCompany = async (companyId: string) => {
    toast.loading("Leaving company...");
    const response = await fetch("/api/database", {
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

  const handleLeaveAndDeleteCompany = async (companyId: string) => {
    toast.loading("Leaving and deleting company...");
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "leaveAndDeleteCompany",
        email: email,
        company: companyId,
      }),
    });
    location.reload();
  };

  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleInput = (
    index: number,
    event: React.FormEvent<HTMLInputElement>
  ) => {
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

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && index > 0) {
      const input = event.currentTarget;
      if (input.value.length === 0 && inputs.current[index - 1]) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.loading("Looking for company...");
        // console.log("Hello world!");
        //other than print hello world, set user data here
        setEmail(session.user?.email || "");
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

        console.log(userData);

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
          await findRecruiterRequests(userData.message.employee.company.id);
          await findEmployees(userData.message.employee.company.id);
        }
        await findCompanies();
        setCompanyDataLoaded(true);
        toast.remove();
      }
    };
    if (status === "authenticated") {
      getData();
    }
  }, [session, status]);
  if (status === "loading") {
    return <Loader></Loader>;
  }
  if (status === "unauthenticated") {
    router.push("/auth");
    return;
  }
  return (
    <>
      <Toaster position="top-right"></Toaster>
      <div className="max-w-screen text-white flex overflow-x-hidden">
        <Sidebar></Sidebar>
        <div className="bg-slate-950 flex-1">
          {/* <TopMenuBar></TopMenuBar> */}
          {/* Dashboard content */}
          <div className="p-6 relative">
            {!companyDataLoaded && (
              <div className="flex justify-center items-center scale-150 mt-6">
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            {companyDataLoaded && (!userCompanyName || !userCompanyId) && (
              <div className="m-auto flex justify-center items-center flex-col">
                {/* NEW COMPANY MENU */}
                <AnimatePresence>
                  {newCompanyButton && (
                    <motion.div
                      className="fixed left-0 right-0 bottom-0 top-0 z-50 flex justify-center items-center flex-col gap-3 bg-slate-950 bg-opacity-60 p-6"
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
                        ></Image>
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
                          If your company is not a part of Skillbit, enroll
                          here!
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
                              <div className=" arrow flex items-center justify-center">
                                <div className="arrowMiddle"></div>
                                <div>
                                  <Image
                                    src={Arrow}
                                    alt=""
                                    width={14}
                                    height={14}
                                    className="arrowSide"
                                  ></Image>
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
                        <Image src={Plus} alt="" width={14} height={14}></Image>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {companyDataLoaded &&
              userCompanyName &&
              userCompanyJoinCode &&
              userCompanyId &&
              userApprovalStatus && (
                <div className="">
                  {/* LAST LEAVE COMPANY MENU */}
                  <AnimatePresence>
                    {lastEmployeeWarning && (
                      <motion.div
                        className="fixed left-0 right-0 bottom-0 top-0 z-50 flex justify-center items-center flex-col gap-3 bg-slate-950 bg-opacity-60 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="bg-slate-900 p-6 rounded-xl border border-slate-800"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: "backOut",
                          }}
                          exit={{ opacity: 0, y: 30 }}
                        >
                          <h1>Are you sure?</h1>
                          <p className="mb-6">
                            If you leave, this company will be deleted from
                            Skillbit.
                          </p>
                          <motion.button
                            className="mt-3 w-full bg-slate-800 border border-slate-700 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              ease: "backOut",
                            }}
                            onClick={() =>
                              handleLeaveAndDeleteCompany(userCompanyId)
                            }
                          >
                            {!isLoading && <>Yes, leave {userCompanyName} </>}
                            {isLoading && (
                              <div className="lds-ring">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            )}
                          </motion.button>
                          <motion.button
                            className="mt-3 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              ease: "backOut",
                            }}
                            onClick={() => setLastEmployeeWarning(false)}
                          >
                            Cancel
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <h1>{userCompanyName}</h1>
                  <p className="mt-2">
                    Join code:{" "}
                    <span className="bg-slate-900 border border-slate-800 py-1 px-2 rounded-xl">
                      {userCompanyJoinCode}
                    </span>
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-900">
                    <h2>Team Management</h2>
                    <div className="flex gap-6">
                      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 mt-3 flex-1">
                        <h1>Recruiter Requests</h1>
                        {recruiterRequests.length == 0 && (
                          <p className="text-slate-400">
                            Join requests from your company's employees will
                            appear here. You don't have any recruiter requests.
                          </p>
                        )}
                        {recruiterRequests &&
                          recruiterRequests.map((employee) => (
                            <div className="p-3 bg-slate-800 border border-slate-700 mt-3 rounded-xl flex justify-between items-center">
                              <div className="">
                                <p>
                                  {employee.firstName} {employee.lastName}
                                </p>
                                <p className="text-slate-400">
                                  {employee.email}
                                </p>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  className="bg-slate-700 border border-slate-600 p-2 rounded-lg flex justify-center items-center gap-2"
                                  onClick={() =>
                                    handleApproveRecruiter(employee.email)
                                  }
                                >
                                  <div className="flex items-center justify-center">
                                    <div>
                                      <Image
                                        src={Check}
                                        alt=""
                                        width={16}
                                        height={16}
                                      ></Image>
                                    </div>
                                  </div>
                                  Accept
                                </button>
                                <button
                                  className="bg-slate-700 border border-slate-600 p-2 rounded-lg flex justify-center items-center gap-2"
                                  onClick={() =>
                                    handleDenyRecruiter(employee.email)
                                  }
                                >
                                  <div className="flex items-center justify-center">
                                    <div>
                                      <Image
                                        src={Cancel}
                                        alt=""
                                        width={16}
                                        height={16}
                                      ></Image>
                                    </div>
                                  </div>
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 mt-3 flex-1">
                        <h1>Employees</h1>
                        {employees &&
                          employees.map((employee) => (
                            <div className="p-3 bg-slate-800 border border-slate-700 mt-3 rounded-xl flex justify-between items-center">
                              <div className="">
                                <p>
                                  {employee.firstName} {employee.lastName}
                                </p>
                                <p className="text-slate-400">
                                  {employee.email}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-slate-900 border border-slate-800 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                    onClick={() => handleLeaveCompanySafety(userCompanyId)}
                  >
                    Leave company
                  </button>
                </div>
              )}
            {companyDataLoaded &&
              userCompanyName &&
              userCompanyJoinCode &&
              userCompanyId &&
              !userApprovalStatus && (
                <div className="">
                  <h1>Your request is under review.</h1>
                  <p>
                    Your recruiter request is currently under review by{" "}
                    {userCompanyName}. Once you are approved, you will have
                    access to your company's profile.
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
    </>
  );
};

export default CompanyProfile;
