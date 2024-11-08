"use client";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Applicant from "../../public/assets/images/applicantguide.png";
import Recruiter from "../../public/assets/images/recruiterguide.png";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { handleClientScriptLoad } from "next/script";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
export default function Guides() {
  const router = useRouter();
  return (
    <>
      <div>
        <div className="max-w-screen text-white bg-slate-900 graphPaper min-h-screen flex items-center flex-col justify-center overflow-x-hidden">
          <Nav></Nav>
          <div className="flex-1 w-1/2 py-40 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: "backOut" }}
            >
              Skillbit Guides: For a Smarter Interview Process
            </motion.h1>
            <div className="flex-1 grid grid-cols-2 gap-10 mt-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
                className="bg-slate-800 p-6 rounded-lg items-center flex flex-col justify-center w-full hover:cursor-pointer transition hover:bg-indigo-600"
                onClick={() => router.push("/applicantGuide")}
              >
                <Image
                  src={Applicant}
                  alt="Applicant Guide"
                  width={100}
                  height={100}
                ></Image>
                <h2 className="mt-6 text-lg font-semibold">Applicants</h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
                className="bg-slate-800 p-6 rounded-lg items-center flex flex-col justify-center w-full hover:cursor-pointer transition hover:bg-indigo-600"
                onClick={() => router.push("/recruiterGuide")}
              >
                <Image
                  src={Recruiter}
                  alt="Applicant Guide"
                  width={100}
                  height={100}
                ></Image>
                <h2 className="mt-6 text-lg font-semibold">Recruiters</h2>
              </motion.div>
            </div>
          </div>
          <Footer background="transparent"></Footer>
        </div>
      </div>
    </>
  );
}
