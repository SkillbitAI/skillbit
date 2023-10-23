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
          <div className="bg-slate-800 border-b border-slate-700 flex justify-between p-3">
            <div className="flex-1 max-w-xl bg-white bg-opacity-5 p-2 rounded-lg flex justify-between border border-slate-700">
              <input
                className="text-white bg-transparent focus:outline-none w-full placeholder:text-white"
                placeholder="Search Anything..."
              ></input>
              <Image src={SearchIcon} alt="" width={25} height={25}></Image>
            </div>
            <div className="flex-1 flex justify-end gap-1">
              <div className="flex">
                <Image src={QuestionIcon} alt="" width={25} height={25}></Image>
              </div>
              <div className="relative flex">
                <Image
                  src={ProfileIcon}
                  alt=""
                  width={25}
                  height={25}
                  onClick={() => {
                    if (accountMenuVisible) {
                      setAccountMenuVisible(false);
                    } else {
                      setAccountMenuVisible(true);
                    }
                  }}
                ></Image>
                {/* Account Menu */}
                {accountMenuVisible && (
                  <motion.ul
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: 0,
                      ease: "backOut",
                      delayChildren: 0.2,
                    }}
                    className="absolute top-12 right-0 bg-slate-800 bg-opacity-60 backdrop-blur-lg rounded-lg border border-slate-700 p-2 flex flex-col gap-2"
                  >
                    <li className="p-3 hover:bg-slate-700 rounded-lg duration-100 w-max">
                      <p>Manage Account</p>
                      <p className="text-xs text-gray-500">
                        {" "}
                        {session?.user?.email}
                      </p>
                    </li>
                    <li
                      onClick={() => signOut()}
                      className="p-3 hover:bg-slate-700 rounded-lg duration-100"
                    >
                      Logout
                    </li>
                  </motion.ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
