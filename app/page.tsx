"use client";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../public/assets/icons/arrow.svg";
import Logo from "../public/assets/branding/logos/logo_mini_transparent_white.png";
import Demo from "../public/assets/images/demo.png";
import { useEffect, useState, MouseEvent, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import About from "@/components/about/about";
import Button from "@/components/button/button";
import Mousetrail from "@/components/mousetrail/mousetrail";
import { motion, useInView } from "framer-motion";
import Footer from "@/components/footer/footer";

export default function Home() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    testExpressServer();
  }, []);

  const testExpressServer = async () => {
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
    });
    const data = await response.text();
  };

  //code for tilt effect

  function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  }

  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    throttle((e: MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (y - centerY) / 7;
      const rotateY = (centerX - x) / 7;

      setRotate({ x: rotateX / 6, y: rotateY / 6 });
    }, 100),
    []
  );

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <>
      {/* <Mousetrail></Mousetrail> */}
      {/* PAGE */}
      <div className="text-white graphPaper text-center bg-slate-900">
        {/* PAGE COVER */}
        <div className="px-6 pt-24 max-w-7xl m-auto" id="top">
          <div className="loginAccentBackground h-[900px] absolute -top-96 -right-96 -left-96 -rotate-6 z-0"></div>
          <Nav></Nav>
          <div className="flex justify-between items-center relative gap-20 z-10 adjustFlex mt-36">
            <div className="flex-1 text-left adjustFlex">
              {/* <p className="px-2 bg-white bg-opacity-10 shadow-md w-fit rounded-lg">
                Introducing Skillbit
              </p> */}
              <motion.h1
                className="text-7xl mt-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0, duration: 0.5, ease: "backOut" }}
              >
                Technical interviews, reimagined
              </motion.h1>
              <motion.p
                className="mt-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "backOut" }}
              >
                {
                  "Take your company's technical recruitment to the next level with Skillbit's AI-powered technical interview platform."
                }
              </motion.p>
              <motion.div
                className="flex items-center gap-28 mt-4 adjustFlex"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
              >
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-white bg-opacity-10 px-6 py-3 rounded-lg flex justify-center items-center backdrop-blur-lg"
                >
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
                </button>
              </motion.div>
            </div>
            <div className="flex-1 hover:scale-[1.05] duration-500">
              <motion.div
                className=""
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0, duration: 0.5, ease: "backOut" }}
              >
                <div
  onMouseMove={onMouseMove}
  onMouseLeave={onMouseLeave}
  className="bg-white bg-opacity-10 rounded-xl backdrop-blur-2xl flex shadow-xl flex-col md:flex-row"
  style={{
    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
    transition: "all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s",
  }}
>
  <div className="bg-white bg-opacity-10 rounded-xl p-6 flex flex-col justify-start items-start flex-shrink-0 md:w-1/3">
    <div className="flex justify-center items-center gap-2 scale-75 -ml-4 -mt-3">
      <Image
        src={Logo}
        alt=""
        width={100}
        height={100}
        style={{ margin: "-30px" }}
      />
      <h1 className="">Skillbit</h1>
    </div>
    <hr className="w-20 h-1 border-none bg-white bg-opacity-40 rounded-full mt-6" />
    <hr className="w-36 h-1 border-none bg-white bg-opacity-20 rounded-full mt-2" />
    <hr className="w-16 h-1 border-none bg-white bg-opacity-40 rounded-full mt-6" />
    <hr className="w-40 h-1 border-none bg-white bg-opacity-20 rounded-full mt-2" />
    <hr className="w-32 h-1 border-none bg-white bg-opacity-40 rounded-full mt-6" />
    <hr className="w-28 h-1 border-none bg-white bg-opacity-20 rounded-full mt-2" />
  </div>
  <div className="flex-1 p-6 flex flex-col gap-4 md:gap-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="bg-white bg-opacity-10 rounded-xl p-3 min-w-max hover:bg-opacity-20 duration-200">
        <h1 className="text-sm">Passed:</h1>
        <p className="text-sm">5,009 Candidates</p>
        <h1 className="text-sm mt-3">Failed:</h1>
        <p className="text-sm">12,440 Candidates</p>
      </div>
      <div className="bg-white bg-opacity-10 rounded-xl p-3 hover:bg-opacity-20 duration-200">
        <h1 className="text-sm mb-3">Pass Rate</h1>
        <p className="text-5xl">29%</p>
      </div>
      <div className="bg-white bg-opacity-10 rounded-xl p-3 min-w-max hover:bg-opacity-20 duration-200">
        <div className="pie-chart m-auto mb-3"></div>
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 rounded-full bg-white bg-opacity-[20%]"></div>
          <p className="text-sm">Completed</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 rounded-full bg-white bg-opacity-[15%]"></div>
          <p className="text-sm">Started</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-4 h-4 rounded-full bg-white bg-opacity-[10%]"></div>
          <p className="text-sm">Sent</p>
        </div>
      </div>
      <div className="bg-white bg-opacity-10 rounded-xl p-3 hover:bg-opacity-20 duration-200">
        <h1 className="text-sm">Applicants vs Time</h1>
        <div className="relative mt-3">
          <hr className="w-1 h-20 border-none bg-white bg-opacity-40 rounded-t-full" />
          <hr className="w-full h-1 border-none bg-white bg-opacity-40 -rotate-12 absolute -mt-10 rounded-full" />
          <hr className="w-full h-1 border-none bg-white bg-opacity-40 rounded-r-full" />
        </div>
        <h1 className="text-sm mt-3">Total Applicants:</h1>
        <p className="text-sm">29,082</p>
      </div>
    </div>
  </div>
