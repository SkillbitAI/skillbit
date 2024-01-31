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

const Contact = () => {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  

  return (
    <>
      <Toaster position="top-right"></Toaster>
      <div className="max-w-screen text-white bg-slate-900 graphPaper min-h-screen flex items-center justify-center overflow-x-hidden">
        <div className="flex-1 p-6">
          <div className="flex gap-2 items-center justify-center absolute top-6 left-6">
            <Image
              src={Logo}
              alt=""
              width={100}
              height={100}
              style={{ margin: "-30px" }}
            ></Image>
            <h1 className="">Skillbit</h1>
          </div>
            <form 
              className="flex flex-col gap-2 max-w-sm m-auto"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0, ease: "backOut" }}
              >
                Have any questions?
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "backOut" }}
                className="text-gray-500 mb-10"
              >
                Submit a ticket and we will get back to you as soon as possible.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
              >
                First Name
              </motion.p>
              <motion.input
                type="text"
                placeholder="Daniel"
                className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
              />
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "backOut" }}
              >
                Last Name
              </motion.p>
              <motion.input
                type="text"
                placeholder="Lai"
                className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "backOut" }}
              />
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "backOut" }}
              >
                Email
              </motion.p>
              <motion.input
                type="email"
                placeholder="mail@example.com"
                className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "backOut" }}
              />
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8, ease: "backOut" }}
              >
                Message
              </motion.p>

              <motion.textarea
                placeholder="Maximum 250 characters"
                className="p-2 h-48 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none no-resize"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9, ease: "backOut" }}
              />
              <motion.button
                className="mt-10 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0, ease: "backOut" }}
              >
              Submit Form
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
                </motion.button>
              </form>
        </div> 
      </div>
    </>
  )
}

export default Contact;