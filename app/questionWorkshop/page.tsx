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
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteQuestionWarning, setDeleteQuestionWarning] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [type, setType] = useState("");
  const [showQuestionOptions, setShowQuestionOptions] = useState("");

  const questionTitleRef = createRef<HTMLInputElement>();

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
      setNewTitle(data.message[0].title);
      console.log(data);
    } catch (error) {
      console.error("Error finding questions: ", error);
    }
  };

  const deleteQuestion = async (id: string) => {
    toast.loading("Deleting question...");
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "deleteQuestion",
          id: id,
        }),
      });
      await findQuestions(userCompanyId || "");
      setDeleteQuestionWarning(false);
      toast.remove();
      toast.success("Question template deleted.");
    } catch (error) {
      toast.remove();
      toast.error("Error deleting question.");
      console.error("Error deleting question: ", error);
    }
  };

  const updateQuestion = async (id: string) => {
    setIsSaving(true);
    if (questions.find((question) => question.title == newTitle)) {
      toast.remove();
      toast.error(
        "Title already exists. Please choose a unique question title."
      );
    } else {
      try {
        const response = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "updateQuestion",
            id: id,
            title: newTitle,
          }),
        });
        await findQuestions(userCompanyId || "");
        toast.success("Question template updated.");
      } catch (error) {
        console.error("Error updating question: ", error);
      }
    }
    setIsSaving(false);
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
      toast.remove();
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
          <TopMenuBar></TopMenuBar>
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
          {companyDataLoaded && userApprovalStatus && (
            <div className="p-6 flex gap-6">
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 w-64">
                <div className="flex justify-between items-center mb-3">
                  <h1>Templates</h1>
                  <button
                    className="bg-slate-800 cursor-pointer rounded-lg p-2 border border-slate-700 hover:bg-slate-700 duration-100"
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
                      <div className="relative">
                        <div
                          className={
                            currentQuestion?.id == question.id
                              ? "flex justify-between items-center p-3 bg-indigo-600 border border-indigo-600 rounded-lg cursor-pointer duration-100"
                              : "flex justify-between items-center p-3 hover:bg-slate-700 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer duration-100"
                          }
                          onClick={() => {
                            setCurrentQuestion(question);
                            setNewTitle(question.title);
                          }}
                          key={question.id}
                        >
                          <p>{question.title}</p>
                          <Image
                            src={Dots}
                            alt=""
                            width={14}
                            height={14}
                            onClick={() => {
                              if (showQuestionOptions == "") {
                                setShowQuestionOptions(question.id);
                              } else {
                                setShowQuestionOptions("");
                              }
                            }}
                          ></Image>
                        </div>
                        {showQuestionOptions == question.id && (
                          <motion.div
                            className="flex flex-col bg-slate-800 border border-slate-700 rounded-lg absolute z-20 right-0 mt-1"
                            onClick={() => setShowQuestionOptions("")}
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: "backOut",
                            }}
                            exit={{ opacity: 0, y: -30 }}
                          >
                            <div
                              className="p-3 hover:bg-slate-700 duration-100 rounded-lg cursor-pointer"
                              onClick={() => questionTitleRef.current?.focus()}
                            >
                              <p>Rename</p>
                            </div>
                            <div
                              className="p-3 hover:bg-slate-700 duration-100 rounded-lg cursor-pointer text-red-500"
                              onClick={() => setDeleteQuestionWarning(true)}
                            >
                              <p>Delete</p>
                            </div>
                          </motion.div>
                        )}
                        {/* DELETE QUESTION WARNING */}
                        <AnimatePresence>
                          {deleteQuestionWarning && (
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
                                  You will not be able to recover this question
                                  template once you delete it.
                                </p>
                                <motion.button
                                  className="mt-3 w-full bg-slate-800 border border-slate-700 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "backOut",
                                  }}
                                  onClick={() => deleteQuestion(question.id)}
                                >
                                  Yes, delete {question.title}
                                </motion.button>
                                <motion.button
                                  className="mt-3 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "backOut",
                                  }}
                                  onClick={() =>
                                    setDeleteQuestionWarning(false)
                                  }
                                >
                                  Cancel
                                </motion.button>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  {(!questions || questions.length == 0) && (
                    <p className="text-slate-400">
                      Your company has no question templates.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div
                  className="bg-slate-900 rounded-xl border border-slate-800 p-6 min-h-full overflow-hidden flex justify-center items-center flex-col gap-6"
                  style={{ height: "calc(100vh - 116px)" }}
                >
                  {currentQuestion && (
                    <div className="w-full h-full flex flex-col justify-between">
                      <div className="">
                        <div className="flex items-end gap-2">
                          <input
                            className="border-b border-slate-800 bg-transparent outline-none placeholder:text-white font-['h1'] text-[24px] w-full"
                            ref={questionTitleRef}
                            type="text"
                            placeholder={currentQuestion.title}
                            onChange={(e) => {
                              if (e.target.value == "") {
                                setNewTitle(currentQuestion.title);
                              } else {
                                setNewTitle(e.target.value);
                              }
                            }}
                          />
                          <Image
                            src={Edit}
                            alt="Edit title"
                            width={14}
                            height={14}
                          ></Image>
                        </div>
                        <div className="flex gap-3 items-center flex-wrap mt-3">
                          <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                            <p>{currentQuestion.language}</p>
                          </div>
                          {currentQuestion.framework != "" && (
                            <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                              <p>{currentQuestion.framework}</p>
                            </div>
                          )}
                          <div className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                            <p>{currentQuestion.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center flex-col gap-6 text-center">
                        <div className="flex justify-center items-center scale-150 mt-6">
                          <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                        <motion.p
                          initial={{ opacity: 1 }}
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        >
                          Generating question...
                        </motion.p>
                      </div>
                      <div className="">
                        <AnimatePresence>
                          {currentQuestion.title != newTitle && (
                            <motion.button
                              className="mt-10 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, ease: "backOut" }}
                              exit={{ opacity: 0, y: 30 }}
                              onClick={() => updateQuestion(currentQuestion.id)}
                            >
                              {!isSaving && <>Save changes</>}
                              {isSaving && (
                                <div className="lds-ring">
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              )}
                            </motion.button>

                            // <button
                            //   className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                            //   onClick={() => updateQuestion(currentQuestion.id)}
                            // >
                            //   Save changes
                            // </button>
                          )}
                        </AnimatePresence>
                      </div>
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
          {companyDataLoaded && !userApprovalStatus && (
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
