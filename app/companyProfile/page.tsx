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

const CompanyProfile = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);

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
        <div className="bg-slate-900 flex-1">
          <TopMenuBar></TopMenuBar>
          {/* Dashboard content */}
          <div className=""></div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;
