"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [newQuestionButton, setNewQuestionButton] = useState(false);
  const [card, setCard] = useState(1);

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
                <button
                  className="hover:bg-slate-700 cursor-pointer rounded-xl p-3"
                  onClick={() => setNewQuestionButton(true)}
                >
                  <Image src={Plus} width={14} height={14} alt=""></Image>
                </button>
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
            <div className="border-l border-slate-900 pl-6 flex-1">
              <div
                className="bg-slate-900 rounded-xl border border-slate-800 p-6 min-h-full overflow-hidden flex justify-center items-center flex-col gap-6"
                style={{ height: "calc(100vh - 116px)" }}
              >
                <div className="w-full">
                  <h1>Question 1</h1>
                </div>
                <AnimatePresence>
                  {newQuestionButton && (
                    <motion.div
                      className="fixed left-0 right-0 bottom-0 top-0 z-50 flex justify-center items-center flex-col gap-3 bg-slate-950 bg-opacity-60 p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: "backOut",
                      }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.button
                        className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center gap-2 mt-3"
                        onClick={() => setNewQuestionButton(false)}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.7,
                          ease: "backOut",
                        }}
                        exit={{ opacity: 0, y: 30 }}
                      >
                        <Image
                          src={Plus}
                          width={14}
                          height={14}
                          className="rotate-45"
                          alt="Exit"
                        ></Image>
                      </motion.button>
                      <motion.div
                        className="text-center gap-12 max-w-lg m-auto overflow-y-scroll bg-slate-900 border border-slate-800 rounded-xl p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
                        exit={{ opacity: 0, y: 30 }}
                      >
                        <div className="flex justify-center items-center flex-col">
                          <h1>Question Builder</h1>
                          <p>Welcome to the Skillbit question builder.</p>
                          <motion.button
                            className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              ease: "backOut",
                            }}
                            onClick={() => setCard(2)}
                          >
                            <>
                              Get Started{" "}
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
                          </motion.button>
                        </div>
                        <div className="flex justify-center items-center flex-col">
                          <div className=""></div>
                          <div className="flex flex-col items-center justify-center">
                            <h1>
                              What programming language or framework is your
                              question testing?
                            </h1>
                            <p>
                              Your question will test candidates using the
                              programming language or framework you choose.
                            </p>
                            <div className="flex gap-3 mt-12 flex-wrap justify-center items-center">
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                React JS (Javascript)
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                React JS (TypeScript)
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                C++
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                Java
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                SQL
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <motion.button
                              className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                              onClick={() => setCard(3)}
                            >
                              <>
                                Next{" "}
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
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex justify-center items-center flex-col">
                          <div className=""></div>
                          <div className="flex flex-col items-center justify-center">
                            <h1>
                              What type of programming question would you like
                              to ask?
                            </h1>
                            <p>
                              We will customize your candidates' prompts to
                              reflect this question type.
                            </p>
                            <div className="flex gap-3 mt-12 flex-wrap justify-center items-center">
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                Debugging challenge
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                Data Structures challenge
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                Algorithmic challenge
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                Coding puzzle
                              </div>
                              <div className="bg-slate-700 rounded-xl border border-slate-600 p-3">
                                Real-world problem
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <motion.button
                              className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                ease: "backOut",
                              }}
                            >
                              <>
                                Generate question{" "}
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
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex gap-2 items-center justify-center flex-1">
                  <div
                    className={
                      card == 1
                        ? "h-2 w-2 rounded-full bg-slate-600 border border-slate-500"
                        : "h-2 w-2 rounded-full bg-slate-800 border border-slate-700"
                    }
                    onClick={() => setCard(1)}
                  ></div>
                  <div
                    className={
                      card == 2
                        ? "h-2 w-2 rounded-full bg-slate-600 border border-slate-500"
                        : "h-2 w-2 rounded-full bg-slate-800 border border-slate-700"
                    }
                    onClick={() => setCard(2)}
                  ></div>
                  <div
                    className={
                      card == 3
                        ? "h-2 w-2 rounded-full bg-slate-600 border border-slate-500"
                        : "h-2 w-2 rounded-full bg-slate-800 border border-slate-700"
                    }
                    onClick={() => setCard(3)}
                  ></div>
                </div>
              </div>

              {/* <div className="">
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
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionWorkshop;
