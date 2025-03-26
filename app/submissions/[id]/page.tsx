/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-async-client-component */
// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CodeRunner from "./CodeRunner";
import Dropdown from "../../../public/assets/icons/dropdown.svg";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader/loader";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "@/components/sidebar/sidebar";

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

interface GradingInsights {
  totalScore: number;
  correctness: GradingInsightsCategory;
  efficiency: GradingInsightsCategory;
  codeStyle: GradingInsightsCategory;
  problemSolvingApproach: GradingInsightsCategory;
  edgeCaseHandling: GradingInsightsCategory;
  clarity: GradingInsightsCategory;
}

interface GradingInsightsCategory {
  score: number;
  explanation: string;
}

export default function Submissions({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [gradingInsights, setGradingInsights] = useState<GradingInsights>();

  const [email, setEmail] = useState("");
  const [userCompanyName, setUserCompanyName] = useState<string | null>(null);
  const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  const [candidate, setCandidate] = useState<TestIDInterface>();
  // Track expanded details for each candidate
  const [isExpanded, setIsExpanded] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      const gradingInsightsString =
        localStorage.getItem("gradingInsights") || "";

      const gradingInsightsParsed = JSON.parse(gradingInsightsString);
      gradingInsightsParsed.data.response = JSON.parse(
        gradingInsightsParsed.data.response
      );

      const gradingInsightsSimplified =
        gradingInsightsParsed.data.response.response[0];

      console.log("gradingInsightsSimplified:", gradingInsightsSimplified);

      const gradingInsightsSetup: GradingInsights = {
        totalScore: gradingInsightsSimplified.total_score,
        correctness: {
          score: gradingInsightsSimplified.correctness[0].score,
          explanation: gradingInsightsSimplified.correctness[0].explanation,
        },
        efficiency: {
          score: gradingInsightsSimplified.efficiency[0].score,
          explanation: gradingInsightsSimplified.efficiency[0].explanation,
        },
        codestyle: {
          score: gradingInsightsSimplified.codestyle[0].score,
          explanation: gradingInsightsSimplified.codestyle[0].explanation,
        },
        problemsolvingapproach: {
          score: gradingInsightsSimplified.problemsolvingapproach[0].score,
          explanation:
            gradingInsightsSimplified.problemsolvingapproach[0].explanation,
        },
        edgecasehandling: {
          score: gradingInsightsSimplified.edgecasehandling[0].score,
          explanation:
            gradingInsightsSimplified.edgecasehandling[0].explanation,
        },
        clarity: {
          score: gradingInsightsSimplified.clarity[0].score,
          explanation: gradingInsightsSimplified.clarity[0].explanation,
        },
      };

      console.log(gradingInsightsSetup);

      setGradingInsights(gradingInsightsSetup);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    getTestIdData();
  }, []);

  const getTestIdData = async () => {
    try {
      const testResponse = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "getTestById",
          id: params.id,
        }),
      });

      const testData = await testResponse.json();
      console.log("Test data response:", testData);
      setCandidate(testData.message);

      if (!testData.message) {
        console.log("No test data found, redirecting to /not-found");
        router.push("/not-found");
        return;
      }
    } catch (error) {
      console.error("Error fetching testID:", error);
      toast.error("Error fetching testID.");
    }
  };

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

          await loadJobs(userData.message.employee.company.id);
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

  return (
    <>
      <div className="max-w-screen text-white flex overflow-x-hidden max-h-screen overflow-y-hidden">
        {/* <Sidebar></Sidebar> */}
        <div className="p-6 bg-slate-950 flex gap-6 flex-1">
          <div className="flex-[1.5] relative rounded-lg border border-slate-800 overflow-hidden">
            <CodeRunner id={params.id}></CodeRunner>
          </div>
          <div className="flex-[0.5] flex flex-col gap-6">
            <div className="">
              <h1 className="">Grading Insights</h1>
              {candidate && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-2 items-center justify-center bg-slate-900 px-3 py-1 rounded-full border border-slate-800 w-fit text-xs">
                    {candidate.status == "Sent" && (
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    )}
                    {candidate.status == "Not Sent" && (
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                    {candidate.status == "Expired" && (
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    )}
                    {candidate.status != "Sent" &&
                      candidate.status != "Not Sent" &&
                      candidate.status != "Expired" && (
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      )}
                    {candidate.status}
                  </div>
                  <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cursor-pointer relative flex gap-2 items-center justify-center bg-slate-900 px-3 py-1 rounded-full border border-slate-800 w-fit text-xs"
                  >
                    View Candidate Details
                    <Image
                      src={Dropdown}
                      alt="Dropdown menu arrow"
                      width={15}
                      height={15}
                      className={
                        isExpanded
                          ? "rotate-0 opacity-25 duration-100"
                          : "-rotate-90 opacity-25 duration-100"
                      }
                    ></Image>
                    {isExpanded && (
                      <div className="absolute bg-slate-900 border border-slate-800 p-6 top-10 rounded-lg right-0">
                        <p className="text-slate-400 mb-1 flex gap-2 items-center">
                          <p>Test ID:</p>
                          <p className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white">
                            {candidate.id}
                          </p>
                        </p>
                        <p className="text-slate-400 mb-1 flex gap-2 items-center">
                          <p>Email:</p>
                          <p className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white">
                            {candidate.email}
                          </p>
                        </p>
                        <p className="text-slate-400 mb-1 flex gap-2 items-center">
                          <p>Job:</p>
                          <p className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white">
                            {candidate.jobId
                              ? jobs.find((j) => j.id === candidate.jobId)
                                  ?.name || candidate.jobId
                              : "No job assigned"}
                          </p>
                        </p>
                        <p className="text-slate-400 mb-1 flex gap-2 items-center">
                          <p>Created:</p>
                          <p className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white">
                            {new Date(candidate.created).toLocaleString()}
                          </p>
                        </p>
                        {candidate.template && (
                          <p className="text-slate-400 mb-1 flex gap-2 items-center">
                            <p>Template:</p>
                            <p className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white">
                              {candidate.template.title}
                            </p>
                          </p>
                        )}
                        {candidate.expirationDate && (
                          <p className="text-slate-400 mb-1 flex gap-2 items-center">
                            <p>Expiration:</p>{" "}
                            <p className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white">
                              {new Date(
                                candidate.expirationDate
                              ).toLocaleString()}
                            </p>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <h1 className="">Total score: {gradingInsights?.totalScore}</h1>
            <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col gap-6">
              {gradingInsights &&
                Object.keys(gradingInsights)
                  .filter((key) => key !== "totalScore") // Exclude totalScore
                  .map((key) => (
                    <div key={key}>
                      <h1>{key}</h1>
                      <p>Score: {gradingInsights[key].score}</p>
                      <p>Explanation: {gradingInsights[key].explanation}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
