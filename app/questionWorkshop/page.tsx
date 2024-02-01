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
import Dots from "../../public/assets/icons/dots.svg";
import Plus from "../../public/assets/icons/plus.svg";

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

const QuestionWorkshop = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        // console.log("Hello world!");
        //other than print hello world, set user data here
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
          <TopMenuBar></TopMenuBar>
          {/* Dashboard content */}
          <div className="p-6 flex gap-6">
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 w-64">
              <div className="flex justify-between items-center mb-3">
                <h1>Templates</h1>
                <div className="hover:bg-slate-700 cursor-pointer rounded-xl p-3">
                  <Image src={Plus} width={14} height={14} alt=""></Image>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-3 hover:bg-slate-700 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer">
                  Question 1
                  <Image src={Dots} alt="" width={14} height={14}></Image>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-slate-700 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer">
                  Question 2
                  <Image src={Dots} alt="" width={14} height={14}></Image>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-slate-700 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer">
                  Question 3
                  <Image src={Dots} alt="" width={14} height={14}></Image>
                </div>
              </div>
            </div>
            <div className="border-l border-slate-900 pl-6">
              <div className="">
                <h2>Question type</h2>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    Debugging challenge
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    Data Structures challenge
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    Algorithmic challenge
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    Coding puzzle
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    Real-world problem
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h2>Programming language/framework</h2>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    React JS (Javascript)
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    React JS (TypeScript)
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    C++
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    Java
                  </div>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-3">
                    SQL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionWorkshop;
