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
import Dropdown from "../../public/assets/icons/dropdown.svg";

// Dashboard icons
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

const QuestionWorkshop = ({ params }: { params: { id: string } }) => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [newQuestionButton, setNewQuestionButton] = useState(false);
  const [card, setCard] = useState(1);
  const [email, setEmail] = useState("");

  const [userCompanyName, setUserCompanyName] = useState<string | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewAdditionalSettings, setViewAdditionalSettings] = useState(false);
  const [expiration, setExpiration] = useState("1 month");

  const [deleteQuestionWarning, setDeleteQuestionWarning] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [prompt, setPrompt] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [candidatePrompt, setCandidatePrompt] = useState("");
  const [newCandidatePrompt, setNewCandidatePrompt] = useState("");
  const [type, setType] = useState("");
  const [showQuestionOptions, setShowQuestionOptions] = useState("");

  const questionTitleRef = createRef<HTMLInputElement>();

  const { data: session, status } = useSession();

  // ***** Updated logic for the Dashboard button *****
  const [showDashboardButton, setShowDashboardButton] = useState(false);

  // Whenever the questions array changes, decide if we should show the button
  useEffect(() => {
    if (questions.length > 1) {
      setShowDashboardButton(true);
    } else {
      setShowDashboardButton(false);
    }
  }, [questions]);

  const handleDashboardButtonClick = () => {
    router.push("/dashboard");
  };
  // ***** End of updated logic for Dashboard Button *****

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
      setNewPrompt(data.message[0].prompt);
      setNewCandidatePrompt(data.message[0].candidatePrompt);
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
    if (
      currentQuestion &&
      questions.find((question) => question.title === newTitle) &&
      newTitle !== currentQuestion.title
    ) {
      toast.remove();
      toast.error(
        "Title already exists. Please choose a unique template title."
      );
    } else if (newTitle === "") {
      toast.remove();
      toast.error("Please enter a title.");
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
            prompt: newPrompt,
            candidatePrompt: newCandidatePrompt,
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
    // framework can be ""
    if (title !== "" && language !== "" && type !== "") {
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
            prompt: prompt,
            type: type,
            expiration: expiration,
          }),
        });
        const data = await response.json();
        if (data.message === "Success") {
          toast.remove();
          toast.success("Template added.");
          setTitle("");
          setLanguage("");
          setFramework("");
          setPrompt("");
          setType("");
          setExpiration("1 month");
          setViewAdditionalSettings(false);
          setNewQuestionButton(false);
          await findQuestions(userCompanyId || "");
        } else if (
          data.message ===
          "Title already exists. Please choose a unique template title."
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
      if (title === "") {
        toast.error("Please choose a title.");
      }
      if (language === "") {
        toast.error("Please choose a language and framework.");
      }
      if (type === "") {
        toast.error("Please choose a type.");
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.remove();
        toast.loading("Looking for questions...");
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
      <div className="flex text-white overflow-x-hidden min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-slate-950">
          {/* Enhanced Info Section */}
          <div className="p-6 flex flex-col gap-6  mx-auto w-full">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 items-center justify-between flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 mb-3">
              {/* Left Section: Icon and Text */}
            
  {/* Left Section: Info */}
  <div className="flex items-center gap-3">
    <Image src={QuestionIcon} width={32} height={32} alt="Info Icon" />
    <div>
      <h2 className="text-lg font-semibold text-white">
        What is this Assessment Builder?
      </h2>
      <p className="text-sm text-slate-400">
        This is your tool for building customized question templates,
        tailored by AI to suit specific needs and preferences.
      </p>
    </div>
  </div>

  {/* Right Section: Button */}
  {questions.length > 0 && (
    <motion.button
      className="bg-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-200 animate-glow"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDashboardButtonClick}
    >
      <span className="text-white">Back to Dashboard</span>
    </motion.button>
  )}
</div>

          </div>
          {/* End of Enhanced Info Section */}

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
                      setPrompt("");
                      setType("");
                      setCandidatePrompt("");
                    }}
                  >
                    <Image src={Plus} width={14} height={14} alt=""></Image>
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {questions &&
                    questions.map((question) => (
                      <div className="relative" key={question.id}>
                        <div
                          className={
                            currentQuestion?.id == question.id
                              ? "flex justify-between items-center p-3 bg-indigo-600 border border-indigo-600 rounded-lg cursor-pointer duration-100"
                              : "flex justify-between items-center p-3 hover:bg-slate-700 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer duration-100"
                          }
                          onClick={() => {
                            setCurrentQuestion(question);
                            setNewTitle(question.title);
                            setNewPrompt(question.prompt);
                            setNewCandidatePrompt(question.candidatePrompt)
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
                              setCurrentQuestion(question);
                              setNewTitle(question.title);
                              setNewPrompt(question.prompt);
                            }}
                          >
                            <p className="truncate">{question.title}</p>
                            <Image
                              src={Dots}
                              alt="Options"
                              width={14}
                              height={14}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowQuestionOptions(
                                  showQuestionOptions === question.id
                                    ? ""
                                    : question.id
                                );
                              }}
                            />
                          </div>
                          {showQuestionOptions === question.id && (
                            <motion.div
                              className="flex flex-col bg-slate-800 border border-slate-700 rounded-lg absolute z-20 right-0 mt-1 w-32"
                              onClick={() => setShowQuestionOptions("")}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, ease: "backOut" }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <div
                                className="p-3 hover:bg-slate-700 duration-100 rounded-t-lg cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  questionTitleRef.current?.focus();
                                }}
                              >
                                <p>Rename</p>
                              </div>
                              <div
                                className="p-3 hover:bg-slate-700 duration-100 rounded-b-lg cursor-pointer text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteQuestionWarning(true);
                                }}
                              >
                                <p>Delete</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">
                        Your company has no question templates.
                      </p>
                    )}
                  </div>
                </div>
                {/* End of Templates List */}

                {/* Question Details */}
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 w-full lg:w-2/3">
                  <div className="min-h-[60vh]">
                    {currentQuestion ? (
                      <div className="flex flex-col justify-between h-full">
                        {/* Question Header */}
                        <div>
                          <div className="flex items-end gap-2">
                            <input
                              className="border-b border-slate-800 bg-transparent outline-none placeholder:text-white font-bold text-2xl w-full"
                              ref={questionTitleRef}
                              type="text"
                              onChange={(e) => setNewTitle(e.target.value)}
                              value={newTitle}
                              placeholder="Question Title"
                            />
                            <Image
                              src={Edit}
                              alt="Edit title"
                              width={14}
                              height={14}
                            />
                          </div>
                          <div className="flex flex-wrap gap-3 mt-3">
                            <span className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                              {currentQuestion.language}
                            </span>
                            {currentQuestion.framework && (
                              <span className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                                {currentQuestion.framework}
                              </span>
                            )}
                            <span className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                              {currentQuestion.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col mt-3 pb-8">
                          <h2>Candidate Instructions</h2>
                          <p className="text-slate-400">
                            {"This prompt is the user's instructions and is generated by the AI model."}
                          </p>
                          <textarea
                            placeholder="You will be asked to..."
                            className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-slate-800 outline-none w-full mt-3 resize-y max-h-60 min-h-[100px] border border-slate-700"
                            onChange={(e) =>
                              setNewCandidatePrompt(e.target.value)
                            }
                            value={newCandidatePrompt}
                          />
                        </div>
                        <div className="flex flex-col mt-3">
                          <h2>Template Prompt</h2>
                          <p className="text-slate-400">
                            {
                              "This open-ended prompt is being used to help generate your templates. Candidates will not see this."
                            }
                          </p>
                          <textarea
                            placeholder="Generate a todo list application with 5 errors..."
                            className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-slate-800 outline-none w-full mt-3 resize-y max-h-60 min-h-[100px] border border-slate-700"
                            onChange={(e) => setNewPrompt(e.target.value)}
                            value={newPrompt}
                          />
                        </div>
                        <div className="mt-3 flex gap-2 items-center">
                          <h2>Expiration: </h2>
                          <p className="bg-slate-800 border border-slate-700 py-1 px-2 rounded-xl">
                            {currentQuestion.expiration}
                          </p>
                        </div>
                      </div>
                      {/* <div className="flex justify-center items-center flex-col gap-6 text-center">
                        <div className="flex justify-center items-center scale-150 mt-6">
                          <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                        {/* End of Question Header */}

                        {/* Save Changes Button */}
                        <AnimatePresence>
                          {(currentQuestion.title != newTitle ||
                            currentQuestion.prompt != newPrompt ||
                            currentQuestion.candidatePrompt != newCandidatePrompt
                            ) && (
                            <motion.button
                              className="mt-10 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-colors duration-200"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 30 }}
                              transition={{ duration: 0.2, ease: "backOut" }}
                              onClick={() => updateQuestion(currentQuestion.id)}
                            >
                              {!isSaving ? (
                                "Save changes"
                              ) : (
                                <div className="lds-ring">
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              )}
                            </motion.button>
                          )}
                        </AnimatePresence>
                        {/* End of Save Changes Button */}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center flex-col text-center h-full">
                        <h1 className="text-2xl font-semibold mb-2">
                          Welcome to the Assessment Builder!
                        </h1>
                        <p className="text-slate-400 mb-4">
                          To get started, generate a new template.
                        </p>
                        <button
                          className="bg-indigo-600 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-200"
                          onClick={() => setNewQuestionButton(true)}
                        >
                          New Template
                          <Image src={Plus} width={14} height={14} alt="Add" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* End of Question Details */}
              </div>
            </div>
          )}
          {companyDataLoaded && !userApprovalStatus && (
            <div className="p-6 flex justify-center items-center flex-col w-full text-center">
              <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl p-6 py-20 mb-20"></div>
              <h1 className="text-2xl font-semibold">Welcome to the Assessment Builder!</h1>
              <p className="text-slate-400 mb-4">
                To get started, please join a company in the Company Profile tab.
              </p>
              <motion.button
                className="bg-indigo-600 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-200 mt-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "backOut",
                }}
                onClick={() => router.push("/companyProfile")}
              >
                Join a company
                <div className="flex items-center justify-center">
                  <div>
                    <Image
                      src={Arrow}
                      alt="Arrow"
                      width={14}
                      height={14}
                      className="arrowSide"
                    />
                  </div>
                </div>
              </motion.button>
            </div>
          )}

          {/* New Question Modal */}
          <AnimatePresence>
            {newQuestionButton && (
              <motion.div
                className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex flex-col gap-12 max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgb(51 65 85) transparent",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  <div className="flex justify-end">
                    <motion.button
                      className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center"
                      onClick={() => {
                        setNewQuestionButton(false);
                        setViewAdditionalSettings(false);
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.7, ease: "backOut" }}
                      aria-label="Close Modal"
                    >
                      <Image
                        src={Plus}
                        width={14}
                        height={14}
                        className="rotate-45"
                        alt="Close"
                      />
                    </motion.button>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-semibold">Assessment Builder</h1>
                      <p className="text-slate-400">
                        Welcome to the Skillbit Assessment Builder. Create and
                        customize assessment templates to effectively evaluate candidate
                        skills.
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">Assessment Name</h2>
                      <p className="text-slate-400">
                        Name your template. Candidates will not see this.
                      </p>
                      <input
                        type="text"
                        placeholder="Template title"
                        className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-slate-800 outline-none w-full mt-3 border border-slate-700"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">
                        Programming Language and Framework
                      </h2>
                      <p className="text-slate-400">
                        Your questions will test candidates using the programming
                        language or framework you choose.
                      </p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div
                          className={`rounded-xl border ${
                            language === "JavaScript" && framework === "React JS"
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => {
                            setLanguage("JavaScript");
                            setFramework("React JS");
                          }}
                        >
                          React JS (JavaScript)
                        </div>
                        <div
                          className={`rounded-xl border ${
                            language === "TypeScript" && framework === "React JS"
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => {
                            setLanguage("TypeScript");
                            setFramework("React JS");
                          }}
                        >
                          React JS (TypeScript)
                        </div>
                        <div
                          className={`rounded-xl border ${
                            language === "C++" && framework === ""
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => {
                            setLanguage("C++");
                            setFramework("");
                          }}
                        >
                          C++
                        </div>
                        <div
                          className={`rounded-xl border ${
                            language === "Java" && framework === ""
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => {
                            setLanguage("Java");
                            setFramework("");
                          }}
                        >
                          Java
                        </div>
                        <div
                          className={`rounded-xl border ${
                            language === "SQL" && framework === ""
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
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
                      <h2 className="text-lg font-semibold">Question Type</h2>
                      <p className="text-slate-400">
                        We will use this to help generate your template and give
                        candidates an idea of what to expect.
                      </p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div
                          className={`rounded-xl border ${
                            type === "Debugging challenge"
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => setType("Debugging challenge")}
                        >
                          Debugging Challenge
                        </div>
                        <div
                          className={`rounded-xl border ${
                            type === "Data Structures challenge"
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => setType("Data Structures challenge")}
                        >
                          Data Structures Challenge
                        </div>
                        <div
                          className={`rounded-xl border ${
                            type === "Algorithmic challenge"
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => setType("Algorithmic challenge")}
                        >
                          Algorithmic Challenge
                        </div>
                        <div
                          className={`rounded-xl border ${
                            type === "Coding puzzle"
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => setType("Coding puzzle")}
                        >
                          Coding Puzzle
                        </div>
                        <div
                          className={`rounded-xl border ${
                            type === "Real-world problem"
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                          } p-3 cursor-pointer transition-colors duration-100`}
                          onClick={() => setType("Real-world problem")}
                        >
                          Real-world Problem
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">Template Prompt</h2>
                      <p className="text-slate-400">
                        We will use this open-ended prompt to help generate your
                        template. Candidates will not see this.
                      </p>
                      <textarea
                        placeholder="Generate a todo list application with 5 errors..."
                        className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-slate-800 outline-none w-full mt-3 resize-y max-h-60 min-h-[100px] border border-slate-700"
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() =>
                          setViewAdditionalSettings(!viewAdditionalSettings)
                        }
                      >
                        <h2 className="text-lg font-semibold">
                          Additional Settings
                        </h2>
                        <Image
                          src={Dropdown}
                          alt="Dropdown"
                          width={15}
                          height={15}
                          className={`transform transition-transform duration-200 ${
                            viewAdditionalSettings ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </div>
                      {viewAdditionalSettings && (
                        <motion.div
                          className="mt-3"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <p className="whitespace-nowrap">Test expires in:</p>
                            <select
                              id="expiration"
                              value={expiration}
                              onChange={(e) => setExpiration(e.target.value)}
                              className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 outline-none"
                            >
                              <option value="1 day">1 day</option>
                              <option value="1 week">1 week</option>
                              <option value="2 weeks">2 weeks</option>
                              <option value="1 month">1 month</option>
                              <option value="2 months">2 months</option>
                            </select>
                            <p className="text-slate-400 text-sm">
                              The test will expire {expiration} from the date it is
                              sent to the candidate.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <motion.button
                      className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-colors duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "backOut" }}
                      onClick={addQuestion}
                    >
                      Create Assessment
                      <div className="flex items-center justify-center ml-2">
                        <div className="arrowMiddle"></div>
                        <Image
                          src={Arrow}
                          alt="Arrow"
                          width={14}
                          height={14}
                          className="arrowSide"
                        />
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* End of New Question Modal */}

          {/* DELETE QUESTION WARNING */}
          <AnimatePresence>
            {deleteQuestionWarning && currentQuestion && (
              <motion.div
                className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  <h1 className="text-xl font-semibold mb-4">Are you sure?</h1>
                  <p className="mb-6">
                    You will not be able to recover this question template once
                    you delete it.
                  </p>
                  <div className="flex flex-col gap-3">
                    <motion.button
                      className="w-full bg-slate-800 border border-slate-700 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-slate-700 transition-colors duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      onClick={() => deleteQuestion(currentQuestion.id)}
                    >
                      Yes, delete {currentQuestion.title}
                    </motion.button>
                    <motion.button
                      className="w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-colors duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      onClick={() => setDeleteQuestionWarning(false)}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* End of DELETE QUESTION WARNING */}
        </div>
      </div>
    </>
  );
};

export default QuestionWorkshop;
