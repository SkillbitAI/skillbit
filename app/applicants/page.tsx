"use client";
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState, ChangeEvent } from "react";

//import mail file
import { sendMail } from '../mailer/page';
//
import Loader from "@/components/loader/loader";
import Papa from "papaparse";
import {Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Sidebar from "@/components/sidebar/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopMenuBar from "@/components/topmenubar/topmenubar";
import Dropdown from "../../public/assets/icons/dropdown.svg";
import { Toaster, toast } from "react-hot-toast";
import FilterIcon from "../../public/assets/icons/filter.svg";

//dashboard icons
import Plus from "../../public/assets/icons/plus.svg";
import DashboardIcon from "../../public/assets/icons/dashboard.svg";
import DashboardIconWhite from "../../public/assets/icons/dashboard_white.svg";
import ApplicantsIcon from "../../public/assets/icons/applicants.svg";
import CompanyIcon from "../../public/assets/icons/company.svg";
import SupportIcon from "../../public/assets/icons/support.svg";
import WorkshopIcon from "../../public/assets/icons/workshop.svg";
import ProfileIcon from "../../public/assets/icons/profile.svg";
import QuestionIcon from "../../public/assets/icons/question.svg";
import SearchIcon from "../../public/assets/icons/search.svg";


const Applicants = () => {
  interface ApplicantDataInterface {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    score: string;
    selected: boolean;
  }
  
  
  const [recruiterEmail, setRecruiterEmail] = useState("");

  useEffect(() => {
    getApplicants();
  }, []);

  const getApplicants = async () => {
    toast.loading("Loading applicants...");
    //getting applicants from the database
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getApplicants",
        }),
      });
      const data = await response.json();
      console.log(data);
      setApplicantData(data.message);
    } catch (error) {
      console.error(error);
    }
    toast.remove();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file && file.type === "text/csv") {
        parseCSV(file);
      } else {
        alert("Please upload a valid CSV file.");
      }
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      complete: async (results) => {
        const rows = results.data;
        const combinedData = rows.map((row) => ({
          ...(row as Omit<
            ApplicantDataInterface,
            "status" | "score" | "selected"
          >),
          status: "Expired",
          score: "90%",
          selected: false,
        }));
        await updateApplicants(combinedData);
      },
      header: true,
    });
  };

//ADD APPLICANT FUNCITONALITY///////////////////////////////////////////////////////////////////

  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    score: '',
    selected: false,
  });

  const toggleAddApplicantModal = () => {
    setIsAddApplicantModalOpen((prev) => !prev);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    // Validate form fields
    if (formData.firstName === '' && formData.lastName === '' && formData.email === '') {
      // Display an error message or handle the validation error as needed
      toast.error('Please fill out all required fields.');
      
    } 
    if (!formData?.firstName)
    {
      toast.error('Please fill out the first name.')
    }
    if (!formData?.lastName)
    {
      toast.error('Please fill out the last name.')
    }
    if (!formData?.email)
    {
      toast.error('Please fill out the email.')
    }
    else if (!regex.test(formData?.email))
    {
      toast.error('That is not a valid email.')
    }
    else {
      // Proceed with form submission logic (e.g., sending data to the database)
      handleAddApplicant();
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddApplicant = async () => {
    try {
      const { status, score, selected, id, ...applicantData } = formData as ApplicantDataInterface;
  
      // Update individual applicant
      await updateApplicants([applicantData]);
  
      // Send data to the server
      const response = await fetch("/api/codeEditor/createTestID", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicants: [applicantData], // Wrap the individual applicant data in an array
          recruiterEmail: recruiterEmail,
        }),
      });
  
      if (response.ok) {
        // Show success toast
        toast.success('Applicant added successfully');
        toggleAddApplicantModal();
        // Optionally, you can trigger a data refresh or take other actions after a successful addition
      } else {
        // Show error toast
        toast.error('Failed to add applicant');
        // Handle error cases if needed
      }
    } catch (error) {
      // Show error toast for network or unexpected errors
      toast.error('Error adding applicant');
      // Handle other errors if needed
    }
  };
  
  ////////////////////////////////////////////////////////////
  const updateApplicants = async (applicants: any) => {
    try {
      toast.loading("Importing applicant(s)...");
      const response = await fetch("/api/codeEditor/createTestID", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          applicants: applicants,
          recruiterEmail: recruiterEmail,
        }),
      });
      if (!response.ok) {
        toast.remove();
        toast.error("Error loading applicants.");
        console.error("Error setting applicants!");
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.remove();
      toast.error("Error loading applicants.");
      console.error(error);
    }
  };
  
  const path = usePathname();
  const router = useRouter();

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showOptionsIndex, setShowOptionsIndex] = useState("");
  const [applicantData, setApplicantData] = useState<
    Array<ApplicantDataInterface>
  >([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    const updatedData = applicantData.map((item) => ({
      ...item,
      selected: !selectAll,
    }));
    setApplicantData(updatedData);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 25;
  const totalPages = Math.ceil(applicantData.length / applicantsPerPage);

  //Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        // console.log("Hello world!");
        //other than print hello world, set user data here
        setRecruiterEmail(session.user?.email || "");
      }
    };
    if (status === "authenticated") {
      getData();
    }
  }, [session, status]);
  if (status === "loading") {
    return <Loader></Loader>;
  }
  if (status === "unauthenticated") {
    router.push("/auth");
    return;
  }
