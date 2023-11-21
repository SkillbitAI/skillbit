"use client";

import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";
import Papa from "papaparse";

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
import { Toaster, toast } from "react-hot-toast";
import FilterIcon from "../../public/assets/icons/filter.svg";

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

const Applicants = () => {
  interface ApplicantDataInterface {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    score: string;
    selected: boolean;
  }

  useEffect(() => {
    getApplicants();
  }, []);

  const getApplicants = async () => {
    //getting applicants from the database
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getApplicants",
        }),
      });
      const data = await response.json();
      console.log(data);
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
          ...(row as Omit<
            ApplicantDataInterface,
            "status" | "score" | "selected"
          >),
          status: "Expired",
          score: "90%",
          selected: false,
        }));
        await updateApplicants(combinedData);
      },
      header: true,
    });
  };

  const updateApplicants = async (applicants: any) => {
    try {
      toast.loading("Importing applicants...");
      const response = await fetch("/api/codeEditor/createTestID", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          applicants: applicants,
        }),
      });
      if (!response.ok) {
        toast.remove();
        toast.error("Error loading applicants.");
        console.error("Error setting applicants!");
      } else {
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
  const [applicantData, setApplicantData] = useState<
    Array<ApplicantDataInterface>
  >([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    const updatedData = applicantData.map((item) => ({
      ...item,
      selected: !selectAll,
    }));
    setApplicantData(updatedData);
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetch = async () => {
      if (session) {
        // console.log("Hello world!");
        //other than print hello world, set user data here
      }
    };
    if (status === "authenticated") {
      fetch();
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
          <TopMenuBar></TopMenuBar>
          {/* Applicants content */}
          <div className="p-6">
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
                <hr className="border-l border-slate-800 h-5" />
                <li className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative">
                  <p className="text-sm flex gap-2 items-center justify-center">
                    Clear Selected
                  </p>
                </li>
                <li className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative">
                  <p className="text-sm flex gap-2 items-center justify-center">
                    Clear Failed
                  </p>
                </li>
              </div>
              <div className="flex gap-3 items-center justify-center">
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
                        <p className="text-sm">Failed</p>
                      </li>
                      <li className="flex gap-3 items-center justify-center  w-max">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        <p className="text-sm">Passed</p>
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
            <ul className="flex flex-col gap-2 mt-6">
              {applicantData.map((item, index) => (
                <li
                  key={index}
                  className={
                    showOptionsIndex == index.toString()
                      ? "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 items-center justify-between border border-slate-800 duration-100 hover:cursor-pointer"
                      : "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 items-center justify-between hover:bg-slate-800 border border-slate-800 duration-100 hover:cursor-pointer"
                  }
                  onClick={
                    showOptionsIndex == index.toString()
                      ? () => setShowOptionsIndex("")
                      : () => setShowOptionsIndex(index.toString())
                  }
                >
                  <div className="flex gap-3 items-center justify-between w-full">
                    <div className="flex gap-6 items-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onClick={(e) => {
                          e.stopPropagation();
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
                        <p className="text-gray-500 text-sm">{item.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center justify-center">
                      {item.status == "Sent" && (
                        <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          <p className="text-sm">Sent</p>
                        </div>
                      )}
                      {item.status == "Failed" && (
                        <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <p className="text-sm">Failed | {item.score}</p>
                        </div>
                      )}
                      {item.status == "Passed" && (
                        <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          <p className="text-sm">Passed | {item.score}</p>
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
                    <ul
                      className="flex gap-3 border-t w-full pt-3 border-t-slate-800 hover:cursor-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.li
                        className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: 0,
                          ease: "backOut",
                        }}
                      >
                        <p className="text-sm">View Interview Interface</p>
                      </motion.li>
                      <motion.li
                        className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100"
                        onClick={() => toast.success("Email address copied.")}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: 0,
                          ease: "backOut",
                        }}
                      >
                        <p className="text-sm">Copy Email Address</p>
                      </motion.li>
                      <motion.li
                        className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100"
                        onClick={() => toast.success("Interview resent.")}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: 0,
                          ease: "backOut",
                        }}
                      >
                        <p className="text-sm">Resend Interview</p>
                      </motion.li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Applicants;
