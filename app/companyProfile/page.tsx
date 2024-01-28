"use client";

import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Toaster, toast } from "react-hot-toast";

interface Company {
  id: string;
  name: string;
}

const CompanyProfile = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [userCompanyName, setUserCompanyName] = useState(null);
  const [userCompanyId, setUserCompanyId] = useState(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [joinCompany, setJoinCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [newCompanyButton, setNewCompanyButton] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  const findCompanies = async () => {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "findCompanies",
      }),
    });
    const data = await response.json();
    setCompanies(data.message);
  };

  const handleCompanyEnroll = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (
      newCompanyName == "" ||
      newCompanyName == null ||
      newCompanyName == undefined
    ) {
      toast.remove();
      toast.error('Please fill in the "Company Name" field.');
      setIsLoading(false);
    } else {
      console.log(newCompanyName);
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "addCompany",
          email: email,
          company: newCompanyName,
        }),
      });
      setIsLoading(false);
      toast.remove();
      toast.success("Company added!");
      location.reload();
    }
  };

  const handleJoinCompany = async (companyId: string) => {
    toast.loading("Joining company...");
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "joinCompany",
        email: email,
        company: companyId,
      }),
    });
    location.reload();
  };

  const handleLeaveCompany = async (companyId: string) => {
    toast.loading("Leaving company...");
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "leaveCompany",
        email: email,
        company: companyId,
      }),
    });
    location.reload();
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.loading("Looking for company...");
        // console.log("Hello world!");
        //other than print hello world, set user data here
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
        console.log(userData.message.email);
        setEmail(userData.message.email);

        //getting user company information
        const companyResponse = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "findCompanyById",
            id: userData.message.companyID,
          }),
        });
        const companyData = await companyResponse.json();
        if (companyData.message.name && companyData.message.id) {
          setUserCompanyName(companyData.message.name);
          setUserCompanyId(companyData.message.id);
        }
        await findCompanies();
        setCompanyDataLoaded(true);
        toast.remove();
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
      <Toaster position="top-right"></Toaster>
      <div className="max-w-screen text-white flex overflow-x-hidden">
        <Sidebar></Sidebar>
        <div className="bg-slate-950 flex-1">
          <TopMenuBar></TopMenuBar>
          {/* Dashboard content */}
          <div className="p-6 relative">
            {!companyDataLoaded && (
              <div className="flex justify-center items-center scale-150 mt-6">
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            {companyDataLoaded && (!userCompanyName || !userCompanyId) && (
              <div className="bg-slate-900 m-auto rounded-xl p-6 flex justify-center items-center flex-col border border-slate-800">
                {/* NEW COMPANY MENU */}
                {newCompanyButton && (
                  <div className="fixed left-0 right-0 bottom-0 top-0 z-50 flex justify-center items-center flex-col gap-3 bg-slate-950 bg-opacity-60 p-6">
                    <button
                      className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center gap-2 mt-3"
                      onClick={() => setNewCompanyButton(false)}
                    >
                      <Image
                        src={Plus}
                        width={14}
                        height={14}
                        className="rotate-45"
                        alt="Exit"
                      ></Image>
                    </button>
                    <form
                      className="bg-slate-900 p-6 rounded-xl"
                      onSubmit={handleCompanyEnroll}
                    >
                      <h1>Add your company</h1>
                      <p className="mb-6">
                        If your company is not a part of Skillbit, enroll here!
                      </p>
                      <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
                      >
                        Company Name
                      </motion.p>
                      <motion.input
                        type="text"
                        placeholder="Skillbit"
                        className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                      />
                      <motion.button
                        className="mt-3 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
                      >
                        {!isLoading && (
                          <>
                            Enroll{" "}
                            <div className=" arrow flex items-center justify-center">
                              <div className="arrowMiddle"></div>
                              <div>
                                <Image
                                  src={Arrow}
                                  alt=""
                                  width={14}
                                  height={14}
                                  className="arrowSide"
                                ></Image>
                              </div>
                            </div>
                          </>
                        )}
                        {isLoading && (
                          <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        )}
                      </motion.button>
                    </form>
                  </div>
                )}
                <div className="justify-between flex items-center w-full">
                  <h1>Join your company on Skillbit!</h1>
                  <button
                    className="bg-indigo-600 py-2 px-4 rounded-lg flex justify-center items-center gap-2"
                    onClick={() => setNewCompanyButton(true)}
                  >
                    New company
                    <div className="flex items-center justify-center">
                      <div>
                        <Image src={Plus} alt="" width={14} height={14}></Image>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="flex-1 bg-white bg-opacity-5 p-2 rounded-lg flex justify-between border border-white border-opacity-10 mb-3 w-full mt-6">
                  <input
                    className="text-white bg-transparent focus:outline-none w-full placeholder:text-white"
                    placeholder="Search Companies..."
                  ></input>
                  <Image src={SearchIcon} alt="" width={25} height={25}></Image>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full mt-3">
                  {companies &&
                    companies.map((company) => (
                      <div
                        className={
                          joinCompany === company.id
                            ? "bg-indigo-600 border-opacity-10 rounded-xl border border-indigo-600"
                            : "bg-indigo-600 border-opacity-10 rounded-xl h-fit"
                        }
                      >
                        <div
                          className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                          key={company.id}
                          onClick={() => setJoinCompany(company.id)}
                        >
                          <p>{company.name}</p>
                        </div>
                        <AnimatePresence>
                          {joinCompany === company.id && (
                            <motion.div
                              className="mt-3 p-3"
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                ease: "backOut",
                              }}
                            >
                              <h1>Join {company.name}?</h1>
                              <p>
                                We will send your request to the company for
                                verification.
                              </p>
                              <button
                                className="bg-white bg-opacity-10 border border-white border-opacity-20 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                                onClick={() => handleJoinCompany(company.id)}
                              >
                                Yes, join {company.name}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {companyDataLoaded && userCompanyName && userCompanyId && (
              <div className="">
                <p>Welcome to {userCompanyName}</p>
                <button
                  className="bg-white bg-opacity-10 border border-white border-opacity-20 py-2 px-4 rounded-lg flex justify-center items-center gap-2 mt-3"
                  onClick={() => handleLeaveCompany(userCompanyId)}
                >
                  Leave company
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;
