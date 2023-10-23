"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Sidebar from "@/components/sidebar/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

const Dashboard = () => {
  const path = usePathname();
  const router = useRouter();

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
    return (
      <div className="graphPaper bg-slate-900 text-white h-screen w-screen flex items-center justify-center flex-col">
        {/* LOGO */}
        <div className="flex">
          <motion.div
            className="w-12 h-12 bg-white rounded-xl rotate-45 -mr-1"
            // initial={{ opacity: 0, y: 200, rotate: 0, scale: 0 }}
            // animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
            // transition={{ duration: 1, delay: 0, ease: "backOut" }}
          ></motion.div>
          <motion.div
            className="w-12 h-12 bg-white rounded-xl rotate-45 -ml-1"
            // initial={{ opacity: 0, y: -200, rotate: 0, scale: 0 }}
            // animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
            // transition={{ duration: 1, delay: 0.2, ease: "backOut" }}
          ></motion.div>
        </div>
        <motion.p
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mt-10"
        >
          Loading...
        </motion.p>
      </div>
    );
  }
  if (status === "unauthenticated") {
    router.push("/auth");
    return;
  }
  return (
    <>
      <div className="max-w-screen text-white flex">
        <Sidebar></Sidebar>
        <div className="bg-slate-900 flex-1">
          <div className="bg-slate-800 border-b border-slate-700 flex justify-between p-3">
            <div className="flex-1 max-w-xl bg-white bg-opacity-5 p-2 rounded-lg flex justify-between border border-slate-700">
              <input
                className="text-white bg-transparent focus:outline-none w-full placeholder:text-white"
                placeholder="Search Anything..."
              ></input>
              <Image src={SearchIcon} alt="" width={25} height={25}></Image>
            </div>
            <div className="flex-1 flex justify-end gap-1">
              <Image src={QuestionIcon} alt="" width={25} height={25}></Image>
              <Image
                onClick={() => signOut()}
                src={ProfileIcon}
                alt=""
                width={25}
                height={25}
              ></Image>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
