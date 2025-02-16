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
import { CheckmarkIcon, Toaster, toast } from "react-hot-toast";
import Discussion from "../../public/assets/images/discussion.png";

//dashboard icons
import DashboardIcon from "../../public/assets/icons/dashboard.svg";
import DashboardIconWhite from "../../public/assets/icons/dashboard_white.svg";
import ApplicantsIcon from "../../public/assets/icons/applicants.svg";
import CompanyIcon from "../../public/assets/icons/company.svg";
import SupportIcon from "../../public/assets/icons/support.svg";
import WorkshopIcon from "../../public/assets/icons/workshop.svg";
import ProfileIcon from "../../public/assets/icons/profile.svg";
import CheckIcon from "../../public/assets/icons/check.svg";
import SearchIcon from "../../public/assets/icons/search.svg";
import LockIcon from "../../public/assets/icons/lock.svg";

import Edit from "../../public/assets/icons/edit.svg";
import exp from "constants";

interface Question {
  candidatePrompt: string;
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

const Dashboard = () => {
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
  const [applicantData, setApplicantData] = useState<TestIDInterface[]>([]);

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
  const [date, setDate] = useState("");

  const [unsent, setUnsent] = useState(0);
  const [sent, setSent] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [expired, setExpired] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const questionTitleRef = createRef<HTMLInputElement>();

  const getApplicants = async (companyId: string) => {
    //getting applicants from the database
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getApplicants",
          company: companyId,
        }),
      });
      const data = await response.json();
      console.log(data);
      setApplicantData(data.message);

      let sentApplicants = 0;
      let unsentApplicants = 0;
      let completedApplicants = 0;
      let expiredApplicants = 0;

      data.message.forEach((applicant: TestIDInterface) => {
        if (applicant.status == "Sent") {
          sentApplicants++;
        } else if (applicant.status == "Unsent") {
          unsentApplicants++;
        } else if (applicant.status == "Completed") {
          completedApplicants++;
        } else if (applicant.status == "Expired") {
          expiredApplicants++;
        }
      });
      setSent(sentApplicants);
      setUnsent(unsentApplicants);
      setCompleted(completedApplicants);
      setExpired(expiredApplicants);
    } catch (error) {
      console.error(error);
    }
  };

  const findQuestions = async (companyId: string) => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "findQuestions",
          company: companyId,
        }),
      });
      const data = await response.json();
      setQuestions(data.message.reverse());
    } catch (error) {
      console.error("Error finding questions: ", error);
    }
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.remove();
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

        const dateFormat = new Date();
        setDate(
          dateFormat.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })
        );

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
          await getApplicants(userData.message.employee.company.id);
          await findQuestions(userData.message.employee.company.id);
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
              <div className="flex justify-between items-center pb-6">
                <h2>Dashboard</h2>
                <div className="flex gap-3 items-center justify-center relative z-10">
                  <p>{date}</p>
                  {/* <button className="bg-slate-800 cursor-pointer rounded-lg p-2 border border-slate-700 hover:bg-slate-700 duration-100">
                    <Image
                      src={SearchIcon}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                  </button> */}
                </div>
              </div>
              <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl py-6 px-20 pb-20 flex items-center justify-between gap-20">
                <div className="">
                  <h1 className="text-4xl">Welcome to Skillbit, {firstName}</h1>
                  <p className="text-slate-400">
                    View your candidate analytics, company insights, and goals
                    on this page.
                  </p>
                </div>
                <div className="-mr-20">
                  <Image
                    src={Discussion}
                    alt="Discussion photo"
                    width={400}
                    height={400}
                    className="-mt-20"
                  ></Image>
                </div>
              </div>
              <div className="">
                {companyDataLoaded && !userApprovalStatus && (
                  <div className="mt-20 text-center flex justify-center items-center flex-col">
                    <div className="">
                      <h1>Get Started</h1>
                      <p>Complete these tasks, in order, to get started!</p>
                      <div className="mt-6 flex flex-wrap gap-6 justify-start">
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 w-64 flex flex-col justify-between relative overflow-hidden">
                          <div className="">
                            <h2>Step 1:</h2>
                            <p>Create or join your company</p>
                          </div>
                          <motion.button
                            className="flex justify-center items-center p-3 px-3 bg-indigo-600 rounded-xl shadow-lg cursor-pointer duration-100 text-sm mt-6"
                            onClick={() =>
                              (window.location.href = "/companyProfile")
                            }
                          >
                            <>
                              Company Profile
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
                          {/* <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md">
                            <Image
                              src={LockIcon}
                              alt=""
                              className="w-8"
                            ></Image>
                          </div> */}
                          {userCompanyId != null && (
                            <div className="absolute right-0 top-0 bg-green-700 p-2 rounded-bl-xl">
                              <Image
                                src={CheckIcon}
                                alt=""
                                className="w-6"
                              ></Image>
                            </div>
                          )}
                        </div>
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 w-64 flex flex-col justify-between relative overflow-hidden">
                          <div className="">
                            <h2>Step 2:</h2>
                            <p>Create question templates</p>
                          </div>
                          <motion.button
                            className="flex justify-center items-center p-3 px-3 bg-indigo-600 rounded-xl shadow-lg cursor-pointer duration-100 text-sm mt-6"
                            onClick={() =>
                              (window.location.href = "/questionWorkshop")
                            }
                          >
                            <>
                              Assessment Builder
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
                          {userCompanyId == null && (
                            <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md flex-col text-center gap-6 p-6">
                              <Image
                                src={LockIcon}
                                alt=""
                                className="w-8"
                              ></Image>
                              <p>
                                Complete the previous tasks to unlock this task.
                              </p>
                            </div>
                          )}
                          {userCompanyId != null && questions.length != 0 && (
                            <div className="absolute right-0 top-0 bg-green-700 p-2 rounded-bl-xl">
                              <Image
                                src={CheckIcon}
                                alt=""
                                className="w-6"
                              ></Image>
                            </div>
                          )}
                        </div>
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 w-64 flex flex-col justify-between relative overflow-hidden">
                          <div className="">
                            <h2>Step 3:</h2>
                            <p>Add candidates</p>
                          </div>
                          <motion.button
                            className="flex justify-center items-center p-3 px-3 bg-indigo-600 rounded-xl shadow-lg cursor-pointer duration-100 text-sm mt-6"
                            onClick={() =>
                              (window.location.href = "/questionWorkshop")
                            }
                          >
                            <>
                              Candidate Manager
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
                          {(userCompanyId == null || questions.length == 0) && (
                            <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md flex-col text-center gap-6 p-6">
                              <Image
                                src={LockIcon}
                                alt=""
                                className="w-8"
                              ></Image>
                              <p>
                                Complete the previous tasks to unlock this task.
                              </p>
                            </div>
                          )}
                          {userCompanyId != null &&
                            questions.length != 0 &&
                            applicantData.length != 0 && (
                              <div className="absolute right-0 top-0 bg-green-700 p-2 rounded-bl-xl">
                                <Image
                                  src={CheckIcon}
                                  alt=""
                                  className="w-6"
                                ></Image>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* <h1>Welcome to the dashboard!</h1>
                    <p className="text-slate-400">
                      To view candidate analytics, company insights, and goals,
                      join a company.
                    </p>
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
                    </motion.button> */}
                  </div>
                )}
                {companyDataLoaded && userApprovalStatus && (
                  <div className="mt-6">
                    {(userCompanyId == null ||
                      questions.length == 0 ||
                      applicantData.length == 0) && (
                      <div className="">
                        <h1>Get Started</h1>
                        <p>Complete these tasks, in order, to get started!</p>
                        <div className="mt-6 flex flex-wrap gap-6 justify-start">
                          <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 w-64 flex flex-col justify-between relative overflow-hidden">
                            <div className="">
                              <h2>Step 1:</h2>
                              <p>Create or join your company</p>
                            </div>
                            <motion.button
                              className="flex justify-center items-center p-3 px-3 bg-indigo-600 rounded-xl shadow-lg cursor-pointer duration-100 text-sm mt-6"
                              onClick={() =>
                                (window.location.href = "/companyProfile")
                              }
                            >
                              <>
                                Company Profile
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
                            {/* <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md">
                            <Image
                              src={LockIcon}
                              alt=""
                              className="w-8"
                            ></Image>
                          </div> */}
                            {userCompanyId != null && (
                              <div className="absolute right-0 top-0 bg-green-700 p-2 rounded-bl-xl">
                                <Image
                                  src={CheckIcon}
                                  alt=""
                                  className="w-6"
                                ></Image>
                              </div>
                            )}
                          </div>
                          <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 w-64 flex flex-col justify-between relative overflow-hidden">
                            <div className="">
                              <h2>Step 2:</h2>
                              <p>Create question templates</p>
                            </div>
                            <motion.button
                              className="flex justify-center items-center p-3 px-3 bg-indigo-600 rounded-xl shadow-lg cursor-pointer duration-100 text-sm mt-6"
                              onClick={() =>
                                (window.location.href = "/questionWorkshop")
                              }
                            >
                              <>
                                Assessment Builder
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
                            {userCompanyId == null && (
                              <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md flex-col text-center gap-6 p-6">
                                <Image
                                  src={LockIcon}
                                  alt=""
                                  className="w-8"
                                ></Image>
                                <p>
                                  Complete the previous tasks to unlock this
                                  task.
                                </p>
                              </div>
                            )}
                            {userCompanyId != null && questions.length != 0 && (
                              <div className="absolute right-0 top-0 bg-green-700 p-2 rounded-bl-xl">
                                <Image
                                  src={CheckIcon}
                                  alt=""
                                  className="w-6"
                                ></Image>
                              </div>
                            )}
                          </div>
                          <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 w-64 flex flex-col justify-between relative overflow-hidden">
                            <div className="">
                              <h2>Step 3:</h2>
                              <p>Add candidates</p>
                            </div>
                            <motion.button
                              className="flex justify-center items-center p-3 px-3 bg-indigo-600 rounded-xl shadow-lg cursor-pointer duration-100 text-sm mt-6"
                              onClick={() =>
                                (window.location.href = "/applicants")
                              }
                            >
                              <>
                                Candidate Manager
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
                            {(userCompanyId == null ||
                              questions.length == 0) && (
                              <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md flex-col text-center gap-6 p-6">
                                <Image
                                  src={LockIcon}
                                  alt=""
                                  className="w-8"
                                ></Image>
                                <p>
                                  Complete the previous tasks to unlock this
                                  task.
                                </p>
                              </div>
                            )}
                            {userCompanyId != null &&
                              questions.length != 0 &&
                              applicantData.length != 0 && (
                                <div className="absolute right-0 top-0 bg-green-700 p-2 rounded-bl-xl">
                                  <Image
                                    src={CheckIcon}
                                    alt=""
                                    className="w-6"
                                  ></Image>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-6">
                      <h1>Candidate Analytics</h1>
                      {(userCompanyId == null ||
                        questions.length == 0 ||
                        applicantData.length == 0) && (
                        <p>
                          Complete all of the above tasks to unlock Candidate
                          Analytics.
                        </p>
                      )}
                      <div className="mt-6 flex flex-wrap gap-6">
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 flex items-center justify-center flex-col relative">
                          <div className="flex justify-center items-center flex-col">
                            <h2>Total Candidates:</h2>
                            <h1 className="text-5xl mt-3">
                              {applicantData.length}
                            </h1>
                          </div>
                          <hr className="border-t-0 border-b border-b-slate-800 my-3 w-full" />
                          <div className="flex gap-3 flex-wrap">
                            <div className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-1 justify-center items-center">
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                              <h2>Unsent:</h2>
                              <p>{unsent}</p>
                            </div>
                            <div className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-1 justify-center items-center">
                              <div className="w-2 h-2 rounded-full bg-blue-600 mr-1"></div>
                              <h2>Sent:</h2>
                              <p>{sent}</p>
                            </div>
                            <div className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-1 justify-center items-center">
                              <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
                              <h2>Completed:</h2>
                              <p>{completed}</p>
                            </div>
                            <div className="border border-slate-700 bg-slate-800 rounded-xl p-3 flex gap-1 justify-center items-center">
                              <div className="w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
                              <h2>Expired:</h2>
                              <p>{expired}</p>
                            </div>
                          </div>
                          {(userCompanyId == null ||
                            questions.length == 0 ||
                            applicantData.length == 0) && (
                            <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md">
                              <Image
                                src={LockIcon}
                                alt=""
                                className="w-8"
                              ></Image>
                            </div>
                          )}
                        </div>
                        <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 flex items-center justify-center flex-col relative">
                          <div className="flex justify-center items-center flex-col">
                            <h2>Completion Rate:</h2>
                            {applicantData.length > 0 && (
                              <h1 className="text-5xl mt-3">
                                {(
                                  (completed / applicantData.length) *
                                  100
                                ).toFixed(1)}
                                %
                              </h1>
                            )}
                            {applicantData.length == 0 && (
                              <h1 className="text-5xl mt-3">N/A</h1>
                            )}
                          </div>
                          {(userCompanyId == null ||
                            questions.length == 0 ||
                            applicantData.length == 0) && (
                            <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center backdrop-blur-md">
                              <Image
                                src={LockIcon}
                                alt=""
                                className="w-8"
                              ></Image>
                            </div>
                          )}
                        </div>
                        {/* <div className="border border-slate-800 rounded-xl p-6 bg-slate-900 flex items-center justify-center flex-col">
                        <div className="flex justify-center items-center flex-col">
                          <h2>Pass Rate:</h2>
                          <h1 className="text-5xl mt-3">8%</h1>
                          <p className="text-slate-400">172</p>
                        </div>
                        <hr className="border-t-0 border-b border-b-slate-800 my-3 w-full" />
                        <div className="flex justify-center items-center flex-col">
                          <h2>Fail Rate:</h2>
                          <h1 className="text-5xl mt-3">14%</h1>
                          <p className="text-slate-400">400</p>
                        </div>
                      </div> */}
                      </div>
                    </div>
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

export default Dashboard;
