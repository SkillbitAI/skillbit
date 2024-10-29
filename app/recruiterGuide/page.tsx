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
import TemplateWorkshop from "../../public/assets/images/templateWorkshop.png";
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
                <a href="#introduction" className="text-slate-300 no-underline">Introduction</a>
              </li>
              <li>
                <a href="#getting-started" className="text-slate-300 no-underline">Getting Started</a>
              </li>
              <li>
                <a href="#joining-your-organization" className="text-slate-300 no-underline">Joining your Organization</a>
              </li>
              <li>
                <a href="#managing-candidates" className="text-slate-300 no-underline">Managing Candidates</a>
              </li>
              <li>
                <a href="#creating-a-template" className="text-slate-300 no-underline">Creating a Template</a>
              </li>
            </ul>
          </div>

          <div className="w-3/4">
            <h1 id="introduction" className="text-4xl font-bold">Introduction</h1>
            <p className="mt-8">
              Welcome to the Skillbit Recruiter Guide! This guide will help you efficiently use the Skillbit platform to streamline the interview process. 
              The steps below will guide you through the platform's features, ensuring a seamless experience for finding and assessing top talent.
            </p>
            <h1 id="getting-started" className="text-4xl font-bold mt-10">Getting Started</h1>
            <p className="mt-8">
              First, create an account and log in with your credentials. This will direct you to the recruiter dashboard, where you can begin managing your interview process. 
              Here’s what the dashboard will look like.
            </p>
            <Image
              src={RecruiterDashboard}
              alt="Assessment Submission"
              className="mt-8">
            </Image>
            <h1 id="joining-your-organization" className="text-4xl font-bold mt-10">Joining your Organization</h1>
            <p className="mt-8">
              Click on 'Join a company.' This will prompt you to either enter a pre-existing company code or create a new company. 
              If you choose to create a new company, you'll be prompted to enter a company name. 
              After that, you'll be directed to the company profile page where your unique company code will be displayed. 
              You can share this code with other recruiters in your organization for them to join the same company profile.
            </p>
            <Image 
              src={CompanyProfile}
              alt="Company Profile"
              className="mt-8">
            </Image>
            <h1 id="managing-candidates" className="text-4xl font-bold mt-10">Managing Candidates</h1>
            <p className="mt-8">
              Now that you've joined your organization, you can begin managing candidates. Navigate to the 'Candidate Manager' page located on the menu bar on the left-hand side of the dashboard. 
              From there, you can start adding candidates by clicking 'Add applicant' or importing them in bulk using the 'Import csv' option.
            </p>
            <p className="mt-8">
              To add an applicant manually, simply enter their first name, last name, and email address. If you have a list of candidates in a CSV file, you can import them by selecting the file and clicking 'Import'. 
              Make sure the file is formatted correctly to ensure a successful import.
            </p>
            <p className="mt-8">
              Here’s an example of the 'Candidate Manager' page:
            </p>
            <Image
              src={CandidateManager}
              alt="Candidate Manager"
              className="mt-8">
            </Image>
            <p className="mt-8">
              Once you're ready assess your candidates, you need to create a template for the online assessments they will complete.
            </p>
            <h1 id="creating-a-template" className="text-4xl font-bold mt-10">Creating a Template</h1>
            <p className="mt-8">
              In 'Candidate Manager', click on 'Assign Templates and Send Tests' or navigate to 'Template Workshop' on the menu bar on the left-hand side of the dashboard.
            </p>
            <Image
              src={TemplateWorkshop}
              alt="Assessment Submission"
              className="mt-8">
            </Image>
            <p className="mt-8">
              Click on 'New Template' to create a new assessment template. Here, you can add a title and customize the assessment to fit your recruiting needs. Here's what you can expect when creating a new template: 
            </p>
            <Image
              src={TemplateBuilder}
              alt="Assessment Submission"
              className="mt-8">
            </Image>
            <p className="mt-8">
              After you have created a template, you can now send candidates the assessment. Navigate back to 'Candidate Manager'. Click on the candidates you want to send the assessment to, and click 'Assign Templates and Send Tests'.
              Click on the template you want to assign, and click 'Assign templates and send tests' 
            </p>
            <h1 className="text-xl font-bold mt-10">Have any questions?</h1>
            <p className="mt-8">
              If you have any questions or concerns, please reach out to us at <span className="font-bold text-indigo-300">skillbitassessment@gmail.com</span>.
            </p>
          </div>
        </div>
        <Footer background="transparent"></Footer>
      </div>
    </>
  )
}