////////////////////
const handleButtonClick = async () => {
    try {
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "sendMail",
        }),
      });

      
    } catch (error) {
      console.error('Error in handle');
    }
  }



  
///////////////////


  return (
    <>
      <div className="max-w-screen text-white flex overflow-x-hidden">
        <Sidebar></Sidebar>
        <div className="bg-slate-950 flex-1">
          <TopMenuBar></TopMenuBar>
          <div className="flex">
            {/* Applicants content */}
            <div className="p-6 flex-1">
              <Toaster position="top-right"></Toaster>
              <ul className="flex gap-6 items-center justify-between">
                <div className="flex gap-3 items-center justify-center">
                  <li className="">
                    <div className="flex gap-2 items-center text-white relative">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-white transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                      />
                      <p>Select all</p>
                    </div>
                  </li>
                  <hr className="border-l border-slate-800 h-5" />
                  <li className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative">
                    <p className="text-sm flex gap-2 items-center justify-center">
                      Clear Selected
                    </p>
                  </li>
                  <li className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative">
                    <p className="text-sm flex gap-2 items-center justify-center">
                      Clear Failed
                    </p>
                  </li>
                  <li className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative">
                    <button onClick={toggleAddApplicantModal} className="text-sm flex gap-2 items-center justify-center">
                      Add Applicant
                    </button>
                  </li>
                  <AnimatePresence>           
                  {isAddApplicantModalOpen && (
      
          
      <motion.div
      className="fixed left-0 right-0 bottom-0 top-0 z-50 flex justify-center items-center flex-col gap-3 bg-slate-950 bg-opacity-60 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: "backOut",
      }}
      exit={{ opacity: 0 }}
    >
      <motion.button
      className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center gap-2 mt-3"
      onClick={() => toggleAddApplicantModal()}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: "backOut",
      }}
      exit={{ opacity: 0, y: 30 }}
    >
      <Image
        src={Plus}
        width={14}
        height={14}
        className="rotate-45"
        alt="Exit"
      ></Image>
    </motion.button>
            <motion.form 
            className="bg-slate-900  flex flex-col p-6 rounded-xl border border-slate-800"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "backOut",
                        }}
            exit={{ opacity: 0, y: 30 }}
            >
              <h1>Enter all required fields</h1>
              <motion.label className="text-white mt-5 mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "backOut",
              }}>
              First Name:
              </motion.label>
              <motion.input placeholder="John" className="my-2 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1" type="text"
               name="firstName" 
               value={formData.firstName} 
               onChange={handleInputChange} 
               initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: "backOut",
                          }}/>
              
              <motion.label className="text-white my-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "backOut",
              }}>
              Last Name:
              </motion.label>
              <motion.input placeholder="Doe" className="my-2 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "backOut",
              }}/>
              
              <motion.label className="text-white my-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "backOut",
              }}>
              Email:
              </motion.label>
              <motion.input placeholder="mail@example.com" className="my-2 p-2 rounded-lg placeholder:text-gray-500 text-white bg-white bg-opacity-10 outline-none w-full mt-1" type="email" name="email" value={formData.email} onChange={handleInputChange} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "backOut",
              }}/>
              
              
              
              
            <motion.button type="submit" className="mt-3 w-full bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center m-auto hover:bg-opacity-100" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "backOut",
            }}
          >
            Submit{" "}
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
            </motion.form>
            
            </motion.div>
      )}
      </AnimatePresence>   
                </div>
                <div className="flex gap-3 items-center justify-center">
                  <label
                    htmlFor="fileInput"
                    className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative"
                  >
                    <p className="text-sm flex gap-2 items-center justify-center">
                      Import CSV
                    </p>
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    id="fileInput"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  <li
                    className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 shadow-lg cursor-pointer duration-100 relative"
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                  >
                    <p className="text-sm flex gap-2 items-center justify-center">
                      <Image
                        src={FilterIcon}
                        alt=""
                        width={15}
                        height={15}
                      ></Image>
                      Filter
                    </p>
                    {/* Filter Menu */}
                    {showFilterMenu && (
                      <motion.ul
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: 0,
                          ease: "backOut",
                          delayChildren: 0.2,
                        }}
                        className="absolute top-12 right-0 bg-slate-800 bg-opacity-60 backdrop-blur-lg rounded-lg border border-slate-800 p-3 flex flex-col gap-2 z-10"
                      >
                        <li className="flex gap-3 items-center justify-center w-max">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          <p className="text-sm">Sent</p>
                        </li>
                        <li className="flex gap-3 items-center justify-center  w-max">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <p className="text-sm">Failed</p>
                        </li>
                        <li className="flex gap-3 items-center justify-center  w-max">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          <p className="text-sm">Passed</p>
                        </li>
                        <li className="flex gap-3 items-center justify-center  w-max">
                          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                          <p className="text-sm">Expired</p>
                        </li>
                      </motion.ul>
                    )}
                  </li>
                </div>
              </ul>
              <ul className="flex flex-col gap-2 mt-6">
              {applicantData
          .slice((currentPage - 1) * applicantsPerPage, currentPage * applicantsPerPage)
          .map((item, index) => (
                  <li
                    key={index}
                    className={
                      showOptionsIndex == index.toString()
                        ? "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 items-center justify-between border border-slate-800 duration-100 hover:cursor-pointer"
                        : "p-3 rounded-lg bg-slate-900 flex flex-col gap-3 items-center justify-between hover:bg-slate-800 border border-slate-800 duration-100 hover:cursor-pointer"
                    }
                    onClick={
                      showOptionsIndex == index.toString()
                        ? () => setShowOptionsIndex("")
                        : () => setShowOptionsIndex(index.toString())
                    }
                  >
                    <div className="flex gap-3 items-center justify-between w-full">
                      <div className="flex gap-6 items-center">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedData = [...applicantData];
                            updatedData[index].selected =
                              !updatedData[index].selected;
                            setApplicantData(updatedData);
                          }}
                          className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-white border-opacity-25 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-transparent before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                        />
                        <div className="">
                          <h1 className="text-base">
                            {item.firstName} {item.lastName}
                          </h1>
                          <p className="text-gray-500 text-sm">{item.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center justify-center">
                        {item.status == "Sent" && (
                          <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <p className="text-sm">Sent</p>
                          </div>
                        )}
                        {item.status == "Failed" && (
                          <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <p className="text-sm">Failed | {item.score}</p>
                          </div>
                        )}
                        {item.status == "Passed" && (
                          <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                            <p className="text-sm">Passed | {item.score}</p>
                          </div>
                        )}
                        {item.status == "Expired" && (
                          <div className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                            <p className="text-sm">Expired</p>
                          </div>
                        )}
                        <Image
                          src={Dropdown}
                          alt="Dropdown menu arrow"
                          width={15}
                          height={15}
                          className={
                            showOptionsIndex == index.toString()
                              ? "rotate-0 opacity-25 duration-100"
                              : "-rotate-90 opacity-25 duration-100"
                          }
                        ></Image>
                      </div>
                    </div>
                    {showOptionsIndex == index.toString() && (
                      <ul
                        className="flex gap-3 border-t w-full pt-3 border-t-slate-800 hover:cursor-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        
                        
                        <motion.li
                          className="flex gap-3 items-center justify-center p-1 px-3 bg-slate-800 rounded-full border border-slate-700 hover:bg-slate-700 shadow-lg cursor-pointer duration-100"
                          onClick={() => toast.success("Email sent.")}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: 0,
                            ease: "backOut",
                          }}
                        >
                          <button className="text-sm" onClick={handleButtonClick}>Send Interview Email</button>
                        </motion.li>
                        
                       
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`mx-1 px-2 rounded-full bg-transparent ${
                  currentPage === i + 1
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700'
                  }`}
                  >
                {i + 1}
                </button>
              ))}
              </div>
            </div>
            <div className="p-6 w-80  h-screen border-l border-slate-800">
              <div className="flex flex-col gap-2">
                <h1>Applicant Analytics</h1>
                <div className="">{/* DONUT CHART HERE */}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Applicants;
