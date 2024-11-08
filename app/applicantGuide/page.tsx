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
import AssessmentEmail from "../../public/assets/images/assessmentEmail.png";
import AssessmentLandingPage from "../../public/assets/images/assessmentLandingPage.png";
import AssessmentSubmission from "../../public/assets/images/assessmentSubmission.png";
export default function ApplicantGuide() {
  return (
    <>
      <div className="max-w-screen text-white bg-slate-900 graphPaper min-h-screen flex items-center flex-col justify-center">
        <Nav></Nav>
        <div className="w-full max-w-6xl mx-auto py-20 px-6 flex gap-x-10">
          <div className="w-1/4 hidden md:block">
            <ul className="w-60 shrink-0 sticky top-8 flex flex-col text-sm gap-y-2">
              <li>
                <a href="#introduction" className="text-slate-300 no-underline">
                  Introduction
                </a>
              </li>
              <li>
                <a
                  href="#accessing-skillbit"
                  className="text-slate-300 no-underline"
                >
                  Accessing Skillbit
                </a>
              </li>
              <li>
                <a
                  href="#completing-your-assessment"
                  className="text-slate-300 no-underline"
                >
                  Completing your Assessment
                </a>
              </li>
            </ul>
          </div>
          <div className="w-3/4">
            <h1 id="introduction" className="text-4xl font-bold">
              Introduction
            </h1>
            <p className="mt-8">
              Welcome to the Skillbit Applicant Guide! This guide will help you
              navigate the Skillbit platform and make the most of your
              experience. The process is simple, just follow the steps below and
              you'll be on your way to an easy interview process.
            </p>
            <h1 id="accessing-skillbit" className="text-4xl font-bold mt-10">
              Accessing Skillbit
            </h1>
            <p className="mt-8">
              After submitting your application, you will receive an email with
              a link to the Skillbit platform. Click on the link to get started.
            </p>
            <h1 className="text-xl font-bold mt-10">Check the following:</h1>
            <ul className="list-disc list-inside mt-4">
              <li>
                Ensure you're logged into the email account used for your
                application.
              </li>
              <li>Check your spam or junk folder for missed messages.</li>
              <li>Verify that your internet connection is stable.</li>
            </ul>
            <p className="mt-8">
              You'll receive an email from{" "}
              <span className="font-bold text-indigo-300">
                skillbitassessment@gmail.com
              </span>
              , which will include a link to the Skillbit platform. From there,
              you can begin your assessment.
            </p>
            <Image
              src={AssessmentEmail}
              alt="Assessment Email"
              className="mt-8"
            ></Image>
            <p className="mt-8">
              Once you click 'Get Started,' you'll be directed to the assessment
              pre-screen. Once you're ready to begin, you can click 'Start Test'
              located at the bottom of the page.
            </p>
            <Image
              src={AssessmentLandingPage}
              alt="Assessment Landing Page"
              className="mt-8"
            ></Image>
            <h1
              id="completing-your-assessment"
              className="text-4xl font-bold mt-10"
            >
              Completing Your Assessment
            </h1>
            <p className="mt-8">
              You will be redirected to your designated test. Here, you will
              have access to a code editor, a question prompt, and a timer.
              After you've completed the assessment, click 'Submit' in the
              bottom left-hand corner. Here's an example of what to expect:
            </p>
            <Image
              src={AssessmentSubmission}
              alt="Assessment Submission"
              className="mt-8"
            ></Image>
            <p className="mt-8">
              After clicking 'Submit', you have finalized your submission. And
              that's it! You've completed the Skillbit assessment.
            </p>
            <h1 className="text-xl font-bold mt-10">Have any questions?</h1>
            <p className="mt-8">
              If you have any questions or concerns, please reach out to us at{" "}
              <span className="font-bold text-indigo-300">
                skillbitassessment@gmail.com
              </span>
              .
            </p>
          </div>
        </div>
        <Footer background="transparent"></Footer>
      </div>
    </>
  );
}
