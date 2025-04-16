"use client";
import React, { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import Loader from "@/components/loader/loader";
import Papa from "papaparse";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Arrow from "../../public/assets/icons/arrow.svg";
import Plus from "../../public/assets/icons/plus.svg";
import Sidebar from "@/components/sidebar/sidebar";
import { Toaster, toast } from "react-hot-toast";

interface TestIDInterface {
  companyID: string;
  id: string;
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
  jobId?: string; // The job the candidate is assigned to
}
interface Question {
  id: string;
  title: string;
  language: string;
  framework?: string;
  prompt: string;
  type: string;
  expiration: string;
  companyID: string;
  userId: string;
  testIDs: Array<TestIDInterface>;
}

interface Job {
  id: string;
  name: string;
}

interface AssignableCandidate extends TestIDInterface {
  selected: boolean; // used in "Assign Templates" flow
}

const Applicants = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [userCompanyName, setUserCompanyName] = useState<string | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  // Data lists
  const [applicants, setApplicants] = useState<TestIDInterface[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Add Applicant Modal
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [newApplicantForm, setNewApplicantForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobId: "",
  });

  // CSV import
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  // For “Assign Templates” flow
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedJobForAssign, setSelectedJobForAssign] = useState("");
  const [selectedTemplateForAssign, setSelectedTemplateForAssign] =
    useState("");
  const [assignableCandidates, setAssignableCandidates] = useState<
    AssignableCandidate[]
  >([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 50;

  // Track expanded details for each candidate
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(
    null
  );

  // Delete Confirmation
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.remove();
        toast.loading("Loading data...");

        setEmail(session.user?.email || "");

        // 1) find user by email
        const userRes = await fetch("/api/database", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            action: "findUserByEmail",
            email: session.user?.email,
          }),
        });
        const userData = await userRes.json();
        if (
          userData?.message?.employee?.company?.id &&
          userData?.message?.employee?.company?.name &&
          userData?.message?.employee?.isApproved !== null
        ) {
          setUserCompanyId(userData.message.employee.company.id);
          setUserCompanyName(userData.message.employee.company.name);
          setUserApprovalStatus(userData.message.employee.isApproved);

          // 2) load applicants, jobs, questions
          await loadApplicants(userData.message.employee.company.id);
          await loadJobs(userData.message.employee.company.id);
          await loadQuestions(userData.message.employee.company.id);
        }
        setCompanyDataLoaded(true);
        toast.remove();
      }
    };

    if (status === "authenticated") {
      getData();
    }
  }, [session, status]);

  if (status === "loading") return <Loader />;
  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  // -----------------------
  //   Data Fetch Helpers
  // -----------------------
  const loadApplicants = async (companyId: string) => {
    try {
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ action: "getApplicants", company: companyId, isSample: false }),
      });
      const data = await res.json();

      // sort by created date ascending
      data.message.sort((a: TestIDInterface, b: TestIDInterface) => {
        const dateA = new Date(a.created);
        const dateB = new Date(b.created);
        return dateA.getTime() - dateB.getTime();
      });

      setApplicants(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const loadQuestions = async (companyId: string) => {
    try {
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ action: "findQuestions", company: companyId }),
      });
      const data = await res.json();
      setQuestions(data.message);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };

  const loadJobs = async (companyId: string) => {
    try {
      toast.loading("Loading jobs...");
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ action: "getCompanyJobs", companyId }),
      });
      toast.remove();
      const data = await res.json();
      setJobs(data.message || []);
    } catch (error) {
      toast.remove();
      console.error("Error loading jobs:", error);
    }
  };

  // -----------------------
  //   Add Single Applicant
  // -----------------------
  const openAddApplicantModal = () => {
    setIsAddApplicantModalOpen(true);
    setNewApplicantForm({ firstName: "", lastName: "", email: "", jobId: "" });
  };

  const closeAddApplicantModal = () => {
    setIsAddApplicantModalOpen(false);
  };

  const handleAddApplicantFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, jobId } = newApplicantForm;
    if (!firstName || !lastName || !email || !jobId) {
      toast.error("Please fill out all fields (including Job).");
      return;
    }

    try {
      toast.loading("Adding candidate...");
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          action: "addApplicant",
          firstName,
          lastName,
          email,
          recruiterEmail: session?.user?.email || "",
          jobId,
          isSample: false,
        }),
      });
      toast.remove();
      if (!res.ok) {
        toast.error("Error adding candidate.");
        return;
      }
      toast.success("Candidate added.");
      await loadApplicants(userCompanyId || "");
      closeAddApplicantModal();
    } catch (err) {
      console.error("Error adding candidate:", err);
      toast.error("Error adding candidate.");
    }
  };

  // -----------------------
  //   CSV Import
  // -----------------------
  const handleCsvImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "text/csv") {
      toast.error("Please upload a valid .csv file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows: any[] = results.data;

        // Build a lookup for existing jobs (name -> id)
        const jobMap = new Map(jobs.map((j) => [j.name.toLowerCase(), j.id]));

        // Transform rows: if job name not found, set jobId=null so user can assign later
        const cleanedApplicants = rows.map((row) => {
          const jobName: string | undefined = row.job || row.Job || row["job name"];
          const normalized = jobName?.toString().trim().toLowerCase() || "";
          return {
            ...row,
            jobId: jobMap.get(normalized) || null,
          };
        });

        try {
          toast.loading("Importing applicants...");
          const res = await fetch("/api/database", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "addApplicants",
              applicants: cleanedApplicants,
              recruiterEmail: session?.user?.email || "",
            }),
          });
          toast.remove();
          if (!res.ok) {
            toast.error("Error importing CSV applicants.");
          } else {
            toast.success("Import complete.");
            await loadApplicants(userCompanyId || "");
          }
        } catch (err) {
          toast.remove();
          toast.error("Error importing CSV applicants.");
        }
      },
    });

    // reset file input so same file can be uploaded again if needed
    setFileInputKey((prev) => prev + 1);
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
          isSample: false,
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
  // -----------------------
  //   Delete multiple
  // -----------------------

  const openDeleteModal = () => setConfirmDeleteModal(true);
  const closeDeleteModal = () => setConfirmDeleteModal(false);

  async function handleDeleteCandidate(candidateId: string) {
    try {
      toast.loading("Deleting candidate...");
      const response = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          action: "deleteApplicants",
          // We only send an array of one with "selected = true" so the backend code sees it
          applicantData: [{ id: candidateId, selected: true }],
        }),
      });
      const data = await response.json();
      toast.remove();

      if (data.message === "Success") {
        toast.success("Candidate deleted.");
        // Reload or re-fetch the applicants so the UI updates
        await loadApplicants(userCompanyId || "");
      } else {
        toast.error(data.message || "Error deleting candidate.");
      }
    } catch (err) {
      toast.remove();
      toast.error("Error deleting candidate.");
      console.error("Error deleting candidate:", err);
    }
  }

  // --------------------------------
  //   The New "Assign Templates" Flow
  // --------------------------------
  const openAssignModal = () => {
    setShowAssignModal(true);
    setSelectedJobForAssign("");
    setSelectedTemplateForAssign("");
    setAssignableCandidates([]);
  };
  const closeAssignModal = () => {
    setShowAssignModal(false);
  };

  // When user picks a job, show all applicants with that job
  const handlePickJob = (jobId: string) => {
    setSelectedJobForAssign(jobId);
    if (!jobId) {
      setAssignableCandidates([]);
      return;
    }
    // filter applicants that match
    const matched = applicants
      .filter((a) => a.jobId === jobId)
      .map((a) => ({ ...a, selected: true })); // default all selected = true
    setAssignableCandidates(matched);
  };

  // Actually assign the chosen template to the selected candidates
  const handleAssignTests = async () => {
    if (!selectedTemplateForAssign) {
      toast.error("Please pick a template.");
      return;
    }
    if (!selectedJobForAssign) {
      toast.error("Please pick a job.");
      return;
    }
    const finalArray = assignableCandidates.filter((c) => c.selected);
    if (finalArray.length === 0) {
      toast.error("No candidates selected for assignment.");
      return;
    }
    toast.loading("Assigning tests...");
    try {
      const res = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          action: "assignTemplate",
          applicantData: finalArray, // pass only the selected ones
          template: selectedTemplateForAssign,
          company: userCompanyName,
        }),
      });
      toast.remove();
      const data = await res.json();
      if (data.message === "Success") {
        toast.success("Tests assigned & sent!");
        await loadApplicants(userCompanyId || "");
        closeAssignModal();
      } else {
        toast.error(data.message || "Error assigning tests.");
      }
    } catch (err) {
      console.error("Error assigning tests:", err);
      toast.error("Failed to assign tests.");
    }
  };

  // -----------------------
  //   Color-coded statuses
  // -----------------------
  function getStatusClass(status: string) {
    // if it's "Sent" => text-white
    // if it's "Unsent" or "Expired" => text-red-500
    // if it's "Submitted" => text-green-500
    switch (status) {
      case "Sent":
        return "text-white";
      case "Submitted":
        return "text-green-500";
      case "Unsent":
      case "Expired":
      default:
        return "text-red-500";
    }
  }

  // -----------------------
  //   Pagination
  // -----------------------
  const totalPages = Math.ceil(applicants.length / applicantsPerPage);
  const displayedApplicants = applicants.slice(
    (currentPage - 1) * applicantsPerPage,
    currentPage * applicantsPerPage
  );

  // Toggle "View Details" for a candidate
  const toggleExpand = (candidateId: string) => {
    setExpandedCandidateId((prev) =>
      prev === candidateId ? null : candidateId
    );
  };

  // --------------------------------
  //   Rendering
  // --------------------------------
  if (!companyDataLoaded) {
    return (
      <div className="text-white flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  if (!userApprovalStatus) {
    return (
      <div className="p-6 flex justify-center items-center flex-col w-full text-center">
        <div className="bg-gradient-to-b from-indigo-600 to-transparent w-full rounded-xl p-6 py-20 mb-20"></div>
        <h1 className="text-2xl font-semibold">
          Welcome to the Candidate Manager!
        </h1>
        <p className="text-slate-400 mt-2">
          To get started, please join a company in the Company Profile tab.
        </p>
        <motion.button
          className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100 mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          onClick={() => router.push("/companyProfile")}
        >
          Join a company
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
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-screen text-white flex overflow-x-hidden">
        <Sidebar />
        <div className="bg-slate-950 flex-1 p-6">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between items-start sm:items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Candidate Manager</h1>
              <p className="text-sm text-slate-400">
                Add your applicants, then “Assign Templates” to send them tests.
              </p>
            </div>
            <div className="flex gap-3 mt-2 sm:mt-0">
              <button
                className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg hover:bg-slate-800 text-sm"
                onClick={openAddApplicantModal}
              >
                Add Candidate
              </button>
              <button
                className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg hover:bg-slate-800 text-sm"
                onClick={openAssignModal}
              >
                Assign Templates
              </button>
              <label
                htmlFor="csvInput"
                className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg hover:bg-slate-800 text-sm cursor-pointer"
              >
                Import CSV
              </label>
              <input
                id="csvInput"
                type="file"
                accept=".csv"
                onChange={handleCsvImport}
                key={fileInputKey}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Applicant List (no search/filter) */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            {applicants.length === 0 ? (
              <p className="text-slate-400">No applicants found.</p>
            ) : (
              <>
                <ul className="flex flex-col gap-2">
                  {displayedApplicants.map((app) => {
                    const isExpanded = expandedCandidateId === app.id;
                    return (
                      <li
                        key={app.id}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="font-semibold text-sm">
                              {app.firstName} {app.lastName}
                            </h2>
                            {/* Color-coded status */}
                            <p
                              className={`text-xs mt-1 ${getStatusClass(
                                app.status
                              )}`}
                            >
                              Status: {app.status}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteCandidate(app.id)}
                              className="text-xs underline hover:text-red-400"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => toggleExpand(app.id)}
                              className="text-xs underline hover:text-slate-300"
                            >
                              {isExpanded ? "Hide Details" : "View Details"}
                            </button>
                          </div>
                        </div>

                        {/* Expanded details section */}
                        {isExpanded && (
                          <motion.div
                            className="mt-3 bg-slate-900 border border-slate-700 rounded-md p-3 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-slate-400 mb-1">
                              <strong>Email:</strong> {app.email}
                            </p>
                            <p className="text-slate-400 mb-1">
                              <strong>Job:</strong>{" "}
                              {app.jobId
                                ? jobs.find((j) => j.id === app.jobId)?.name ||
                                  app.jobId
                                : "No job assigned"}
                            </p>
                            <p className="text-slate-400 mb-1">
                              <strong>Created:</strong>{" "}
                              {new Date(app.created).toLocaleString()}
                            </p>
                            {app.template && (
                              <p className="text-slate-400 mb-1">
                                <strong>Template:</strong> {app.template.title}
                              </p>
                            )}
                            {app.expirationDate && (
                              <p className="text-slate-400 mb-1">
                                <strong>Expiration:</strong>{" "}
                                {new Date(app.expirationDate).toLocaleString()}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Pagination */}
                <div className="flex gap-2 justify-center mt-4">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-full ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/*  ADD APPLICANT MODAL  */}
      <AnimatePresence>
        {isAddApplicantModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleAddApplicantFormSubmit}
              className="bg-slate-900 p-6 border border-slate-800 rounded-xl w-full max-w-md relative flex flex-col gap-3"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                type="button"
                onClick={closeAddApplicantModal}
                className="absolute top-4 right-4 bg-slate-700 p-1 rounded-full"
              >
                <Image
                  src={Plus}
                  width={14}
                  height={14}
                  alt="Close"
                  className="rotate-45"
                />
              </button>
              <h2 className="text-xl font-semibold">Add Candidate</h2>

              <div>
                <label className="text-sm block mb-1">First Name:</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 p-2 rounded-lg"
                  value={newApplicantForm.firstName}
                  onChange={(e) =>
                    setNewApplicantForm((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Last Name:</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 p-2 rounded-lg"
                  value={newApplicantForm.lastName}
                  onChange={(e) =>
                    setNewApplicantForm((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Email:</label>
                <input
                  type="email"
                  className="w-full bg-slate-800 p-2 rounded-lg"
                  value={newApplicantForm.email}
                  onChange={(e) =>
                    setNewApplicantForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm block mb-1">Assign Job:</label>
                {jobs.length > 0 ? (
                  <select
                    className="w-full bg-slate-800 p-2 rounded-lg"
                    value={newApplicantForm.jobId}
                    onChange={(e) =>
                      setNewApplicantForm((prev) => ({
                        ...prev,
                        jobId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select a job...</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-slate-400">
                    No jobs found. Please create one first.
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-600 px-4 py-2 rounded-lg mt-4 self-end"
              >
                Add
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/*  ASSIGN TEMPLATES MODAL  */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 p-6 border border-slate-800 rounded-xl w-full max-w-xl flex flex-col gap-3 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-4 right-4 bg-slate-700 p-1 rounded-full"
                onClick={closeAssignModal}
              >
                <Image
                  src={Plus}
                  width={14}
                  height={14}
                  alt="Close"
                  className="rotate-45"
                />
              </button>

              <h2 className="text-xl font-semibold mb-2">Assign Templates</h2>
              <p className="text-sm text-slate-400 mb-3">
                Pick a job, then pick a template, then select which candidates
                receive it.
              </p>

              {/* Step 1: Pick Job */}
              <label className="text-sm" htmlFor="pickJob">
                1) Choose Job:
              </label>
              <select
                id="pickJob"
                className="bg-slate-800 border border-slate-700 p-2 rounded-lg mb-3"
                value={selectedJobForAssign}
                onChange={(e) => {
                  handlePickJob(e.target.value);
                }}
              >
                <option value="">-- Select Job --</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                ))}
              </select>

              {/* Step 2: Show the candidates that have this job, pick who gets the test */}
              {selectedJobForAssign && (
                <>
                  <p className="text-sm text-slate-400">
                    Candidates for this Job:
                  </p>
                  {assignableCandidates.length > 0 ? (
                    <ul className="max-h-40 overflow-y-auto border border-slate-700 rounded-lg p-2 mb-3">
                      {assignableCandidates.map((cand) => (
                        <li
                          key={cand.id}
                          className="flex items-center gap-2 text-sm mb-1"
                        >
                          <input
                            type="checkbox"
                            checked={cand.selected}
                            onChange={() => {
                              setAssignableCandidates((prev) =>
                                prev.map((x) =>
                                  x.id === cand.id
                                    ? { ...x, selected: !x.selected }
                                    : x
                                )
                              );
                            }}
                          />
                          <span>
                            {cand.firstName} {cand.lastName} ({cand.email})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 mb-3">
                      No candidates found for this job.
                    </p>
                  )}

                  {/* Step 3: Pick Template */}
                  <label className="text-sm" htmlFor="pickTemplate">
                    2) Choose Template:
                  </label>
                  <select
                    id="pickTemplate"
                    className="bg-slate-800 border border-slate-700 p-2 rounded-lg mb-4"
                    value={selectedTemplateForAssign}
                    onChange={(e) =>
                      setSelectedTemplateForAssign(e.target.value)
                    }
                  >
                    <option value="">-- Select Template --</option>
                    {questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title}
                      </option>
                    ))}
                  </select>

                  {/* Step 4: Confirm Button */}
                  <button
                    className="bg-indigo-600 py-2 px-4 rounded-lg"
                    onClick={handleAssignTests}
                  >
                    Assign &amp; Send
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      {/* <AnimatePresence>
        {confirmDeleteModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950 bg-opacity-60 p-6 backdrop-blur-sm flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 p-6 border border-slate-800 rounded-xl w-full max-w-md flex flex-col gap-3"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-semibold mb-2">Delete Selected?</h2>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete all selected candidates?
              </p>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  className="bg-red-600 px-4 py-2 rounded-lg"
                  onClick={handleDeleteSelected}
                >
                  Delete
                </button>
                <button
                  className="bg-slate-700 px-4 py-2 rounded-lg"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </>
  );
};

export default Applicants;
