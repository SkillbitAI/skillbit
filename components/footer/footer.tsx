import Image from "next/image";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Arrow from "../../public/assets/icons/arrow.svg";
import { useRouter } from "next/navigation";
import Button from "@/components/button/button";
import { useState, useEffect } from "react";

interface Props {
  background: string;
}

const Footer = (props: Props) => {
  const router = useRouter();
  const scrolltoHash = function (element_id: string) {
    const element = document.getElementById(element_id);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <div
      className={
        props.background == "transparent"
          ? "text-left"
          : "bg-slate-950 text-left"
      }
      id="footer"
    >
      <div className="px-6 max-w-7xl m-auto relative z-20 py-20 flex justify-between flex-col lg:flex-row gap-12">
        <div className="flex flex-col justify-between items-start gap-6 max-w-sm">
          <div className="flex justify-center items-center gap-2">
            <Image
              src={Logo}
              alt=""
              width={100}
              height={100}
              style={{ margin: "-30px" }}
            ></Image>
            <h1 className="">Skillbit</h1>
          </div>
          <div className="">
            <p>
              © 2023 Skillbit @ University of Florida Research Foundation, Inc.
              All Commercial Rights Reserved.
            </p>
          </div>
        </div>
        <hr className="h-0 w-20 border opacity-10 rounded-full lg:w-0 lg:h-40" />
        <div className="">
          <ul className="flex flex-col gap-3">
            <li>
              <h1 className="text-base">Recruiters</h1>
            </li>
            <li
              className="hover:cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <p>Dashboard</p>
            </li>
            <li
              className="hover:cursor-pointer"
              onClick={() => router.push("/applicants")}
            >
              <p>Applicants</p>
            </li>
            <li
              className="hover:cursor-pointer"
              onClick={() => router.push("/questionWorkshop")}
            >
              <p>Template Workshop</p>
            </li>
            <li
              className="hover:cursor-pointer"
              onClick={() => router.push("/companyProfile")}
            >
              <p>Company Profile</p>
            </li>
          </ul>
        </div>
        <div className="">
          <ul className="flex flex-col gap-3">
            <li>
              <h1 className="text-base">About</h1>
            </li>
            <li>
              <p>Our Story</p>
            </li>
            <li>
              <p>Our Mission</p>
            </li>
            <li>
              <p>Meet the Team</p>
            </li>
            <li className="hover:cursor-pointer"
                onClick={() => router.push("/guides")}
            >
              <p>Guides</p>
            </li>
          </ul>
        </div>
        <div className="">
          <ul className="flex flex-col gap-3">
            <li>
              <h1 className="text-base">Contact</h1>
            </li>
            <li>
              <p>555-555-5555</p>
            </li>
            <li>
              <p>skillbitcontact@gmail.com</p>
            </li>
            <li
              className="hover:cursor-pointer"
              onClick={() => router.push("/support")}
            >
              <p>Support Form</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
