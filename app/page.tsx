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
      {/* <Mousetrail></Mousetrail> */}
      {/* PAGE */}
      <div className="max-w-screen text-white graphPaper text-center bg-slate-900">
        {/* PAGE COVER */}
        <div className="px-6 min-h-screen max-w-7xl m-auto">
          <div className="loginAccentBackground h-[800px] absolute -top-96 -right-96 -left-96 -rotate-6 z-0"></div>
          <Nav></Nav>
          <div className="flex justify-between items-center relative z-10">
            <div className="">
              <p className="px-2 bg-white bg-opacity-20 w-fit rounded-lg">
                Introducing Skillbit
              </p>
              <h1 className="text-left text-7xl mt-4 ">
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
                  className="bg-white bg-opacity-20 px-6 py-3 rounded-lg flex justify-center items-center"
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
            <div className=""></div>
          </div>
        </div>
        <About></About>
      </div>
    </>
  );
}

{
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
}
