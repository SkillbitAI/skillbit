"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, createRef } from "react";
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
import Dots from "../../public/assets/icons/dots.svg";
import Plus from "../../public/assets/icons/plus.svg";
import { Toaster, toast } from "react-hot-toast";

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

import Edit from "../../public/assets/icons/edit.svg";

interface Question {
  title: string;
  language: string;
  framework: string;
  prompt: string;
  type: string;
  expiration: string;
  companyID: string;
  userId: string;
  id: string;
}

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
}

const Settings = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [newQuestionButton, setNewQuestionButton] = useState(false);
  const [card, setCard] = useState(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [userCompanyName, setUserCompanyName] = useState(null);
  const [userCompanyId, setUserCompanyId] = useState(null);
  const [userCompanyJoinCode, setUserCompanyJoinCode] = useState(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [deleteQuestionWarning, setDeleteQuestionWarning] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [type, setType] = useState("");
  const [showQuestionOptions, setShowQuestionOptions] = useState("");
  const [lastEmployeeWarning, setLastEmployeeWarning] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const questionTitleRef = createRef<HTMLInputElement>();

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
    setIsLoading(true);
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

  const handleSave = async () => {
    //CUERRENTLY HAVE NOT IMPLEMENTED CHANGE PASSWORD OR CHANGE EMAIL
    if (firstName.length > 0 && lastName.length > 0) {
      try {
        const response = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "updateUser",
            oldEmail: email,
            email: "",
            password: "",
            firstName: firstName,
            lastName: lastName,
          }),
        });
        const data = await response.json();
        if (data.message == "User already exists!") {
          toast.remove();
          toast.error(data.message);
        }
        if (data.message == "Update successful.") {
          toast.remove();
          toast.success("User data saved!");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      toast.remove();
      toast.error("Please enter a name.");
    }
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.loading("Loading...");
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

        setFirstName(userData.message.firstName);
        setLastName(userData.message.lastName);

        if (
          userData.message.employee &&
          userData.message.employee.company.name &&
          userData.message.employee.company.id &&
          userData.message.employee.isApproved != null
        ) {
          setUserCompanyName(userData.message.employee.company.name);
          setUserCompanyId(userData.message.employee.company.id);
          setUserCompanyJoinCode(userData.message.employee.company.join_code);
          setUserApprovalStatus(userData.message.employee.isApproved);
          await findEmployees(userData.message.employee.company.id);
        }
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
          {companyDataLoaded && (
            <div className="p-6 gap-6">
              {/* LAST LEAVE COMPANY MENU */}
              <AnimatePresence>
                {lastEmployeeWarning && userCompanyId && (
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
              <div className="flex justify-between items-center">
                <h2>Account Settings</h2>
                <button
                  className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
              <div className="border border-slate-800 rounded-xl bg-slate-900 p-6 mt-6">
                <h1>User information</h1>
                <div className="mt-6 flex gap-6">
                  <div className="flex-1">
                    <h2>First Name</h2>
                    <input
                      className="mt-1 border border-slate-700 rounded-xl bg-slate-800 outline-none placeholder:text-white font-['p'] p-3 w-full"
                      type="text"
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                    />
                  </div>
                  <div className="flex-1">
                    <h2>Last Name</h2>
                    <input
                      className="mt-1 border border-slate-700 rounded-xl bg-slate-800 outline-none placeholder:text-white font-['p'] p-3 w-full"
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                    />
                  </div>
                  <div className="flex-1">
                    <h2>Email</h2>
                    <input
                      className="mt-1 border border-slate-700 rounded-xl bg-slate-800 outline-none placeholder:text-white font-['p'] p-3 w-full"
                      type="text"
                      value={email}
                      disabled
                    />
                    <p className="text-slate-600 text-sm mt-1">
                      Please contact support to change your email address.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-slate-800 rounded-xl bg-slate-900 p-6 mt-6">
                <h1>Company Information</h1>
                {companyDataLoaded && !userApprovalStatus && (
                  <motion.button
                    className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100 mt-3"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "backOut",
                    }}
                    onClick={() => router.push("/companyProfile")}
                  >
                    <>
                      Join a company
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
                  </motion.button>
                )}
                {companyDataLoaded && userApprovalStatus && userCompanyId && (
                  <div className="mt-6">
                    <p>
                      Company Name:{" "}
                      <span className="bg-slate-800 border border-slate-700 py-1 px-2 rounded-xl">
                        {userCompanyName}
                      </span>{" "}
                    </p>
                    <p className="mt-3">
                      Join code:{" "}
                      <span className="bg-slate-800 border border-slate-700 py-1 px-2 rounded-xl">
                        {userCompanyJoinCode}
                      </span>
                    </p>
                    <motion.button
                      className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100 mt-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "backOut",
                      }}
                      onClick={() => router.push("/companyProfile")}
                    >
                      <>
                        View company profile
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
                    </motion.button>
                    <hr className="border-t-0 border-b border-b-slate-800 mt-6 mb-1" />
                    <button
                      className="bg-slate-800 border border-slate-700 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-6 text-red-500"
                      onClick={() => handleLeaveCompanySafety(userCompanyId)}
                    >
                      Leave company
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
