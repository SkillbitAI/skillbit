"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState, ChangeEvent } from "react";

//import mail file
//
import Loader from "@/components/loader/loader";
import Papa from "papaparse";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import ReactDOM from "react-dom";
import { PDFViewer } from "@react-pdf/renderer";
import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Sidebar from "@/components/sidebar/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopMenuBar from "@/components/topmenubar/topmenubar";
import Dropdown from "../../public/assets/icons/dropdown.svg";
import Copy from "../../public/assets/icons/copy.svg";
import { Toaster, toast } from "react-hot-toast";
import FilterIcon from "../../public/assets/icons/filter.svg";

//dashboard icons
import Plus from "../../public/assets/icons/plus.svg";
import DashboardIcon from "../../public/assets/icons/dashboard.svg";
import DashboardIconWhite from "../../public/assets/icons/dashboard_white.svg";
import ApplicantsIcon from "../../public/assets/icons/applicants.svg";
import CompanyIcon from "../../public/assets/icons/company.svg";
import SupportIcon from "../../public/assets/icons/support.svg";
import WorkshopIcon from "../../public/assets/icons/workshop.svg";
import ProfileIcon from "../../public/assets/icons/profile.svg";
import QuestionIcon from "../../public/assets/icons/question.svg";
import SearchIcon from "../../public/assets/icons/search.svg";
import App from "next/app";

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
}

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

