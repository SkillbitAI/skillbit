"use client"
import React from "react";
import logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SubmissionScreen = () => {
  const router = useRouter();
  return (
    <div className="text-white bg-slate-900 graphPaper flex flex-col justify-between h-screen">
      <div className="flex flex-col items-center justify-center flex-grow px-6 max-w-7xl mx-auto">
        <div className="flex justify-center ">
          <Image src={logo} alt="logo" width={200} height={200} />
        </div>
        <div className="text-center">
          <h1 className="text-7xl mt-4">Submission Received</h1>
          <h2 className="text-lg font-semibold my-12">What’s Next?</h2>
          <p className="mb-8">
            Thank you for submitting your test. Our team will review your
            submission, and you will receive your results soon.
          </p>
          <div className="mt-8 max-w">
            <ol className="text-center mb-8">
              <li className="mb-4">
                <span className="text-white">&#8226;</span> Your submission ID
                has been recorded for reference.
              </li>
              <li className="mb-4">
                <span className="text-white">&#8226;</span> Results will be
                shared within 3-5 business days.
              </li>
              <li className="mb-4">
                <span className="text-white">&#8226;</span> A recruiter will
                reach out to discuss next steps if you proceed to the next
                stage.
              </li>
              <li className="mb-4">
                <span className="text-white">&#8226;</span> For questions,
                please contact our support team.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 flex flex-col justify-between h-screen">
      <div className="flex flex-col items-center justify-center flex-grow px-6 max-w-7xl mx-auto">
          <h1 className="text-6xl">Thank You for Your Effort!</h1>
          <p className="mt-4">
            We value the time you invested in completing the test.
          </p>
          <button
            className="bg-white bg-opacity-10 px-6 py-3 rounded-lg mt-12"
            onClick={() => router.push("/")}
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionScreen;
