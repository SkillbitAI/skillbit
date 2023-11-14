"use client";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../public/assets/icons/arrow.svg";
import Demo from "../public/assets/images/demo.png";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import About from "@/components/about/about";
import Button from "@/components/button/button";
import Mousetrail from "@/components/mousetrail/mousetrail";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    testExpressServer();
  }, []);

  const testExpressServer = async () => {
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
    });
    const data = await response.text();
    console.log(data);
  };

  return (
    <>
      <Mousetrail></Mousetrail>
      <section id="home"></section>
      <Nav></Nav>
      <div className="max-w-screen text-white graphPaper  py-6 text-center bg-slate-900">
        <div className=" max-w-screen-xl m-auto">
          <div className="flex  justify-between items-center flex-row gap-28 mt-28 relative z-10">
            <div className="basis-1/2">
              <div className="meshGradient3"></div>
              <p className="px-2 bg-indigo-600 bg-opacity-10 border border-indigo-600 border-opacity-50 w-fit rounded-lg">
                Introducing Skillbit
              </p>
              <h1 className="text-left text-5xl mt-4 ">
                Technical interviews, reimagined.
              </h1>
              <p className="mt-4 text-left">
                Take your company's technical recruitment to the next level with
                Skillbit's AI-powered technical interview platform.
              </p>
              <div className="flex items-center gap-28 mt-4">
                {" "}
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-indigo-600 bg-opacity-50 border border-white border-opacity-50 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100 hover:bg-indigo-950 duration-200 hover:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#4f46e5,0_0_15px_#4f46e5,0_0_30px_#4f46e5]"
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
            <div className="w-fit demoBg max-w-5xl mb-28">
              <Image src={Demo} alt=""></Image>
            </div>
          </div>
        </div>
        <About></About>
        <section id="about"></section>
        <div className="from-indigo-900 to-transparent "></div>
      </div>
    </>
  );
}
