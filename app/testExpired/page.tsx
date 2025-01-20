"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TestExpired = () => {
  const router = useRouter();

  return (
    <div className="text-white bg-slate-900 text-center flex flex-col justify-center items-center h-screen px-6">
      <Image
        src="/assets/branding/logos/logo_mini_transparent_white.png"
        alt="logo"
        width={150}
        height={150}
      />
      <h1 className="text-5xl ">Test Expired</h1>
      <p className="mt-4 text-lg">
        Unfortunately, the time allocated for this test has expired.
      </p>
      <p className="mt-4 text-lg">
        Be sure to apply again and stay on top of assessment windows to be
        considered for the job opportunity.
      </p>
    </div>
  );
};

export default TestExpired;
