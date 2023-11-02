"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import Dropdown from "../../public/assets/icons/dropdown.svg";
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

const Applicants = () => {
  interface ApplicantDataInterface {
    name: string;
    email: string;
    status: string;
    selected: boolean;
  }

  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [showOptionsIndex, setShowOptionsIndex] = useState("");
  const [applicantData, setApplicantData] = useState<
    Array<ApplicantDataInterface>
  >([]);

  useEffect(() => {
    // Populate applicantData
    const data: ApplicantDataInterface[] = [
      {
        name: "Tyler Haisman",
        email: "mail@example.com",
        status: "Sent",
        selected: false,
      },
      {
        name: "Daniel Lai",
        email: "mail@example.com",
        status: "Expired",
        selected: false,
      },
      {
        name: "David Noguera",
        email: "mail@example.com",
        status: "Awaiting Review",
        selected: false,
      },
      {
        name: "Matthew Jung",
        email: "mail@example.com",
        status: "Reviewed",
        selected: false,
      },
      {
        name: "Blake Rand",
        email: "mail@example.com",
        status: "Sent",
        selected: false,
      },
    ];

    setApplicantData(data);
  }, []);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetch = async () => {
      if (session) {
        console.log("Hello world!");

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
            <ul className="flex gap-6 items-center">
              <li className="">
                <div className="flex gap-2 items-center text-gray-500 relative">
                  <input
                    type="checkbox"
                    className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                  />
                  <p>Select all</p>
                </div>
              </li>
              <li className="">
                <button className="bg-indigo-600 rounded-lg flex p-1 px-2 justify-center items-center m-auto">
                  Clear selected
                </button>
              </li>
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
                        className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                      />
                      <div className="">
                        <h1 className="text-base">{item.name}</h1>
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
                      {item.status == "Awaiting Review" && (
                        <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <p className="text-sm">Awaiting Review</p>
                        </div>
                      )}
                      {item.status == "Reviewed" && (
                        <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          <p className="text-sm">Reviewed</p>
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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0,
                          ease: "backOut",
                        }}
                      >
                        <p className="text-sm">View Interview Interface</p>
                      </motion.li>
                      <motion.li
                        className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100"
                        onClick={() => toast.success("Email address copied.")}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0,
                          ease: "backOut",
                        }}
                      >
                        <p className="text-sm">Copy Email Address</p>
                      </motion.li>
                      <motion.li
                        className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100"
                        onClick={() => toast.success("Interview resent.")}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
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