</div>
              </motion.div>
            </div>
          </div>
        </div>
        <About></About>
        <div
          className="text-left relative bg-gradient-to-b to-slate-950 from-transparent"
          id="how it works"
        >
          {/* <div className="bg-slate-950 h-[900px] absolute -top-36 -right-96 -left-96 -rotate-6 z-0"></div> */}
          <div className="px-6 max-w-7xl m-auto relative z-20 pt-40 pb-64 flex justify-between gap-20 items-center flex-col lg:flex-row">
            <div className="flex-1">
              <h1 className="text-6xl">How it works</h1>
              <ul className="flex flex-col gap-12 mt-12">
                <li className="flex gap-6">
                  <div className="rounded-2xl bg-indigo-600 text-xl min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] flex justify-center items-center">
                    <h1>1</h1>
                  </div>
                  <div className="">
                    <h1>Customize your question configurations</h1>
                    <p>
                      Our streamlined question customization interface will
                      ensure all candidates receive a unique but comparable
                      question, ensuring everyone plays on the same field.
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="rounded-2xl bg-indigo-600 text-xl min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] flex justify-center items-center">
                    <h1>2</h1>
                  </div>
                  <div className="">
                    <h1>Generate a unique link</h1>
                    <p>
                      Skillbit generates a unique link that is automatically
                      sent to candidates so you can save valuable time.
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="rounded-2xl bg-indigo-600 text-xl min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px] flex justify-center items-center">
                    <h1>3</h1>
                  </div>
                  <div className="">
                    <h1>Organize and analyze results</h1>
                    <p>
                      After candidates complete their assigned question, view
                      detailed analytics on each candidate to help you make the
                      right hiring decisions.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center items-center" ref={ref}>
              {isInView && (
                <div className="flex">
                  <motion.div
                    className="w-32 h-32 rounded-3xl rotate-45 -mr-2 border border-dashed"
                    initial={{ opacity: 0, y: 200, rotate: 0, scale: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
                    transition={{ duration: 1, delay: 0, ease: "backOut" }}
                  ></motion.div>
                  <motion.div
                    className="w-32 h-32 rounded-3xl rotate-45 -ml-2 border border-dashed"
                    initial={{ opacity: 0, y: -200, rotate: 0, scale: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "backOut" }}
                  ></motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-indigo-600 text-left">
          <div className="px-6 max-w-7xl m-auto relative z-20 p-40">
            <h1 className="text-6xl">Ready to get started?</h1>
            <p className="mt-4">
              Register with us today for a limited free trial.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white bg-opacity-10 px-6 py-3 rounded-lg flex justify-center items-center backdrop-blur-lg mt-12"
            >
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
            </button>
          </div>
        </div>
        <Footer background="blue"></Footer>
      </div>
    </>
  );
}

/* <button
onClick={() => router.push("/dashboard")}
className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center"
>
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
</button> */
