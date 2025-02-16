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
  template: Question;
  expirationDate: Date;
}

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
const Applicants = () => {
  const [email, setEmail] = useState("");
  const [userCompanyName, setUserCompanyName] = useState<string | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  // Template selection & modals
  const [template, setTemplate] = useState("Choose one");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assignTemplatesWarning, setAssignTemplatesWarning] = useState(false);
  const [deleteCandidatesWarning, setDeleteCandidatesWarning] = useState(false);
  const [viewTemplateAssignModal, setViewTemplateAssignModal] = useState(false);

  // -------- NEW: States for Template Preview --------
  const [previewTemplate, setPreviewTemplate] = useState<Question | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Additional UI states
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showOptionsIndex, setShowOptionsIndex] = useState("");
  const [applicantData, setApplicantData] = useState<TestIDInterface[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Add Applicant
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "",
    score: "",
    selected: false,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 50;

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    // Anytime search changes, jump back to page 1
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter by status (multi-select)
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const path = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();

  // ------------------------------
  //   Fetch company & applicants
  // ------------------------------
  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.remove();
        toast.loading("Looking for candidates...");

        setEmail(session.user?.email || "");

        // Query the user's company data
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
          userData?.message?.employee?.company?.name &&
          userData?.message?.employee?.company?.id &&
          userData?.message?.employee?.isApproved != null
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
    return <Loader />;
  }
  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
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
        }),
      });
      const data = await response.json();
      data.message.forEach((applicant: TestIDInterface) => {
        applicant.selected = false;
      });

      // Sort by created date
      data.message.sort((a: TestIDInterface, b: TestIDInterface) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
        return dateA.getTime() - dateB.getTime();
      });
      setApplicantData(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Templates from DB
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

  // ---------------------
  //    Add Single Applicant
  // ---------------------
  const toggleAddApplicantModal = () => {
    setIsAddApplicantModalOpen((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!formData.firstName) {
      toast.error("Please fill out the first name.");
      return;
    }
    if (!formData.lastName) {
      toast.error("Please fill out the last name.");
      return;
    }
    if (!formData.email) {
      toast.error("Please fill out the email.");
      return;
    }
    if (!regex.test(formData.email)) {
      toast.error("That is not a valid email.");
      return;
    }

    handleAddApplicant(formData.firstName, formData.lastName, formData.email);
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

      await response.json();
      await getApplicants(userCompanyId || "");
      toggleAddApplicantModal();
    } catch (error) {
      toast.remove();
      toast.error("Error adding applicant");
    }
  };

  // ---------------------
  //    CSV Import
  // ---------------------
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

  const updateApplicants = async (applicants: Array<TestIDInterface>) => {
    try {
      toast.loading("Importing applicant(s)...");
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
      } else {
        toast.remove();
        toast.success("Loaded applicants.");
        window.location.reload();
      }
    } catch (error) {
      toast.remove();
      toast.error("Error loading applicants.");
      console.error(error);
    }
  };

  // ---------------------
  //    Select & Delete
  // ---------------------
  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    const updatedData = applicantData.map((item) => ({
      ...item,
      selected: !selectAll,
    }));
    setApplicantData(updatedData);
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
      toast.remove();

      if (data.message === "Success") {
        toast.success("Successfully deleted candidates.");
        await getApplicants(userCompanyId || "");
        setDeleteCandidatesWarning(false);
      } else if (data.message === "No candidates selected.") {
        toast.error(data.message);
        setDeleteCandidatesWarning(false);
      } else {
        toast.error("An error occured while deleting candidates.");
        setDeleteCandidatesWarning(false);
      }
    } catch (error) {
      console.error("Error deleting candidates: ", error);
      setDeleteCandidatesWarning(false);
    }
  };

  // ---------------------
  //    Assign Templates
  // ---------------------
  const assignTemplateSafety = () => {
    if (template === "Choose one") {
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
      toast.remove();

      if (data.message === "Success") {
        toast.success("Successfully set templates and sent tests.");
        await getApplicants(userCompanyId || "");
        setAssignTemplatesWarning(false);
        setViewTemplateAssignModal(false);
      } else if (data.message === "No candidates selected.") {
        toast.error(data.message);
        setAssignTemplatesWarning(false);
      } else {
        toast.error("An error occurred while setting templates.");
        setAssignTemplatesWarning(false);
      }
    } catch (error) {
      console.error("Error setting templates: ", error);
      setAssignTemplatesWarning(false);
    }
  };

  // ---------------------
  //   PREVIEW TEMPLATE
  // ---------------------
  const handlePreviewTemplate = () => {
    if (template === "Choose one") {
      toast.error("Please select a valid template first.");
      return;
    }
    // Find the chosen template
    const chosen = questions.find((q) => q.id === template);
    if (!chosen) {
      toast.error("Could not find that template. Please select again.");
      return;
    }
    // Store and show preview modal
    setPreviewTemplate(chosen);
    setShowPreviewModal(true);
  };

  // ---------------------
  //   Status Filter Logic
  // ---------------------
  const toggleFilter = (status: string) => {
    setActiveFilters((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // ---------------------
  //   Derived Data
  // ---------------------
  // Combine searchTerm & status-based filtering
  const filteredCandidates = applicantData.filter((candidate) => {
    const fullName = (candidate.firstName + " " + candidate.lastName).toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilters.length > 0) {
      if (!activeFilters.includes(candidate.status)) {
        return false;
      }
    }
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredCandidates.length / applicantsPerPage);
  const numSelected = applicantData.filter((a) => a.selected).length;

  return (
    <>
      <Toaster position="top-right" />

      <div className="max-w-screen text-white flex overflow-x-hidden">
        <Sidebar />

        <div className="bg-slate-950 flex-1">
          {/* 1) LOADING SPINNER */}
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

          {/* 2) If user not approved */}
          {companyDataLoaded && !userApprovalStatus && (
            <div className="p-6 flex justify-center items-center flex-col w-full text-center">
              <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl p-6 py-20 mb-20"></div>
              <h1 className="text-2xl font-semibold">Welcome to the Candidate Manager!</h1>
              <p className="text-slate-400 mt-2">
                To get started, please join a company in the Company Profile tab.
              </p>
              <motion.button
                className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100 mt-4"
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
                  <div className="arrow flex items-center justify-center ml-2">
                    <div className="arrowMiddle"></div>
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
          )}

          {/* 3) If approved => main interface */}
          {companyDataLoaded && userApprovalStatus && (
            <div className="p-6 flex flex-col gap-6 mx-auto w-full">
              {/* Header Info */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-2">
                <p className="text-lg font-semibold text-slate-200 mb-1">
                  Candidate Manager
                </p>
                <p className="text-sm text-slate-400">
                  Quick steps: <strong>Add candidate</strong> → <strong>Select</strong> →{" "}
                  <strong>Assign a template &amp; Send the test</strong>.
                </p>
              </div>

              {/* TOP ACTIONS BAR */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {/* Left side actions */}
                <div className="flex flex-wrap gap-3 items-center">
                  {/* SELECT ALL CHECKBOX */}
                  <div className="flex gap-2 items-center text-white relative">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-white transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                    />
                    <p className="whitespace-nowrap text-sm">Select all</p>
                  </div>

                  {/* ADD CANDIDATE BUTTON */}
                  <motion.button
                    className="flex gap-2 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 text-sm"
                    onClick={toggleAddApplicantModal}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Candidate
                  </motion.button>

                  {/* IMPORT CSV BUTTON */}
                  <label
                    htmlFor="fileInput"
                    className="flex gap-2 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 text-sm"
                  >
                    <p>Import CSV</p>
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    id="fileInput"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>

                {/* Right side: Filter toggles */}
                <div className="relative">
                  <div
                    className="flex gap-2 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 text-sm"
                    onClick={() => setShowFilterMenu((prev) => !prev)}
                  >
                    <Image src={FilterIcon} alt="" width={15} height={15} />
                    Filters
                  </div>
                  {showFilterMenu && (
                    <motion.ul
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: 0,
                        ease: "backOut",
                      }}
                      className="absolute top-10 right-0 bg-slate-800 bg-opacity-60 backdrop-blur-lg rounded-lg border border-slate-800 p-3 flex flex-col gap-2 z-10"
                    >
                      {/* Each status is clickable to toggle filter */}
                      <li
                        className="flex gap-3 items-center w-max cursor-pointer"
                        onClick={() => toggleFilter("Sent")}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activeFilters.includes("Sent")
                              ? "bg-blue-600"
                              : "bg-gray-400"
                          }`}
                        />
                        <p className="text-sm">Sent</p>
                      </li>
                      <li
                        className="flex gap-3 items-center w-max cursor-pointer"
                        onClick={() => toggleFilter("Unsent")}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activeFilters.includes("Unsent")
                              ? "bg-red-600"
                              : "bg-gray-400"
                          }`}
                        />
                        <p className="text-sm">Unsent</p>
                      </li>
                      <li
                        className="flex gap-3 items-center w-max cursor-pointer"
                        onClick={() => toggleFilter("Submitted")}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activeFilters.includes("Submitted")
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }`}
                        />
                        <p className="text-sm">Submitted</p>
                      </li>
                      <li
                        className="flex gap-3 items-center w-max cursor-pointer"
                        onClick={() => toggleFilter("Expired")}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activeFilters.includes("Expired")
                              ? "bg-gray-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <p className="text-sm">Expired</p>
                      </li>
                    </motion.ul>
                  )}
                </div>
              </div>

              {/* MAIN LAYOUT: LEFT = Candidates, RIGHT = Search + Assign */}
              <div className="flex flex-col gap-8 lg:flex-row w-full">
                {/* LEFT: Candidate List */}
                <div className="lg:w-2/3 flex flex-col gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-md p-4">
                    {filteredCandidates.length > 0 ? (
                      <>
                        <ul className="flex flex-col gap-2">
                          {filteredCandidates
                            .slice(
                              (currentPage - 1) * applicantsPerPage,
                              currentPage * applicantsPerPage
                            )
                            .map((item, index) => {
                              const listIndex =
                                (currentPage - 1) * applicantsPerPage + index;
                              return (
                                <li
                                  key={item.id}
                                  className={
                                    showOptionsIndex === listIndex.toString()
                                      ? "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 border border-slate-800 cursor-pointer"
                                      : "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                                  }
                                  onClick={() =>
                                    showOptionsIndex === listIndex.toString()
                                      ? (setShowOptionsIndex(""),
                                        setShowCandidateDetails(false))
                                      : setShowOptionsIndex(listIndex.toString())
                                  }
                                >
                                  <div className="flex gap-3 items-center justify-between w-full">
                                    <div className="flex gap-6 items-center">
                                      {/* Individual checkbox */}
                                      <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => {
                                          const updatedData = [...applicantData];
                                          const idx = updatedData.findIndex(
                                            (c) => c.id === item.id
                                          );
                                          if (idx !== -1) {
                                            updatedData[idx].selected =
                                              !updatedData[idx].selected;
                                          }
                                          setApplicantData(updatedData);
                                        }}
                                        className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-white border-opacity-25 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                                      />
                                      <div>
                                        <h1 className="text-base font-semibold">
                                          {item.firstName} {item.lastName}
                                        </h1>
                                        <p className="text-gray-400 text-sm">
                                          {item.email}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Status pill */}
                                    <div className="flex gap-3 items-center justify-center">
                                      {item.status === "Sent" && (
                                        <div className="flex gap-3 items-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                                          <p className="text-sm">Sent</p>
                                        </div>
                                      )}
                                      {item.status === "Unsent" && (
                                        <div className="flex gap-3 items-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                          <div className="w-2 h-2 rounded-full bg-red-500" />
                                          <p className="text-sm">Unsent</p>
                                        </div>
                                      )}
                                      {item.status === "Submitted" && (
                                        <div className="flex gap-3 items-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                          <div className="w-2 h-2 rounded-full bg-green-600" />
                                          <p className="text-sm">Submitted</p>
                                        </div>
                                      )}
                                      {item.status === "Expired" && (
                                        <div className="flex gap-3 items-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                                          <div className="w-2 h-2 rounded-full bg-gray-500" />
                                          <p className="text-sm">Expired</p>
                                        </div>
                                      )}
                                      <Image
                                        src={Dropdown}
                                        alt="Dropdown menu arrow"
                                        width={15}
                                        height={15}
                                        className={
                                          showOptionsIndex === listIndex.toString()
                                            ? "rotate-0 opacity-25 duration-100"
                                            : "-rotate-90 opacity-25 duration-100"
                                        }
                                      />
                                    </div>
                                  </div>

                                  {/* Expanded row */}
                                  {showOptionsIndex === listIndex.toString() && (
                                    <motion.ul
                                      className="flex gap-3 border-t w-full pt-3 border-t-slate-800"
                                      onClick={(e) => e.stopPropagation()}
                                      initial={{ opacity: 0, y: -20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -20 }}
                                      transition={{
                                        duration: 0.2,
                                        delay: 0,
                                        ease: "backOut",
                                      }}
                                    >
                                      {/* Candidate Details */}
                                      <motion.li
                                        className={
                                          showCandidateDetails
                                            ? "flex gap-3 items-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 shadow-lg cursor-pointer duration-100 relative"
                                            : "flex gap-3 items-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100 relative"
                                        }
                                      >
                                        <button
                                          className="text-sm flex justify-between items-center gap-2"
                                          onClick={() =>
                                            setShowCandidateDetails(
                                              !showCandidateDetails
                                            )
                                          }
                                        >
                                          Candidate Details
                                          <Image
                                            src={Dropdown}
                                            alt="Dropdown menu arrow"
                                            width={15}
                                            height={15}
                                            className={
                                              showCandidateDetails
                                                ? "rotate-0 opacity-25 duration-100"
                                                : "-rotate-90 opacity-25 duration-100"
                                            }
                                          />
                                        </button>

                                        <AnimatePresence>
                                          {showCandidateDetails && (
                                            <motion.div
                                              className="absolute left-0 top-10 border border-slate-700 bg-slate-800 rounded-lg p-3 w-max flex flex-col gap-2 z-40"
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
                                                <span>Test ID:</span>
                                                <span className="border rounded-lg border-slate-600 bg-slate-700 py-1 px-3">
                                                  {item.id}
                                                </span>
                                              </p>
                                              <p className="text-sm flex gap-2 items-center">
                                                <span>Created:</span>
                                                <span className="border rounded-lg border-slate-600 bg-slate-700 py-1 px-3">
                                                  {item.created
                                                    ? new Date(
                                                        item.created
                                                      ).toUTCString()
                                                    : "N/A"}
                                                </span>
                                              </p>
                                              <p className="text-sm flex gap-2 items-center">
                                                <span>Expiration:</span>
                                                <span className="border rounded-lg border-slate-600 bg-slate-700 py-1 px-3">
                                                  {item.expirationDate
                                                    ? new Date(
                                                        item.expirationDate
                                                      ).toUTCString()
                                                    : "N/A"}
                                                </span>
                                              </p>
                                              <p className="text-sm flex flex-col mt-1">
                                                <span className="mb-1">
                                                  Template:
                                                </span>
                                                {item.template ? (
                                                  <span className="border rounded-lg border-slate-600 bg-slate-700 py-1 px-3">
                                                    {item.template.title}
                                                  </span>
                                                ) : (
                                                  <span className="border rounded-lg border-slate-600 bg-slate-700 py-1 px-3 text-slate-500">
                                                    No template assigned
                                                  </span>
                                                )}
                                                <motion.button
                                                  className="mt-2 flex justify-center items-center p-1 px-3 bg-indigo-600 rounded-full shadow-lg cursor-pointer duration-100 text-sm w-fit"
                                                  onClick={() =>
                                                    router.push("/questionWorkshop")
                                                  }
                                                >
                                                  <>
                                                    View Templates
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
                                              </p>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </motion.li>

                                      {/* View Submission if "Submitted" */}
                                      {item.status === "Submitted" && (
                                        <motion.li
                                          className="duration-100"
                                          initial={{ opacity: 0, y: -20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -20 }}
                                          transition={{
                                            duration: 0.2,
                                            delay: 0,
                                            ease: "backOut",
                                          }}
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
                                        </motion.li>
                                      )}
                                    </motion.ul>
                                  )}
                                </li>
                              );
                            })}
                        </ul>

                        {/* PAGINATION */}
                        <div className="flex justify-center mt-6 flex-wrap gap-2">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`px-3 py-1 rounded-full ${
                                currentPage === i + 1
                                  ? "bg-indigo-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="mt-4 flex flex-col items-center">
                        <p className="text-slate-400 mb-3">
                          No candidates found with the current search/filter.
                        </p>
                        <div className="flex gap-3">
                          <button
                            className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2"
                            onClick={toggleAddApplicantModal}
                          >
                            Add candidate
                          </button>
                          <label
                            htmlFor="fileInput"
                            className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2 cursor-pointer"
                          >
                            <p>Import CSV</p>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: Search + Assign */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  {/* SEARCH BAR */}
                  <div className="bg-slate-900 border border-slate-800 rounded-md p-4">
                    <label htmlFor="search" className="block mb-2 text-sm font-semibold">
                      Search (Name or Email)
                    </label>
                    <input
                      id="search"
                      type="text"
                      placeholder="Type a name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 w-full text-sm focus:outline-none"
                    />
                  </div>

                  {/* ASSIGN QUESTIONS PANEL */}
                  <div className="bg-slate-900 border border-slate-800 rounded-md p-4">
                    <h2 className="text-lg font-semibold mb-2">
                      Assign Questions ({numSelected})
                    </h2>
                    <p className="text-sm text-slate-400 mb-4">
                      Select candidate(s) on the left, then assign a template below.
                    </p>

                    <button
                      className="bg-indigo-600 py-2 px-4 rounded-lg text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={numSelected === 0}
                      onClick={() => setViewTemplateAssignModal(true)}
                    >
                      Assign &amp; Send Tests
                    </button>

                    {/* List of selected candidates */}
                    <div className="mt-3">
                      <p className="text-sm font-semibold mb-2">Selected:</p>
                      {numSelected > 0 ? (
                        <ul className="flex flex-col gap-2">
                          {applicantData
                            .filter((a) => a.selected)
                            .map((a) => (
                              <li
                                key={a.id}
                                className="bg-slate-800 rounded-md p-2 flex justify-between items-center text-sm border border-slate-700"
                              >
                                <div>
                                  {a.firstName} {a.lastName}
                                </div>
                                <button
                                  className="text-xs underline cursor-pointer text-gray-400 hover:text-gray-100"
                                  onClick={() => {
                                    const updatedData = [...applicantData];
                                    const idx = updatedData.findIndex(
                                      (cand) => cand.id === a.id
                                    );
                                    if (idx !== -1) {
                                      updatedData[idx].selected = false;
                                    }
                                    setApplicantData(updatedData);
                                  }}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-slate-500 text-sm">
                          No candidates selected yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD APPLICANT MODAL */}
      <AnimatePresence>
        {isAddApplicantModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              className="bg-slate-900 flex flex-col p-6 rounded-xl border border-slate-800 w-full max-w-md relative"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              exit={{ opacity: 0, y: 30 }}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => toggleAddApplicantModal()}
                className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center gap-2 absolute top-4 right-4"
              >
                <Image
                  src={Plus}
                  width={14}
                  height={14}
                  className="rotate-45"
                  alt="Exit"
                />
              </button>

              <h1 className="text-xl font-semibold mb-4">Add Candidate</h1>

              <label className="text-white mt-2 mb-1">First Name:</label>
              <input
                placeholder="John"
                className="my-1 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />

              <label className="text-white mt-3 mb-1">Last Name:</label>
              <input
                placeholder="Doe"
                className="my-1 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />

              <label className="text-white mt-3 mb-1">Email:</label>
              <input
                placeholder="mail@example.com"
                className="my-1 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              <motion.button
                type="submit"
                className="mt-6 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100"
                whileTap={{ scale: 0.95 }}
              >
                Submit
                <div className="arrow flex items-center justify-center ml-2">
                  <div className="arrowMiddle"></div>
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

      {/* ASSIGN TEMPLATE MODAL */}
      <AnimatePresence>
        {viewTemplateAssignModal && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Assign Template</h3>
                <button
                  onClick={() => setViewTemplateAssignModal(false)}
                  className="p-1 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors"
                >
                  <Image
                    src={Plus}
                    width={14}
                    height={14}
                    className="rotate-45"
                    alt="Close"
                  />
                </button>
              </div>

              {questions && questions.length > 0 ? (
                <>
                  <label htmlFor="template" className="block mb-2 text-sm">
                    Choose a template:
                  </label>
                  <select
                    id="template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 outline-none w-full mb-2"
                  >
                    <option value="Choose one">Choose one</option>
                    {questions.map((question) => (
                      <option value={question.id} key={question.id}>
                        {question.title}
                      </option>
                    ))}
                  </select>

                  {/* PREVIEW BUTTON */}
                  <button
                    onClick={handlePreviewTemplate}
                    className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg w-full text-sm
                               hover:bg-slate-700 transition-colors duration-200 mb-4"
                  >
                    Preview Template
                  </button>

                  <button
                    className="bg-indigo-600 py-2 px-4 rounded-lg w-full"
                    onClick={assignTemplateSafety}
                  >
                    Assign Template and Send Tests
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-4 text-slate-400">
                    You don&apos;t have any question templates. Would you like to
                    create one?
                  </p>
                  <button
                    className="bg-indigo-600 py-2 px-4 rounded-lg w-full"
                    onClick={() => router.push("/questionWorkshop")}
                  >
                    Visit Assessment Builder
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREVIEW TEMPLATE MODAL */}
      <AnimatePresence>
        {showPreviewModal && previewTemplate && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors absolute top-4 right-4"
              >
                <Image
                  src={Plus}
                  width={14}
                  height={14}
                  className="rotate-45"
                  alt="Close"
                />
              </button>

              <h2 className="text-xl font-semibold mb-2">
                {previewTemplate.title}
              </h2>
              <div className="text-sm text-slate-400 flex flex-col gap-2">
                <p><strong>Language:</strong> {previewTemplate.language}</p>
                {previewTemplate.framework && (
                  <p><strong>Framework:</strong> {previewTemplate.framework}</p>
                )}
                <p><strong>Type:</strong> {previewTemplate.type}</p>
                <p><strong>Expiration:</strong> {previewTemplate.expiration}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-semibold">Prompt</h3>
                <p className="text-sm text-slate-300 whitespace-pre-line mt-1 border border-slate-700 bg-slate-800 rounded p-2">
                  {previewTemplate.prompt}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM SEND & DELETE */}
      <AnimatePresence>
        {assignTemplatesWarning && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl font-semibold mb-4">Send Tests Now?</h1>
              <p className="text-sm text-slate-300 mb-6">
                This will email the selected candidates their tests immediately.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAssignTemplate}
                  className="bg-indigo-600 py-2 px-4 rounded-lg"
                >
                  Yes, Send Tests
                </button>
                <button
                  onClick={() => setAssignTemplatesWarning(false)}
                  className="bg-slate-800 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteCandidatesWarning && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-xl font-semibold mb-4">Delete Candidates?</h1>
              <p className="text-sm text-slate-300 mb-6">
                Are you sure you want to delete the selected candidates?
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-600 py-2 px-4 rounded-lg"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteCandidatesWarning(false)}
                  className="bg-slate-800 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Applicants;
