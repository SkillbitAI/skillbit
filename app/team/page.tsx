"use client";

import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { handleClientScriptLoad } from "next/script";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import Tyler from "../../public/assets/images/tylerhaisman.jpg"
import Daniel from "../../public/assets/images/daniellai.jpg"
import Aman from "../../public/assets/images/amanheadshot.png"

export default function Team() {
  return (
    <>
      <div className="max-w-screen text-white bg-slate-900 graphPaper min-h-screen flex items-center flex-col justify-center overflow-x-hidden">
        <Nav></Nav>
        <div className="flex-1 px-6 py-40">
          <div className="flex flex-col gap-2 max-w-lg m-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: "backOut" }}
            >
              Meet Our Team
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
              className="text-slate-200 mb-10"
            >
              Crafting Interviews, Bridging Opportunities
            </motion.p>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-8 !mt-8">
            <motion.div
              className="flex flex-col items-start space-y-4 rounded-md items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
            >
              <motion.div
                className="w-20 h-20 relative rounded-full overflow-hidden bg-gradient-to-br from-indigo-200 to-indigo-700 ring ring-slate-700 drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
              >
                <Image
                  alt="Tyler's Avatar"
                  src={Aman}
                  style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                />
              </motion.div>
              <motion.p
                className="text-xl flex flex-col text-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "backOut" }}
              >
                <span>Amanpreet Kapoor</span>
                <span className="text-slate-200 mt-1 text-sm">Project Mentor</span>
              </motion.p>
            </motion.div>
            <motion.div
              className="flex flex-col items-start space-y-4 rounded-md items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "backOut" }}
            >
              <motion.div
                className="w-20 h-20 relative rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "backOut" }}
              >
                <Image
                  alt="Tyler's Avatar"
                  src={Tyler}
                  style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                />
              </motion.div>
              <motion.p
                className="text-xl flex flex-col text-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "backOut" }}
              >
                <span>Tyler Haisman</span>
                <span className="text-slate-200 mt-1 text-sm">Frontend Lead</span>
              </motion.p>
            </motion.div>
            <motion.div
              className="flex flex-col items-start space-y-4 rounded-md items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: "backOut" }}
            >
              <motion.div
                className="w-20 h-20 relative rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9, ease: "backOut" }}
              >
                <Image
                  alt="Tyler's Avatar"
                  src={Tyler}
                  style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                />
              </motion.div>
              <motion.p
                className="text-xl flex flex-col text-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1, ease: "backOut" }}
              >
                <span>Blake Rand</span>
                <span className="text-slate-200 mt-1 text-sm">Backend Lead</span>
              </motion.p>
            </motion.div>
            <motion.div
              className="flex flex-col items-start space-y-4 rounded-md items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1, ease: "backOut" }}
            >
              <motion.div
                className="w-20 h-20 relative rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2, ease: "backOut" }}
              >
                <Image
                  alt="Tyler's Avatar"
                  src={Tyler}
                  style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                />
              </motion.div>
              <motion.p
                className="text-xl flex flex-col text-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3, ease: "backOut" }}
              >
                <span>Daniel Lai</span>
                <span className="text-slate-200 mt-1 text-sm">Features</span>
              </motion.p>
            </motion.div>
            <motion.div
              className="flex flex-col items-start space-y-4 rounded-md items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4, ease: "backOut" }}
            >
              <motion.div
                className="w-20 h-20 relative rounded-full overflow-hidden bg-gradient-to-br from-indigo-200 to-indigo-700 ring ring-slate-700 drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5, ease: "backOut" }}
              >
                <Image
                  alt="Aman's Avatar"
                  src={Aman}
                  style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                />
              </motion.div>
              <motion.p
                className="text-xl flex flex-col text-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6, ease: "backOut" }}
              >
                <span>David Noguera</span>
                <span className="text-slate-200 mt-1 text-sm">Mobile</span>
              </motion.p>
            </motion.div>
          </div>
        </div>
        <Footer background="transparent"></Footer>
      </div>
    </>
  );
}