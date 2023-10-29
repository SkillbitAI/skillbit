"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";

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

const Sidebar = () => {
  const path = usePathname();

const router = useRouter();

  return (
    <>
      <div className="bg-slate-800 h-screen border-slate-700 border-r w-72">
        <div className="fixed bg-slate-800 h-screen border-slate-700 border-r w-72 p-6">
          <div className="flex items-center gap-2">
            <Image
              src={Logo}
              alt=""
              width={110}
              height={110}
              style={{ margin: "-30px" }}
            ></Image>
            <h1 className="text-white text-3xl">Skillbit</h1>
          </div>
          <div className="flex flex-col justify-between mt-6 gap-2 absolute top-16 bottom-6 left-6 right-6 overflow-y-auto">
            <ul className="list-none text-white flex flex-col gap-2">
              {path == "/dashboard" && (
                <li className="p-2 rounded-lg flex items-center gap-2 bg-indigo-600 text-white shadow-lg">
                  <Image
                    src={DashboardIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Dashboard</p>
                </li>
              )}
              {path != "/dashboard" && (
                <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100">
                  <Image
                    src={DashboardIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Dashboard</p>
                </li>
              )}
              {path == "/applicants" && (
                <li className="p-2 rounded-lg flex items-center gap-2 bg-indigo-600 text-white shadow-lg">
                  <Image
                    src={ApplicantsIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Applicants</p>
                </li> 
              )}
              {path != "/applicants" && (
                <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100" onClick={() => router.push('/applicants')}>
                  <Image
                    src={ApplicantsIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Applicants</p>
                </li>
              )}
              {path == "/companyProfile" && (
                <li className="p-2 rounded-lg flex items-center gap-2 bg-indigo-600 text-white shadow-lg">
                  <Image
                    src={CompanyIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Company Profile</p>
                </li>
              )}
              {path != "/companyProfile" && (
                <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100" onClick={() => router.push('/companyProfile')}>
                  <Image
                    src={CompanyIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Company Profile</p>
                </li>
              )}
              {path == "/questionWorkshop" && (
                <li className="p-2 rounded-lg flex items-center gap-2 bg-indigo-600 text-white shadow-lg">
                  <Image
                    src={WorkshopIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Question Workshop</p>
                </li>
              )}
              {path != "/questionWorkshop" && (
                <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 duration-100" onClick={() => router.push('/questionWorkshop')}>
                  <Image
                    src={WorkshopIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Question Workshop</p>
                </li>
              )}
            </ul>
            <ul className="list-none text-white flex flex-col gap-2">
              <hr className="border-t border-slate-700" />
              <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-white hover:bg-opacity-10 duration-100">
                <Image src={SupportIcon} alt="" width={25} height={25}></Image>
                <p>Contact Support</p>
              </li>
              <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-white hover:bg-opacity-10 duration-100">
                <Image src={SettingsIcon} alt="" width={25} height={25}></Image>
                <p>Manage Account</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