const Applicants = () => {
  const [email, setEmail] = useState("");
  const [userCompanyName, setUserCompanyName] = useState(null);
  const [userCompanyId, setUserCompanyId] = useState(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);
  const [viewTemplateAssignOptions, setViewTemplateAssignOptions] =
    useState(false);
  const [template, setTemplate] = useState("Choose one");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assignTemplatesWarning, setAssignTemplatesWarning] = useState(false);
  const [deleteCandidatesWarning, setDeleteCandidatesWarning] = useState(false);
  const [numSelected, setNumSelected] = useState(0);
  const [showCandidateDetails, setshowCandidateDetails] = useState(false);

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
      data.message.map((applicant: TestIDInterface) => {
        applicant.selected = false;
      });
      data.message.sort((a: TestIDInterface, b: TestIDInterface) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);

        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      });
      setApplicantData(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file && file.type === "text/csv") {
        parseCSV(file);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      complete: async (results) => {
        const rows = results.data;
        const combinedData = rows.map((row) => ({
          ...(row as Omit<TestIDInterface, "status" | "score" | "selected">),
          status: "Expired",
          score: "90%",
          selected: false,
        }));
        await updateApplicants(combinedData);
      },
      header: true,
    });
  };

  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "",
    score: "",
    selected: false,
  });

  const toggleAddApplicantModal = () => {
    setIsAddApplicantModalOpen((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    // Validate form fields
    if (
      formData.firstName === "" &&
      formData.lastName === "" &&
      formData.email === ""
    ) {
      // Display an error message or handle the validation error as needed
      toast.error("Please fill out all required fields.");
    }
    if (!formData?.firstName) {
      toast.error("Please fill out the first name.");
    }
    if (!formData?.lastName) {
      toast.error("Please fill out the last name.");
    }
    if (!formData?.email) {
      toast.error("Please fill out the email.");
    } else if (!regex.test(formData?.email)) {
      toast.error("That is not a valid email.");
    } else {
      // Proceed with form submission logic (e.g., sending data to the database)
      handleAddApplicant(formData.firstName, formData.lastName, formData.email);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddApplicant = async (
    applicantFirstName: string,
    applicantLastName: string,
    applicantEmail: string
  ) => {
    try {
      // Update individual applicant
      // await updateApplicants([applicantData]);

      // Send data to the server
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
        }),
      });

      const data = await response.json();
      await getApplicants(userCompanyId || "");
      toggleAddApplicantModal();
    } catch (error) {
      // Show error toast for network or unexpected errors
      toast.remove();
      toast.error("Error adding applicant");
      // Handle other errors if needed
    }
  };

  //function for uploading from the CSV
  const updateApplicants = async (applicants: Array<TestIDInterface>) => {
    try {
      toast.loading("Importing applicant(s)...");
      // Send data to the server
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "addApplicants",
          applicants: applicants,
          recruiterEmail: email,
        }),
      });
      if (!response.ok) {
        toast.remove();
        toast.error("Error loading applicants.");
        console.error("Error setting applicants!");
      } else {
        toast.remove();
        toast.success("Loaded applicants.");
        // await getApplicants(userCompanyId || "");
        window.location.reload();
      }
    } catch (error) {
      toast.remove();
      toast.error("Error loading applicants.");
      console.error(error);
    }
  };

  const path = usePathname();
  const router = useRouter();

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showOptionsIndex, setShowOptionsIndex] = useState("");
  const [applicantData, setApplicantData] = useState<TestIDInterface[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    let count = 0;
    applicantData.map((applicant) => {
      if (applicant.selected) {
        count++;
      }
    });
    if (count == applicantData.length && applicantData.length != 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    setNumSelected(count);
  }, [applicantData]);

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    const updatedData = applicantData.map((item) => ({
      ...item,
      selected: !selectAll,
    }));
    setApplicantData(updatedData);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 50;
  const totalPages = Math.ceil(applicantData.length / applicantsPerPage);

  //Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
    } catch (error) {
      console.error("Error finding questions: ", error);
    }
  };

  const assignTemplateSafety = async () => {
    if (template == "Choose one") {
      toast.remove();
      toast.error("Please choose a template to assign.");
    } else {
      setAssignTemplatesWarning(true);
    }
  };

  const handleAssignTemplate = async () => {
    try {
      toast.loading("Loading...");
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "assignTemplate",
          applicantData: applicantData,
          template: template,
          company: userCompanyName,
        }),
      });
      const data = await response.json();
      if (data.message == "Success") {
        toast.remove();
        toast.success("Successfully set templates and sent tests.");
        await getApplicants(userCompanyId || "");
        setAssignTemplatesWarning(false);
        setViewTemplateAssignOptions(false);
      } else if (data.message == "No candidates selected.") {
        toast.remove();
        toast.error(data.message);
        setAssignTemplatesWarning(false);
      } else {
        toast.remove();
        toast.error("An error occured while setting templates.");
        setAssignTemplatesWarning(false);
      }
    } catch (error) {
      console.error("Error setting templates: ", error);
      setAssignTemplatesWarning(false);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      toast.loading("Loading...");
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "deleteApplicants",
          applicantData: applicantData,
        }),
      });
      const data = await response.json();
      if (data.message == "Success") {
        toast.remove();
        toast.success("Successfully deleted candidates.");
        await getApplicants(userCompanyId || "");
        setDeleteCandidatesWarning(false);
        setViewTemplateAssignOptions(false);
        // await getApplicants(userCompanyId || "");
      } else if (data.message == "No candidates selected.") {
        toast.remove();
        toast.error(data.message);
        setDeleteCandidatesWarning(false);
      } else {
        toast.remove();
        toast.error("An error occured while deleting candidates.");
        setDeleteCandidatesWarning(false);
      }
    } catch (error) {
      console.error("Error finding questions: ", error);
      setDeleteCandidatesWarning(false);
    }
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        // console.log("Hello world!");
        //other than print hello world, set user data here
        toast.remove();
        toast.loading("Looking for candidates...");
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
      <div className="max-w-screen text-white flex overflow-x-hidden">
        <Sidebar></Sidebar>
        <div className="bg-slate-950 flex-1">
          {/* <TopMenuBar></TopMenuBar> */}
          <div className="flex">
            {/* Applicants content */}

            {!companyDataLoaded && (
              <div className="flex justify-center items-center scale-150 mt-6 w-full">
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            {companyDataLoaded && !userApprovalStatus && (
              <div className="p-6 flex justify-center items-center flex-col w-full text-center">
                <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl p-6 py-20 mb-20"></div>
                <h1>Welcome to the Candidate Manager!</h1>
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
            {companyDataLoaded && userApprovalStatus && (
              <div className="p-6 flex-1">
                <Toaster position="top-right"></Toaster>
                <ul className="flex gap-6 items-center justify-between">
                  <div className="flex gap-3 items-center justify-center">
                    <li className="">
                      <div className="flex gap-2 items-center text-white relative">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-white transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                        />
                        <p>Select all</p>
                      </div>
                    </li>
                    {numSelected > 0 && (
                      <hr className="border-l border-slate-800 h-5" />
                    )}
                    {numSelected > 0 && (
                      <div className="relative">
                        <li
                          className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative relative"
                          onClick={() =>
                            setViewTemplateAssignOptions(
                              !viewTemplateAssignOptions
                            )
                          }
                        >
                          <p className="text-sm flex gap-2 items-center justify-center">
                            Assign Templates and Send Tests
                          </p>
                        </li>
                        {viewTemplateAssignOptions &&
                          questions &&
                          questions.length > 0 && (
                            <motion.div
                              className="absolute left-0 top-10 border border-slate-800 bg-slate-900 rounded-lg p-3 w-80"
                              initial={{ opacity: 0, y: -30 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <p>
                                Choose a template to assign to the selected
                                candidates.
                              </p>
                              <select
                                id="template"
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 outline-none mt-3"
                              >
                                <option value="Choose one">Choose one</option>
                                {questions.map((question) => (
                                  <option value={question.id} key={question.id}>
                                    {question.title}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3 w-full"
                                onClick={assignTemplateSafety}
                              >
                                Assign templates and send tests
                              </button>
                            </motion.div>
                          )}
                        {/* ASSIGN AND SEND TEMPLATES WARNING */}
                        <AnimatePresence>
                          {assignTemplatesWarning && (
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
                                  By completing this action, you will assign
                                  templates and send test invitations to{" "}
                                  <b className="font-[h2]">{numSelected}</b>{" "}
                                  selected{" "}
                                  {numSelected == 1
                                    ? "candidate"
                                    : "candidates"}
                                  .
                                </p>
                                <motion.button
                                  className="mt-3 w-full bg-slate-800 border border-slate-700 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "backOut",
                                  }}
                                  onClick={handleAssignTemplate}
                                >
                                  Yes, assign templates and send tests.
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
                                    setAssignTemplatesWarning(false)
                                  }
                                >
                                  Cancel
                                </motion.button>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {viewTemplateAssignOptions &&
                          questions &&
                          questions.length == 0 && (
                            <div className="absolute left-0 top-10 border border-slate-800 bg-slate-900 rounded-lg p-3 w-80">
                              <p>{"You don't have any question templates."}</p>
                              <button
                                className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                                onClick={() => router.push("/questionWorkshop")}
                              >
                                Visit template workshop
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                    {numSelected > 0 && (
                      <div className="">
                        <li
                          className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative relative"
                          onClick={() => setDeleteCandidatesWarning(true)}
                        >
                          <p className="text-sm flex gap-2 items-center justify-center">
                            Delete selected
                          </p>
                        </li>
                        <AnimatePresence>
                          {deleteCandidatesWarning && (
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
                                  You are about to delete{" "}
                                  <b className="font-[h2]">{numSelected}</b>{" "}
                                  selected{" "}
                                  {numSelected == 1
                                    ? "candidate"
                                    : "candidates"}
                                  . This action cannot be undone.
                                </p>
                                <motion.button
                                  className="mt-3 w-full bg-slate-800 border border-slate-700 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "backOut",
                                  }}
                                  onClick={handleDeleteSelected}
                                >
                                  Yes, delete all selected candidates.
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
                                    setDeleteCandidatesWarning(false)
                                  }
                                >
                                  Cancel
                                </motion.button>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    <AnimatePresence>
                      {isAddApplicantModalOpen && (
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
                            onClick={() => toggleAddApplicantModal()}
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
                            className="bg-slate-900  flex flex-col p-6 rounded-xl border border-slate-800"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              ease: "backOut",
                            }}
                            exit={{ opacity: 0, y: 30 }}
                          >
                            <h1>Add candidate</h1>
                            <motion.label
                              className="text-white mt-5 mb-2"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            >
                              First Name:
                            </motion.label>
                            <motion.input
                              placeholder="John"
                              className="my-2 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1"
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            />

                            <motion.label
                              className="text-white my-2"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            >
                              Last Name:
                            </motion.label>
                            <motion.input
                              placeholder="Doe"
                              className="my-2 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1"
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            />

                            <motion.label
                              className="text-white my-2"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            >
                              Email:
                            </motion.label>
                            <motion.input
                              placeholder="mail@example.com"
                              className="my-2 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            />

                            <motion.button
                              type="submit"
                              className="mt-3 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            >
                              Submit
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
                            </motion.button>
                          </motion.form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-3 items-center justify-center">
                    <li className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative">
                      <button
                        onClick={toggleAddApplicantModal}
                        className="text-sm flex gap-2 items-center justify-center"
                      >
                        Add Candidate
                      </button>
                    </li>
                    <label
                      htmlFor="fileInput"
                      className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative"
                    >
                      <p className="text-sm flex gap-2 items-center justify-center">
                        Import CSV
                      </p>
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      id="fileInput"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />

                    <li
                      className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative"
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                    >
                      <p className="text-sm flex gap-2 items-center justify-center">
                        <Image
                          src={FilterIcon}
                          alt=""
                          width={15}
                          height={15}
                        ></Image>
                        Filter
                      </p>
                      {/* Filter Menu */}
                      {showFilterMenu && (
                        <motion.ul
                          initial={{ opacity: 0, y: -30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: 0,
                            ease: "backOut",
                            delayChildren: 0.2,
                          }}
                          className="absolute top-12 right-0 bg-slate-800 bg-opacity-60 backdrop-blur-lg rounded-lg border border-slate-800 p-3 flex flex-col gap-2 z-10"
                        >
                          <li className="flex gap-3 items-center justify-center w-max">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <p className="text-sm">Sent</p>
                          </li>
                          <li className="flex gap-3 items-center justify-center  w-max">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <p className="text-sm">Unsent</p>
                          </li>
                          <li className="flex gap-3 items-center justify-center  w-max">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                            <p className="text-sm">Completed</p>
                          </li>
                          <li className="flex gap-3 items-center justify-center  w-max">
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                            <p className="text-sm">Expired</p>
                          </li>
                        </motion.ul>
                      )}
                    </li>
                  </div>
                </ul>
                {applicantData && (
                  <div className="">
                    <ul className="flex flex-col gap-2 mt-6">
                      {applicantData
                        .slice(
                          (currentPage - 1) * applicantsPerPage,
                          currentPage * applicantsPerPage
                        )
                        .map((item, index) => (
                          <li
                            key={index}
                            className={
                              showOptionsIndex == index.toString()
                                ? "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 items-center justify-between border border-slate-800 duration-100 hover:cursor-pointer"
                                : "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 items-center justify-between hover:bg-slate-800 border border-slate-800 duration-100 hover:cursor-pointer"
                            }
                            onClick={
                              showOptionsIndex == index.toString()
                                ? () => {
                                    setShowOptionsIndex("");
                                    setshowCandidateDetails(false);
                                  }
                                : () => setShowOptionsIndex(index.toString())
                            }
                          >
                            <div className="flex gap-3 items-center justify-between w-full">
                              <div className="flex gap-6 items-center">
                                <input
                                  type="checkbox"
                                  checked={item.selected}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setShowOptionsIndex("");
                                    const updatedData = [...applicantData];
                                    updatedData[index].selected =
                                      !updatedData[index].selected;
                                    setApplicantData(updatedData);
                                  }}
                                  className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-white border-opacity-25 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                                />
                                <div className="">
                                  <h1 className="text-base">
                                    {item.firstName} {item.lastName}
                                  </h1>
                                  <p className="text-gray-500 text-sm">
                                    {item.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3 items-center justify-center">
                                {item.status == "Sent" && (
                                  <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <p className="text-sm">Sent</p>
                                  </div>
                                )}
                                {item.status == "Unsent" && (
                                  <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <p className="text-sm">Unsent</p>
                                  </div>
                                )}
                                {item.status == "Submitted" && (
                                  <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                    <p className="text-sm">Submitted</p>
                                  </div>
                                )}
                                {item.status == "Expired" && (
                                  <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                    <p className="text-sm">Expired</p>
                                  </div>
                                )}
                                <Image
                                  src={Dropdown}
                                  alt="Dropdown menu arrow"
                                  width={15}
                                  height={15}
                                  className={
                                    showOptionsIndex == index.toString()
                                      ? "rotate-0 opacity-25 duration-100"
                                      : "-rotate-90 opacity-25 duration-100"
                                  }
                                ></Image>
                              </div>
                            </div>
                            {showOptionsIndex == index.toString() && (
                              <motion.ul
                                className="flex gap-3 border-t w-full pt-3 border-t-slate-800 hover:cursor-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <motion.li
                                  className={
                                    showCandidateDetails
                                      ? "flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 shadow-lg cursor-pointer duration-100 relative"
                                      : "flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100 relative"
                                  }
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: 0,
                                    ease: "backOut",
                                  }}
                                >
                                  <button
                                    className="text-sm flex justify-between items-center gap-2"
                                    onClick={() =>
                                      setshowCandidateDetails(
                                        !showCandidateDetails
                                      )
                                    }
                                  >
                                    <>Candidate Details</>
                                    <Image
                                      src={Dropdown}
                                      alt="Dropdown menu arrow"
                                      width={15}
                                      height={15}
                                      className={
                                        showOptionsIndex == index.toString() &&
                                        showCandidateDetails
                                          ? "rotate-0 opacity-25 duration-100"
                                          : "-rotate-90 opacity-25 duration-100"
                                      }
                                    ></Image>
                                  </button>
                                  <AnimatePresence>
                                    {showCandidateDetails && (
                                      <motion.div
                                        className="absolute left-0 top-10 border border-slate-700 bg-slate-800 rounded-lg p-3 w-max flex flex-col gap-2"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                          duration: 0.2,
                                          delay: 0,
                                          ease: "backOut",
                                        }}
                                      >
                                        <p className="text-sm flex gap-2 items-center">
                                          <div className="">Test ID:</div>
                                          <div className="border rounded-lg border-slate-600 bg-slate-700 py-1 px-3">
                                            {item.id}
                                          </div>
                                          <div
                                            className=""
                                            onClick={() => {
                                              navigator.clipboard.writeText(
                                                item.id
                                              );
                                              toast.remove();
                                              toast.success(
                                                "Test ID copied to clipboard!"
                                              );
                                            }}
                                          >
                                            <Image
                                              src={Copy}
                                              alt="Copy Test ID"
                                              width={15}
                                              height={15}
                                            ></Image>
                                          </div>
                                        </p>
                                        <p className="text-sm flex gap-2 items-center">
                                          <div className="">Created:</div>
                                          <div className="border rounded-lg border-slate-600 bg-slate-700 py-1 px-3">
                                            {item.created.toString()}
                                          </div>
                                        </p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                                {item.status == "Submitted" && (
                                  <motion.li
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: 0,
                                      ease: "backOut",
                                    }}
                                    className="duration-100"
                                  >
                                    <motion.button
                                      className="flex justify-center items-center p-1 px-3 bg-indigo-600 rounded-full shadow-lg cursor-pointer duration-100 text-sm"
                                      onClick={() =>
                                        window.open(
                                          `/submissions/${item.id}`,
                                          "_blank",
                                          "width=1500,height=800,scrollbars=no,resizable=no"
                                        )
                                      }
                                    >
                                      <>
                                        View Submission
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
                                  </motion.li>
                                )}
                                {/* <motion.li
                                  className="flex gap-3 items-center justify-center p-1 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg cursor-pointer duration-100"
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: 0,
                                    ease: "backOut",
                                  }}
                                >
                                  <button className="text-sm">
                                    View Submission
                                  </button>
                                </motion.li> */}
                                {/* <motion.li
                                  className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100"
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: 0,
                                    ease: "backOut",
                                  }}
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.id);
                                    toast.remove();
                                    toast.success(
                                      "Test ID copied to clipboard!"
                                    );
                                  }}
                                >
                                  <button className="text-sm">
                                    Copy Test ID
                                  </button>
                                </motion.li> */}
                              </motion.ul>
                            )}
                          </li>
                        ))}
                    </ul>
                    <div className="flex justify-center mt-6 flex-wrap">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`mx-1 px-2 rounded-full bg-transparent ${
                            currentPage === i + 1
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {applicantData.length == 0 && (
                  <div className="flex justify-center items-center flex-col mt-20">
                    <p className="text-slate-400">
                      Your company does not have any active test IDs.
                    </p>
                    <div className="flex gap-3">
                      <button
                        className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                        onClick={toggleAddApplicantModal}
                      >
                        Add candidate
                      </button>
                      <label
                        htmlFor="fileInput"
                        className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3 cursor-pointer"
                      >
                        <p>Import CSV</p>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* <div className="p-6 w-80  h-screen border-l border-slate-800">
              <div className="flex flex-col gap-2">
                <h1>Applicant Analytics</h1>
                <div className="">DONUT CHART HERE</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Applicants;
