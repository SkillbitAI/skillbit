"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

interface Question {
  title: string;
  language: string;
  framework: string;
  type: string;
  companyID: string;
  userId: string;
  id: string;
}

const QuestionWorkshop = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [newQuestionButton, setNewQuestionButton] = useState(false);
  const [card, setCard] = useState(1);
  const [email, setEmail] = useState("");

  const [userCompanyName, setUserCompanyName] = useState(null);
  const [userCompanyId, setUserCompanyId] = useState(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [type, setType] = useState("");

  const { data: session, status } = useSession();

  const findQuestions = async (company: string) => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "findQuestions",
          company: company,
        }),
      });
      const data = await response.json();
      setQuestions(data.message.reverse());
      setCurrentQuestion(data.message[0]);
      console.log(data);
    } catch (error) {
      console.error("Error finding questions: ", error);
    }
  };

  const addQuestion = async () => {
    //framework can be ""
    if (title != "" && language != "" && type != "") {
      try {
        const response = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "addQuestion",
            email: email,
            title: title,
            language: language,
            framework: framework,
            type: type,
          }),
        });
        const data = await response.json();
        if (data.message == "Success") {
          toast.remove();
          toast.success("Question added.");
          setTitle("");
          setLanguage("");
          setFramework("");
          setType("");
          setNewQuestionButton(false);
          await findQuestions(userCompanyId || "");
        } else if (
          data.message ==
          "Title already exists. Please choose a unique question title."
        ) {
          toast.remove();
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error adding question.");
        console.error("Error adding question: ", error);
      }
    } else {
      if (title == "") {
        toast.error("Please choose a title.");
      }
      if (language == "") {
        toast.error("Please choose a language and framework.");
      }
      if (type == "") {
        toast.error("Please choose a type.");
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.loading("Looking for questions...");
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

        if (
          userData.message.employee &&
          userData.message.employee.company.name &&
          userData.message.employee.company.id &&
          userData.message.employee.isApproved != null
        ) {
          setUserCompanyName(userData.message.employee.company.name);
          setUserCompanyId(userData.message.employee.company.id);
          setUserApprovalStatus(userData.message.employee.isApproved);
          await findQuestions(userData.message.employee.company.id);
        }
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
          <TopMenuBar></TopMenuBar>
          {/* Dashboard content */}
          {userApprovalStatus && (
            <div className="p-6 flex gap-6">
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 w-64">
                <div className="flex justify-between items-center mb-3">
                  <h1>Templates</h1>
                  <button
                    className="hover:bg-slate-800 cursor-pointer rounded-xl p-3"
                    onClick={() => {
                      setNewQuestionButton(true);
                      setTitle("");
                      setLanguage("");
                      setFramework("");
                      setType("");
                    }}
                  >
                    <Image src={Plus} width={14} height={14} alt=""></Image>
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {questions &&
                    questions.map((question) => (
                      <div
                        className={
                          currentQuestion?.id == question.id
                            ? "flex justify-between items-center p-3 bg-indigo-600 border border-indigo-600 rounded-xl cursor-pointer duration-100"
                            : "flex justify-between items-center p-3 hover:bg-slate-700 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer duration-100"
                        }
                        onClick={() => setCurrentQuestion(question)}
                        key={question.id}
                      >
                        {question.title}
                        <Image src={Dots} alt="" width={14} height={14}></Image>
                      </div>
                    ))}
                  {(!questions || questions.length == 0) && (
                    <p className="text-slate-400">
                      Your company has no questions.
                    </p>
                  )}
                </div>
              </div>
              <div className="border-l border-slate-900 pl-6 flex-1">
                <div
                  className="bg-slate-900 rounded-xl border border-slate-800 p-6 min-h-full overflow-hidden flex justify-center items-center flex-col gap-6"
                  style={{ height: "calc(100vh - 116px)" }}
                >
                  {currentQuestion && (
                    <div className="w-full">
                      <h1>{currentQuestion?.title}</h1>
                    </div>
                  )}
                  {!currentQuestion && (
                    <div className="w-full h-full flex justify-center items-center flex-col text-center">
                      <h1>Welcome to the Question Workshop!</h1>
                      <p className="text-slate-400">
                        To get started, generate a new question.
                      </p>
                      <button
                        className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                        onClick={() => setNewQuestionButton(true)}
                      >
                        New question
                        <div className="flex items-center justify-center">
                          <div>
                            <Image
                              src={Plus}
                              alt=""
                              width={14}
                              height={14}
                            ></Image>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {newQuestionButton && (
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
                      className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center gap-2"
                      onClick={() => setNewQuestionButton(false)}
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
                    <motion.div
                      className="flex flex-col gap-6 max-w-lg overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl p-6"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(51 65 85) transparent",
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "backOut",
                      }}
                      exit={{ opacity: 0, y: 30 }}
                    >
                      <div className="flex flex-col">
                        <h1>Question Builder</h1>
                        <p className="">
                          Welcome to the Skillbit question builder.
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <h2>Title</h2>
                        <p className="text-slate-400">
                          Name your question. Applicants will not see this.
                        </p>
                        <input
                          type="text"
                          placeholder="Question title"
                          className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-3"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2>Programming language and framework</h2>
                        <p className="text-slate-400">
                          Your question will test candidates using the
                          programming language or framework you choose.
                        </p>
                        <div className="flex gap-3 mt-3 flex-wrap">
                          <div
                            className={
                              language == "JavaScript" &&
                              framework == "React JS"
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setLanguage("JavaScript");
                              setFramework("React JS");
                            }}
                          >
                            React JS (Javascript)
                          </div>
                          <div
                            className={
                              language == "TypeScript" &&
                              framework == "React JS"
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setLanguage("TypeScript");
                              setFramework("React JS");
                            }}
                          >
                            React JS (TypeScript)
                          </div>
                          <div
                            className={
                              language == "C++" && framework == ""
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setLanguage("C++");
                              setFramework("");
                            }}
                          >
                            C++
                          </div>
                          <div
                            className={
                              language == "Java" && framework == ""
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setLanguage("Java");
                              setFramework("");
                            }}
                          >
                            Java
                          </div>
                          <div
                            className={
                              language == "SQL" && framework == ""
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setLanguage("SQL");
                              setFramework("");
                            }}
                          >
                            SQL
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2>Question type</h2>
                        <p className="text-slate-400">
                          We will customize your candidates' prompts to reflect
                          this question type.
                        </p>
                        <div className="flex gap-3 mt-3 flex-wrap">
                          <div
                            className={
                              type == "Debugging challenge"
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setType("Debugging challenge");
                            }}
                          >
                            Debugging challenge
                          </div>
                          <div
                            className={
                              type == "Data Structures challenge"
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setType("Data Structures challenge");
                            }}
                          >
                            Data Structures challenge
                          </div>
                          <div
                            className={
                              type == "Algorithmic challenge"
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setType("Algorithmic challenge");
                            }}
                          >
                            Algorithmic challenge
                          </div>
                          <div
                            className={
                              type == "Coding puzzle"
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setType("Coding puzzle");
                            }}
                          >
                            Coding puzzle
                          </div>
                          <div
                            className={
                              type == "Real-world problem"
                                ? "bg-indigo-600 rounded-xl border border-indigo-600 p-3 duration-100 cursor-pointer"
                                : "bg-slate-800 rounded-xl border border-slate-700 p-3 hover:bg-slate-700 duration-100 cursor-pointer"
                            }
                            onClick={() => {
                              setType("Real-world problem");
                            }}
                          >
                            Real-world problem
                          </div>
                        </div>
                      </div>
                      <motion.button
                        className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
                        onClick={addQuestion}
                      >
                        <>
                          Generate question{" "}
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
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {!userApprovalStatus && (
            <div className="p-6">
              <h1>Welcome to the Question Workshop!</h1>
              <p className="text-slate-400">
                To get started, please join a company in the Company Profile
                tab.
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
                  Join a company{" "}
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionWorkshop;
