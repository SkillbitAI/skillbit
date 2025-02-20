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
import RecruiterDashboard from "../../public/assets/images/recruiterDashboard.png";
import CompanyProfile from "../../public/assets/images/companyProfile.png";
import CandidateManager from "../../public/assets/images/candidateManager.png";
import AssessmentBuilder from "../../public/assets/images/assessmentBuilder.png";
import TemplateBuilder from "../../public/assets/images/templateBuilder.png";
export default function RecruiterGuide() {
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
                  href="#getting-started"
                  className="text-slate-300 no-underline"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href="#joining-your-organization"
                  className="text-slate-300 no-underline"
                >
                  Joining your Organization
                </a>
              </li>
              <li>
                <a
                  href="#creating-a-template"
                  className="text-slate-300 no-underline"
                >
                  Creating a Template
                </a>
              </li>
              <li>
                <a
                  href="#managing-candidates"
                  className="text-slate-300 no-underline"
                >
                  Managing Candidates
                </a>
              </li>
            </ul>
          </div>
          <div className="w-3/4">
            <h1 id="introduction" className="text-4xl font-bold">
              Introduction
            </h1>
            <p className="mt-8">
              Welcome to the Skillbit Recruiter Guide! This guide will help you
              efficiently use the Skillbit platform to streamline the interview
              process. The steps below will guide you through the platform's
              features, ensuring a seamless experience for finding and assessing
              top talent.
            </p>
            <h1 id="getting-started" className="text-4xl font-bold mt-10">
              Getting Started
            </h1>
            <p className="mt-8">
              First, create an account and log in with your credentials. This
              will direct you to the recruiter dashboard, where you can begin
              managing your interview process. Here is what the dashboard will
              look like.
            </p>
            <Image
              src={RecruiterDashboard}
              alt="recruiter-dashboard"
              className="mt-8"
            ></Image>
            <h1
              id="joining-your-organization"
              className="text-4xl font-bold mt-10"
            >
              Joining your Organization
            </h1>
            <p className="mt-8">
              Click on 'Join a company.' This will prompt you to either enter a
              pre-existing company code or create a new company. If you choose
              to create a new company, you'll be prompted to enter a company
              name. After that, you'll be directed to the company profile page
              where your unique company code will be displayed. You can share
              this code with other recruiters in your organization for them to
              join the same company profile.
            </p>
            <Image
              src={CompanyProfile}
              alt="company-profile"
              className="mt-8"
            ></Image>
            <h1 id="creating-a-template" className="text-4xl font-bold mt-10">
              Creating a Template
            </h1>
            <p className="mt-8">
              Now that you've joined your organization, the next step is to access the Assessment Builder. 
              You can do so by following the steps listed on your dashboard or you can access it directly 
              on the menu bar on the left-hand side.
            </p>
            <p className="mt-8">
              Here is what the 'Assessment Builder' page will like:
            </p>
            <Image
              src={AssessmentBuilder}
              alt="assessmentBuilder"
              className="mt-8"
            ></Image>
            <p className="mt-8">
              Click on 'New Template' to create a new assessment template. Here,
              you can add a title and customize the assessment to fit your
              recruiting needs. Here's what you can expect when creating a new
              template:
            </p>
            <Image
              src={TemplateBuilder}
              alt="template-builder"
              className="mt-8"
            ></Image>
            <p className="mt-8">
              Once you have selected and filled out the necessary fields, you are ready to begin assigning 
              the assessment to candidates.
            </p>
            <h1 id="managing-candidates" className="text-4xl font-bold mt-10">
              Managing Candidates
            </h1>
            <p className="mt-8">
              Navigate back to the dashboard to continue the steps shown to access the candidate manager or you can select 'Candidate Manager' 
              directly on the left-hand menu bar. Before assigning assessments to candidates, you must add them to the candidate manager. 
              You may import a csv file with the candidate's first and last name along with their email address or you can add candidates manually.
            </p>
            <p className="mt-8">
              One you have candidates added to the candidate manager, you can begin assigning assessments. 
            </p>
            <Image
              src={CandidateManager}
              alt="candidate-manager"
              className="mt-8"
            ></Image>
            <p className="mt-8">
              Select the candidates you want to send an assessment to, and click 'Assign
              Templates and Send Tests'. Click on the template you want to
              assign, and click 'Assign templates and send tests'.
            </p>
            <h1 className="text-xl font-bold mt-10">Have any questions?</h1>
            <p className="mt-8">
              If you have any questions or concerns, please reach out to us at{" "}
              <span className="font-bold text-indigo-300">
                skillbitassessment@gmail.com
              </span>
            </p>
          </div>
        </div>
        <Footer background="transparent"></Footer>
      </div>
    </>
  );
}
