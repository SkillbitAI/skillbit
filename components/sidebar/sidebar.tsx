"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Loader from "../loader/loader";
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
import SettingsIcon from "../../public/assets/icons/settings.svg";
import LogoutIcon from "../../public/assets/icons/logout.svg";
import { m } from "framer-motion";

const Sidebar = () => {
  const path = usePathname();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.loading("Looking for questions...");
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
        setName(userData.message.firstName + " " + userData.message.lastName);
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
      <div className="bg-slate-900 h-screen border-slate-800 border-r w-72">
        <div className="fixed bg-slate-900 h-screen border-slate-800 border-r w-72">
          <div className="flex items-center gap-2 m-6">
            <Image
              src={Logo}
              alt=""
              width={110}
              height={110}
              style={{ margin: "-30px" }}
            ></Image>
            <h1 className="text-white text-3xl">Skillbit</h1>
          </div>
          <div className="flex flex-col justify-between mt-6 gap-2 absolute top-16 bottom-6 left-0 right-0 overflow-y-auto">
            <ul className="list-none text-white flex flex-col gap-6">
              <div className="flex-1 max-w-xl bg-slate-800 p-2 rounded-lg flex justify-between border border-slate-700 mx-6">
                <input
                  className="text-white bg-transparent focus:outline-none w-full placeholder:text-white text-ellipsis"
                  placeholder="Search..."
                ></input>
                <Image src={SearchIcon} alt="" width={25} height={25}></Image>
              </div>
              <hr className="border-t border-slate-800" />
              <li
                className={
                  path == "/dashboard"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/dashboard")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/dashboard" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={DashboardIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Dashboard</p>
                </div>
              </li>
              <li
                className={
                  path == "/applicants"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/applicants")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/applicants" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={ApplicantsIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Applicants</p>
                </div>
              </li>
              <li
                className={
                  path == "/questionWorkshop"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/questionWorkshop")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/questionWorkshop" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={WorkshopIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Question Workshop</p>
                </div>
              </li>
              <li
                className={
                  path == "/companyProfile"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/companyProfile")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/companyProfile" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={CompanyIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Company Profile</p>
                </div>
              </li>
            </ul>
            <ul className="list-none text-white flex flex-col gap-6 mt-4">
              <li
                className={
                  path == "/manageAccount"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/manageAccount")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/manageAccount" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={QuestionIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Support</p>
                </div>
              </li>
              <li
                className={
                  path == "/manageAccount"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/manageAccount")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/manageAccount" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={SettingsIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Settings</p>
                </div>
              </li>
              <li
                className={
                  "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => signOut()}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/manageAccount" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image src={LogoutIcon} alt="" width={25} height={25}></Image>
                  <p>Log Out</p>
                </div>
              </li>
              <hr className="border-t border-slate-800" />
              <div className="mx-6 flex gap-2 items-center">
                <div className=" rounded-full p-1">
                  <Image
                    src={ProfileIcon}
                    width={35}
                    height={35}
                    alt="Profile"
                  ></Image>
                </div>
                <div className="">
                  <h2>{name}</h2>
                  <p className="text-white opacity-50">{email}</p>
                </div>
              </div>
              {/* <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-white hover:bg-opacity-10 duration-100">
                <Image src={SupportIcon} alt="" width={25} height={25}></Image>
                <p>Contact Support</p>
              </li>
              <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-white hover:bg-opacity-10 duration-100">
                <Image src={SettingsIcon} alt="" width={25} height={25}></Image>
                <p>Manage Account</p>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
