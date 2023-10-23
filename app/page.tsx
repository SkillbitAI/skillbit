"use client";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../public/assets/icons/arrow.svg";
import Demo from "../public/assets/images/demo.png";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="max-w-screen text-white graphPaper p-6 text-center bg-slate-900">
        <div className=" max-w-screen-xl m-auto">
          <Nav></Nav>
          <div className="meshGradient"></div>
          <div className="meshGradient2" style={{ marginLeft: "-6rem" }}></div>
          <div className="flex justify-between items-center flex-col gap-28 mt-28 relative z-10">
            <div className="">
              <p className="px-2 py-1 bg-indigo-600 bg-opacity-50 border border-indigo-600 border-opacity-50 w-fit rounded-lg m-auto">
                Introducing Skillbit
              </p>
              <h1 className="text-5xl mt-4">
                Technical interviews, reimagined.
              </h1>
              <p className="mt-4">
                Take your company's technical recruitment to the next level with
                Skillbit's AI-powered technical interview platform.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-10 bg-indigo-600 bg-opacity-50 border border-indigo-600 border-opacity-50 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100 duration-200"
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
            <div className="w-fit demoBg max-w-5xl mb-28">
              <Image src={Demo} alt=""></Image>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen max-w-screen text-gray-900 text-center bg-white -mt-60 pt-60 ">
        <div className="max-w-screen-xl m-auto">
          <h1 className="text-5xl">Optimize your talent search.</h1>
          <p className="mt-4">
            Our simplified interface makes technical interviewing practical for
            recruiters and applicants.
          </p>
        </div>
      </div>
    </>
  );
}
