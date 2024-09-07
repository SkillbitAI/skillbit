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

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      firstName.length == 0 ||
      lastName.length == 0 ||
      email.length == 0 ||
      message.length == 0
    ) {
      toast.remove();
      toast.error("Please fill out all fields.");
    } else {
      toast.loading("Loading...");
      try {
        const response = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "contactForm",
            firstName: firstName,
            lastName: lastName,
            email: email,
            message: message,
          }),
        });
        const data = await response.json();
        if (data.message == "Success") {
          toast.remove();
          toast.success("Ticket submitted successfully!");

          //Set form fields to empty after success ticket submission
          setFirstName("");
          setLastName("");
          setEmail("");
          setMessage("");
        } else {
          toast.remove();
          toast.error("An error occurred while submitting the ticket.");
        }
      } catch (error) {
        console.error("Error submitting contact form: ", error);
        toast.remove();
        toast.error("An error occurred while submitting the ticket.");
      }
    }
  };

  return (
    <>
      <Toaster position="top-right"></Toaster>
      <div className="max-w-screen text-white bg-slate-900 graphPaper min-h-screen flex items-center flex-col justify-center overflow-x-hidden">
        <Nav></Nav>
        <div className="flex-1 px-6 py-40">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 max-w-lg m-auto"
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
              className="text-slate-400 mb-10"
            >
              Submit a ticket, and we will get back to you as soon as possible.
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
              id="firstName"
              placeholder="Daniel"
              className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
              id="lastName"
              placeholder="Lai"
              className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "backOut" }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              id="email"
              placeholder="mail@example.com"
              className="p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7, ease: "backOut" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              id="message"
              className="p-2 h-48 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none no-resize"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: "backOut" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={250}
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
        <Footer background="transparent"></Footer>
      </div>
    </>
  );
}
