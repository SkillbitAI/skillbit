"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, createRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/loader/loader";

import Nav from "@/components/nav/nav";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Plus from "../../public/assets/icons/plus.svg";
import Dots from "../../public/assets/icons/dots.svg";
import Dropdown from "../../public/assets/icons/dropdown.svg";
import Edit from "../../public/assets/icons/edit.svg";
import QuestionIcon from "../../public/assets/icons/question.svg";
import { assignTemplate } from "../api/database/actions";

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
  instructions: string;
}
import Sidebar from "@/components/sidebar/sidebar";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  testIDs: Array<TestIDInterface>;
}

interface Job {
  id: string;
  name: string;
}

const QuestionWorkshop = () => {
  const path = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [viewFullInstructions, setViewFullInstructions] = useState(false);

  const [userCompanyName, setUserCompanyName] = useState<string | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  // Jobs for assigning a job to a new question
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [showQuestionOptions, setShowQuestionOptions] = useState("");

  const [deleteQuestionWarning, setDeleteQuestionWarning] = useState(false);

  const [newQuestionButton, setNewQuestionButton] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("");
  const [expiration, setExpiration] = useState("1 month");
  const [viewAdditionalSettings, setViewAdditionalSettings] = useState(false);

  // For updating an existing question
  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  const questionTitleRef = createRef<HTMLInputElement>();

  // Logic to decide if we show "Back to Dashboard" button
  const [showDashboardButton, setShowDashboardButton] = useState(false);

  // ------------------------------
  //   1) Fetch Questions from DB
  // ------------------------------
  const findQuestions = async (company: string) => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          action: "findQuestions",
          company: company,
        }),
      });
      const data = await response.json();
      setQuestions(data.message.reverse());
      if (data.message.length > 0) {
        setCurrentQuestion(data.message[0]);
        setNewTitle(data.message[0].title || "");
        setNewPrompt(data.message[0].prompt || "");
      }
      return data.message.reverse();
    } catch (error) {
      console.error("Error finding questions: ", error);
      return null;
    }
  };

  // ------------------------------
  //   2) Fetch Jobs from DB
  // ------------------------------
  const getCompanyJobs = async (companyId: string) => {
    try {
      toast.loading("Loading Jobs...");
      const response = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          action: "getCompanyJobs",
          companyId,
        }),
      });
      toast.remove();
      const data = await response.json();
      setJobs(data.message || []);
    } catch (error) {
      toast.remove();
      console.error("Error fetching jobs:", error);
    }
  };

  // ------------------------------
  //   3) Delete & Update
  // ------------------------------
  const deleteQuestion = async (id: string) => {
    toast.loading("Deleting question...");
    try {
      await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
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
      questions.find((q) => q.title === newTitle) &&
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
        await fetch("/api/database", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            action: "updateQuestion",
            id: id,
            title: newTitle,
            prompt: newPrompt,
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

  // ------------------------------
  //   4) Add a New Question
  // ------------------------------
  const addQuestion = async () => {
    // Check if a job is selected
    if (!selectedJobId) {
      toast.remove();
      toast.error(
        "A job must be chosen before you can create this template. Please create a job first if you have none."
      );
      return;
    }

    // Basic validation
    if (title && language && type) {
      try {
        const response = await fetch("/api/database", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            action: "addQuestion",
            email: email,
            title: title,
            language: language,
            framework: framework,
            prompt: prompt,
            type: type,
            expiration: expiration,
            jobId: selectedJobId, 
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
          setSelectedJobId("");
          setViewAdditionalSettings(false);
          setNewQuestionButton(false);

          // Run all handleAddApplicant calls concurrently
          const testIDs = await Promise.all([
            handleAddApplicant(
              "sample1",
              "sample1",
              "skillbitassessment@gmail.com"
            ),
            handleAddApplicant(
              "sample2",
              "sample2",
              "skillbitassessment@gmail.com"
            ),
            handleAddApplicant(
              "sample3",
              "sample3",
              "skillbitassessment@gmail.com"
            ),
          ]);

          // Ensure findQuestions completes before handleAssignTemplate
          const current = await findQuestions(userCompanyId || "");
          await handleAssignTemplate(current[current.length - 1], testIDs);

          // Fetch files only after all above operations are completed
          fetchFilesFromS3(testIDs);
        } else if (
          data.message ===
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
      if (!title) toast.error("Please choose a title.");
      if (!language) toast.error("Please choose a language and framework.");
      if (!type) toast.error("Please choose a type.");
    }
  };

  const fetchFilesFromS3 = async (testIDs: Array<any>) => {
    try {
      await Promise.all(
        testIDs.map(async (testID) => {
          const response = await fetch("/api/getFilesFromS3", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ testId: testID.message, recruiter: false }),
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch files for testID: ${testID}`);
          }

          const data = await response.json();
          return data;
        })
      );
      await findQuestions(userCompanyId || "");
    } catch (error) {
      console.error("Error fetching files from S3:", error);
      toast.error("Failed to load files from S3!");
    }
  };

  async function handleAddApplicant(
    applicantFirstName: string,
    applicantLastName: string,
    applicantEmail: string
  ) {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "addApplicant",
          firstName: applicantFirstName,
          lastName: applicantLastName,
          email: applicantEmail,
          recruiterEmail: email,
          isSample: true,
        }),
      });

      const testID = await response.json();
      return testID;
    } catch (error) {
      toast.remove();
      toast.error("Error adding applicant");
      return null;
    }
  }

  // Fetch Applicants from DB
  const getApplicants = async (companyId: string) => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getApplicants",
          company: companyId,
          isSample: true,
        }),
      });
      const data = await response.json();
      data.message.forEach((applicant: TestIDInterface) => {
        applicant.selected = true;
      });

      // Sort by created date
      data.message.sort((a: TestIDInterface, b: TestIDInterface) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
        return dateA.getTime() - dateB.getTime();
      });
      return data.message;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignTemplate = async (
    current: Question,
    testIDs: Array<TestIDInterface>
  ) => {
    try {
      console.log("trying applicant data:");
      console.log(testIDs);
      console.log("CURRENT:", current);
      toast.loading("Loading...");
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "assignSampleTemplate",
          applicantData: testIDs,
          template: current.id,
        }),
      });
      const data = await response.json();
      toast.remove();

      if (data.message === "Success") {
        toast.success("Successfully set templates and sent tests.");
      } else {
        console.log(data);
        toast.error("An error occurred while setting templates.");
      }
    } catch (error) {
      console.error("Error setting templates: ", error);
    }
  };

  // ------------------------------
  //   5) useEffect to load data
  // ------------------------------
  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.remove();
        toast.loading("Looking for questions...");

        setEmail(session.user?.email || "");
        // 1) Find user by email
        const userResponse = await fetch("/api/database", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            action: "findUserByEmail",
            email: session.user?.email,
          }),
        });
        const userData = await userResponse.json();

        // 2) If user is in a company
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
          // Also fetch jobs for the new "must pick a job" requirement
          await getCompanyJobs(userData.message.employee.company.id);
        }
        setCompanyDataLoaded(true);
        toast.remove();
      }
    };
    if (status === "authenticated") {
      getData();
    }
  }, [session, status]);

  // Update whether to show dashboard button
  useEffect(() => {
    if (questions.length > 1) setShowDashboardButton(true);
    else setShowDashboardButton(false);
  }, [questions]);

  // ------------------------------
  //  Rendering & Conditions
  // ------------------------------
  if (status === "loading") {
    return <Loader />;
  }
  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  const handleDashboardButtonClick = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex text-white overflow-x-hidden min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-slate-950">
          {/* Info Section */}
          <div className="p-6 pb-0 flex flex-col gap-6 mx-auto w-full">
            {questions.length < 1 && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 items-center justify-between flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="flex items-end gap-3">
                  <Image src={QuestionIcon} width={32} height={32} alt="Icon" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Assessment Builder
                    </h2>
                    <p className="text-sm text-slate-400">
                      Build customized question templates for your candidates!
                    </p>
                  </div>
                </div>
                <motion.button
                  className="bg-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors duration-200 animate-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDashboardButtonClick}
                >
                  <span className="text-white">Back to Dashboard</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* If still loading company info */}
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

          {/* If user has a company & is approved */}
          {companyDataLoaded && userApprovalStatus && (
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Templates List */}
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 w-full lg:w-1/3">
                  <div className="flex justify-between items-center mb-3">
                    <h1 className="text-xl font-semibold">Templates</h1>
                    <button
                      className="bg-slate-800 cursor-pointer rounded-lg p-2 border border-slate-700 hover:bg-slate-700 duration-100"
                      onClick={() => {
                        setNewQuestionButton(true);
                        setTitle("");
                        setLanguage("");
                        setFramework("");
                        setPrompt("");
                        setType("");
                        setSelectedJobId("");
                      }}
                      aria-label="Add New Template"
                    >
                      <Image src={Plus} width={14} height={14} alt="Add" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 max-h-[60vh] ">
                    {questions && questions.length > 0 ? (
                      questions.map((question) => (
                        <div className="relative" key={question.id}>
                          <div
                            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer border ${
                              currentQuestion?.id === question.id
                                ? "bg-indigo-600 border-indigo-600"
                                : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                            } transition-colors duration-200`}
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

                          {/* question options dropdown */}
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
                                  setCurrentQuestion(question);
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

                {/* Question Details */}
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 w-full lg:w-2/3">
                  <div className="min-h-[60vh]">
                    {currentQuestion ? (
                      <div className="flex flex-col justify-between h-full">
                        {/* Header */}
                        <div>
                          {/* Edit Title */}
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
                          {/* Language & Type */}
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

                          {/* Prompt */}
                          <div className="mt-3">
                            <h2 className="text-lg font-semibold">
                              Template Prompt
                            </h2>
                            <p className="text-sm text-slate-400">
                              This open-ended prompt is used to generate your
                              template. Candidates will not see this.
                            </p>
                            <textarea
                              placeholder="Generate a todo list application with 5 errors..."
                              className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-slate-800 outline-none w-full mt-3 resize-y max-h-60 min-h-[100px] border border-slate-700"
                              onChange={(e) => setNewPrompt(e.target.value)}
                              value={newPrompt}
                            />
                          </div>

                          {/* Expiration */}
                          <div className="mt-3 flex items-center gap-2">
                            <h2 className="text-lg font-semibold">
                              Expiration:
                            </h2>
                            <span className="bg-slate-800 border border-slate-700 py-1 px-2 rounded-xl">
                              {currentQuestion.expiration}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-col gap-2">
                            <h2 className="text-lg font-semibold">Samples:</h2>
                            {currentQuestion.testIDs.length == 0 && (
                              <div className="flex gap-3 items-center">
                                <div className="flex">
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
                                  Generating samples...
                                </motion.p>
                              </div>
                            )}
                            {currentQuestion.testIDs.length > 0 && (
                              <div className="flex flex-col gap-3">
                                {currentQuestion.testIDs.map(
                                  (sample, index) => (
                                    <div
                                      key={sample.id}
                                      className="bg-slate-800 border border-slate-700 p-3 rounded-xl"
                                    >
                                      <h2>Sample {index + 1}</h2>
                                      <p className="text-slate-400">
                                        <ReactMarkdown>
                                          {sample.instructions.length > 200
                                            ? sample.instructions.slice(
                                                0,
                                                200
                                              ) + "..."
                                            : sample.instructions}
                                        </ReactMarkdown>
                                      </p>
                                      <div className="flex gap-2">
                                        <motion.button
                                          className="mt-2 flex justify-center items-center p-1 px-3 rounded-full shadow-lg cursor-pointer duration-100 text-sm w-fit bg-slate-700 border border-slate-600 hover:bg-slate-600"
                                          onClick={() => {
                                            setSelectedSample(
                                              sample.instructions
                                            );
                                          }}
                                        >
                                          <>View Instructions</>
                                        </motion.button>
                                        <motion.button
                                          className="mt-2 flex justify-center items-center p-1 px-3 bg-indigo-600 rounded-full shadow-lg cursor-pointer duration-100 text-sm w-fit"
                                          onClick={() =>
                                            window.open(
                                              `/tests/${sample.id}`,
                                              "_blank",
                                              "width=1500,height=800,scrollbars=no,resizable=no"
                                            )
                                          }
                                        >
                                          <>
                                            View In Candidate Portal
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
                                          </>
                                        </motion.button>
                                      </div>
                                    </div>
                                    // <div
                                    //   key={sample.id} // Ensure each sample has a unique key
                                    //   className="bg-slate-800 border border-slate-700 py-1 px-2 rounded-xl"
                                    // onClick={() => {
                                    //   setSelectedSample(sample.instructions); // Store selected sample's instructions
                                    // }}
                                    // >
                                    //   <p>
                                    // <ReactMarkdown>
                                    //   {sample.instructions.length > 200
                                    //     ? sample.instructions.slice(0, 200) +
                                    //       "..."
                                    //     : sample.instructions}
                                    // </ReactMarkdown>
                                    //   </p>
                                    // </div>
                                  )
                                )}

                                {/* Modal */}
                                <AnimatePresence>
                                  {selectedSample && (
                                    <motion.div
                                      className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                    >
                                      <motion.div
                                        className="absolute m-auto z-50 left-6 right-6 top-6 bottom-6 flex flex-col max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto"
                                        style={{
                                          scrollbarWidth: "thin",
                                          scrollbarColor:
                                            "rgb(51 65 85) transparent",
                                        }}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 30 }}
                                        transition={{
                                          duration: 0.5,
                                          ease: "backOut",
                                        }}
                                      >
                                        <div className="flex justify-end">
                                          <motion.button
                                            className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center"
                                            onClick={() =>
                                              setSelectedSample(null)
                                            } // Close modal by clearing state
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 30 }}
                                            transition={{
                                              duration: 0.7,
                                              ease: "backOut",
                                            }}
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
                                            <h1 className="text-2xl font-semibold">
                                              Instructions
                                            </h1>
                                            <p className="text-slate-400 mt-6">
                                              <ReactMarkdown>
                                                {selectedSample}
                                              </ReactMarkdown>
                                            </p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Save Button */}
                        <AnimatePresence>
                          {(currentQuestion.title !== newTitle ||
                            currentQuestion.prompt !== newPrompt) && (
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
                      </div>
                    ) : (
                      // If no questions exist or none selected
                      <div className="flex justify-center items-center flex-col text-center min-h-[60vh]">
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
              </div>
            </div>
          )}

          {/* If user has a company but not approved */}
          {companyDataLoaded && !userApprovalStatus && (
            <div className="p-6 flex justify-center items-center flex-col w-full text-center">
              <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl p-6 py-20 mb-20"></div>
              <h1 className="text-2xl font-semibold">
                Welcome to the Assessment Builder!
              </h1>
              <p className="text-slate-400 mb-4">
                To get started, please join a company in the Company Profile
                tab.
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
                  className="absolute m-auto left-6 right-6 top-6 bottom-6 flex flex-col max-w-4xl bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgb(51 65 85) transparent",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                >
                  {/* Close Modal */}
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

                  {/* Modal Content */}
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-semibold">
                        Assessment Builder
                      </h1>
                      <p className="text-slate-400">
                        Welcome to the Skillbit Assessment Builder. Create and
                        customize assessment templates to effectively evaluate
                        candidate skills.
                      </p>
                    </div>

                    {/* (A) Template Title */}
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

                    {/* (B) Language & Framework */}
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">
                        Programming Language and Framework
                      </h2>
                      <p className="text-slate-400">
                        Your questions will test candidates using the language
                        or framework you choose.
                      </p>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div
                          className={`rounded-xl border ${
                            language === "JavaScript" &&
                            framework === "React JS"
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
                            language === "TypeScript" &&
                            framework === "React JS"
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

                    {/* (C) Question Type */}
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">Question Type</h2>
                      <p className="text-slate-400">
                        We use this to help generate your template.
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

                    {/* (D) Template Prompt */}
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">Template Prompt</h2>
                      <p className="text-slate-400">
                        This is used to help generate your template. Candidates
                        won’t see this.
                      </p>
                      <textarea
                        placeholder="Generate a todo list application with 5 errors..."
                        className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-slate-800 outline-none w-full mt-3 resize-y max-h-60 min-h-[100px] border border-slate-700"
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                      />
                    </div>

                    {/* (E) Additional Settings */}
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
                            <p className="whitespace-nowrap">
                              Test expires in:
                            </p>
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
                              The test will expire {expiration} from the date it
                              is sent to the candidate.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* (F) Must Choose a Job */}
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold">Assign to a Job</h2>
                      <p className="text-slate-400">
                        A job must be chosen before creating this template. If
                        you have no jobs, create one first.
                      </p>
                      {jobs && jobs.length > 0 ? (
                        <select
                          className="mt-3 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 outline-none"
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                          <option value="">Choose a job...</option>
                          {jobs.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-red-400 mt-3">
                          No jobs found. Please create a job in Company Profile
                          first.
                        </p>
                      )}
                    </div>

                    {/* (G) Create Assessment */}
                    <motion.button
                      className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-colors duration-200"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "backOut" }}
                      onClick={addQuestion}
                      // disable button if no jobs
                      disabled={jobs.length === 0}
                    >
                      Create Assessment
                      <div className="flex items-center justify-center ml-2">
                        <div className="arrowMiddle" />
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
                transition={{ duration: 0.5, ease: "backOut" }}
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
