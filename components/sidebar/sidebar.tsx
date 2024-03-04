"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, createRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import Nav from "@/components/nav/nav";
import Image from "next/image";
import Arrow from "../../public/assets/icons/arrow.svg";
import Demo from "../../public/assets/images/demo.png";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Loader from "../loader/loader";
import { Toaster, toast } from "react-hot-toast";
import Plus from "../../public/assets/icons/plus.svg";

//dashboard icons
import DashboardIcon from "../../public/assets/icons/dashboard.svg";
import DashboardIconWhite from "../../public/assets/icons/dashboard_white.svg";
import ApplicantsIcon from "../../public/assets/icons/applicants.svg";
import CompanyIcon from "../../public/assets/icons/company.svg";
import SupportIcon from "../../public/assets/icons/support.svg";
import WorkshopIcon from "../../public/assets/icons/workshop.svg";
import ProfileIcon from "../../public/assets/icons/profile.svg";
import QuestionIcon from "../../public/assets/icons/question.svg";
import SearchIcon from "../../public/assets/icons/search.svg";
import SettingsIcon from "../../public/assets/icons/settings.svg";
import LogoutIcon from "../../public/assets/icons/logout.svg";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../../public/assets/icons/dropdown.svg";

interface Question {
  title: string;
  language: string;
  framework: string;
  type: string;
  companyID: string;
  userId: string;
  id: string;
}

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
}

interface TestIDInterface {
  applicant: ApplicantDataInterface;
  applicantID: string;
  companyID: string;
  uid: string;
  selected: boolean;
}
interface ApplicantDataInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  score: string;
}

const Sidebar = () => {
  const path = usePathname();
  const router = useRouter();

  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [newQuestionButton, setNewQuestionButton] = useState(false);
  const [card, setCard] = useState(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [userCompanyName, setUserCompanyName] = useState(null);
  const [userCompanyId, setUserCompanyId] = useState(null);
  const [userCompanyJoinCode, setUserCompanyJoinCode] = useState(null);
  const [userApprovalStatus, setUserApprovalStatus] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [applicantData, setApplicantData] = useState<TestIDInterface[]>([]);

  const [deleteQuestionWarning, setDeleteQuestionWarning] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [framework, setFramework] = useState("");
  const [type, setType] = useState("");
  const [showQuestionOptions, setShowQuestionOptions] = useState("");
  const [lastEmployeeWarning, setLastEmployeeWarning] = useState(false);
  const [date, setDate] = useState("");

  const [unsent, setUnsent] = useState(0);
  const [sent, setSent] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [expired, setExpired] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [searchClick, setSearchClick] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState<
    TestIDInterface[]
  >([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  const questionTitleRef = createRef<HTMLInputElement>();

  const getApplicants = async (companyId: string) => {
    //getting applicants from the database
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "getApplicants",
          company: companyId,
        }),
      });
      const data = await response.json();
      console.log(data);
      setApplicantData(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const findQuestions = async (company: string) => {
    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "findQuestions",
          company: company,
        }),
      });
      const data = await response.json();
      setQuestions(data.message.reverse());
      setCurrentQuestion(data.message[0]);
      setNewTitle(data.message[0].title);
      console.log(data);
    } catch (error) {
      console.error("Error finding questions: ", error);
    }
  };

  const findEmployees = async (companyId: string) => {
    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        action: "findEmployees",
        company: companyId,
      }),
    });
    const data = await response.json();
    setEmployees(data.message);
  };

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function (...args: any) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Search function
  const search = (term: string) => {
    // Filter applicants
    const filteredApplicants = applicantData.filter(
      (applicant) =>
        applicant.applicant.firstName
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        applicant.applicant.lastName
          .toLowerCase()
          .includes(term.toLowerCase()) ||
        applicant.uid.toLowerCase().includes(term.toLowerCase()) ||
        applicant.applicant.email.toLowerCase().includes(term.toLowerCase())
    );

    // Filter questions
    const filteredQuestions = questions.filter(
      (question) =>
        question.title.toLowerCase().includes(term.toLowerCase()) ||
        question.type.toLowerCase().includes(term.toLowerCase()) ||
        question.framework.toLowerCase().includes(term.toLowerCase()) ||
        question.language.toLowerCase().includes(term.toLowerCase())
    );

    // Filter employees
    const filteredEmployees = employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(term.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(term.toLowerCase()) ||
        employee.email.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredApplicants(filteredApplicants);
    setFilteredQuestions(filteredQuestions);
    setFilteredEmployees(filteredEmployees);
    setIsLoading(false);
  };

  const debouncedSearch = debounce(search, 300);

  useEffect(() => {
    setIsLoading(true);
    if (searchTerm.length >= 2) {
      debouncedSearch(searchTerm);
    } else {
      setFilteredApplicants([]);
      setFilteredQuestions([]);
      setFilteredEmployees([]);
    }
  }, [searchTerm]);

  const { data: session, status } = useSession();

  useEffect(() => {
    const getData = async () => {
      if (session) {
        toast.remove();
        toast.loading("Loading...");
        // console.log("Hello world!");
        //other than print hello world, set user data here
        setEmail(session.user?.email || "");
        const userResponse = await fetch("/api/database", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "findUserByEmail",
            email: session.user?.email,
          }),
        });
        const userData = await userResponse.json();

        setFirstName(userData.message.firstName);
        setLastName(userData.message.lastName);

        const dateFormat = new Date();
        setDate(
          dateFormat.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })
        );

        if (
          userData.message.employee &&
          userData.message.employee.company.name &&
          userData.message.employee.company.id &&
          userData.message.employee.isApproved != null
        ) {
          setUserCompanyName(userData.message.employee.company.name);
          setUserCompanyId(userData.message.employee.company.id);
          setUserCompanyJoinCode(userData.message.employee.company.join_code);
          setUserApprovalStatus(userData.message.employee.isApproved);
          await getApplicants(userData.message.employee.company.id);
          await findQuestions(userData.message.employee.company.id);
          await findEmployees(userData.message.employee.company.id);
        }
        setCompanyDataLoaded(true);
        toast.remove();
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

  return (
    <>
      <AnimatePresence>
        {searchClick && (
          <motion.div
            className="fixed left-0 right-0 bottom-0 top-0 z-50 flex justify-center items-center flex-col bg-slate-950 bg-opacity-60 py-6 lg:px-40 2xl:px-80 px-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "backOut",
            }}
            exit={{ opacity: 0, y: 30 }}
          >
            <motion.button
              className="bg-slate-900 border border-slate-800 p-2 rounded-full flex justify-center items-center gap-2"
              onClick={() => setSearchClick(false)}
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
            <motion.div
              className="flex flex-col gap-6 p-3 w-full"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(51 65 85) transparent",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "backOut",
              }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div
                className="flex-1 bg-slate-900 p-6 rounded-xl flex justify-between border border-slate-800"
                onClick={() => setSearchClick(true)}
              >
                <input
                  className="text-white text-2xl bg-transparent focus:outline-none w-full placeholder:text-white text-ellipsis"
                  placeholder="Search candidates, templates, or employees..."
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                ></input>
                {(!isLoading || searchTerm.length < 2) && (
                  <Image src={SearchIcon} alt="" width={30} height={30}></Image>
                )}
                {isLoading && searchTerm.length >= 2 && (
                  <div className="flex justify-center items-center">
                    <div className="lds-ring">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                )}
              </div>
              {searchTerm.length < 2 && (
                <p className="text-slate-400 text-center -mt-2">
                  Input at least 2 characters.
                </p>
              )}
              {searchTerm.length >= 2 &&
                filteredApplicants.length == 0 &&
                filteredEmployees.length == 0 &&
                filteredQuestions.length == 0 &&
                !isLoading && (
                  <p className="text-slate-400 text-center -mt-2">
                    No search results.
                  </p>
                )}
              {searchTerm.length >= 2 && isLoading && (
                <p className="text-slate-400 text-center -mt-2">Searching...</p>
              )}
            </motion.div>
            <div
              className="overflow-y-auto w-full"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(51 65 85) transparent",
              }}
            >
              <AnimatePresence>
                {" "}
                {filteredApplicants &&
                  filteredApplicants.length != 0 &&
                  searchTerm.length >= 2 && (
                    <motion.div className="flex flex-col gap-6 p-3 w-full">
                      <div className="flex gap-1">
                        <p>From:</p>
                        <h2>Candidates</h2>
                      </div>
                      <div
                        className="bg-slate-900 rounded-xl flex flex-col border border-slate-800 px-6 py-3 max-h-96 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "rgb(51 65 85) transparent",
                        }}
                      >
                        {filteredApplicants.map((applicant) => (
                          <>
                            <div className="flex justify-between items-center duration-100 p-3">
                              <div className="flex flex-col gap-1 ">
                                <h2>
                                  {applicant.applicant.firstName}{" "}
                                  {applicant.applicant.lastName}
                                </h2>
                                <div className="flex gap-1 flex-col mt-3">
                                  <p className="text-slate-400">
                                    Test ID:{" "}
                                    <span className="bg-slate-800 border border-slate-700 py-1 px-2 rounded-xl">
                                      {applicant.uid}
                                    </span>
                                  </p>
                                  <p className="text-slate-400">
                                    {applicant.applicant.email}
                                  </p>
                                </div>
                              </div>
                              {/* <Image
                                src={Dropdown}
                                alt="Dropdown menu arrow"
                                width={15}
                                height={15}
                                className="-rotate-90"
                              ></Image> */}
                            </div>
                            {filteredApplicants.length != 1 && (
                              <hr className="border-t-0 border-b border-b-slate-800 w-full" />
                            )}
                          </>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
              <AnimatePresence>
                {filteredQuestions &&
                  filteredQuestions.length != 0 &&
                  searchTerm.length >= 2 && (
                    <motion.div className="flex flex-col gap-6 p-3 w-full">
                      <div className="flex gap-1">
                        <p>From:</p>
                        <h2>Templates</h2>
                      </div>
                      <div
                        className="bg-slate-900 rounded-xl flex flex-col border border-slate-800 px-6 py-3 max-h-96 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "rgb(51 65 85) transparent",
                        }}
                      >
                        {filteredQuestions.map((question) => (
                          <>
                            <div className="flex justify-between items-center duration-100 p-3">
                              <div className="flex flex-col gap-1 ">
                                <h2>{question.title}</h2>
                                <div className="flex gap-3 flex-wrap">
                                  <p className="p-2 bg-slate-800 border border-slate-700 rounded-xl w-fit text-slate-400">
                                    {question.type}
                                  </p>
                                  <p className="p-2 bg-slate-800 border border-slate-700 rounded-xl w-fit text-slate-400">
                                    {question.language}
                                  </p>
                                  {question.framework.length > 0 && (
                                    <p className="p-2 bg-slate-800 border border-slate-700 rounded-xl w-fit text-slate-400">
                                      {question.framework}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* <Image
                                src={Dropdown}
                                alt="Dropdown menu arrow"
                                width={15}
                                height={15}
                                className="-rotate-90"
                              ></Image> */}
                            </div>
                            {filteredQuestions.length != 1 && (
                              <hr className="border-t-0 border-b border-b-slate-800 w-full" />
                            )}{" "}
                          </>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>

              <AnimatePresence>
                {filteredEmployees &&
                  filteredEmployees.length != 0 &&
                  searchTerm.length >= 2 && (
                    <motion.div className="flex flex-col gap-6 p-3 w-full">
                      <div className="flex gap-1">
                        <p>From:</p>
                        <h2>Employees</h2>
                      </div>
                      <div
                        className="bg-slate-900 rounded-xl flex flex-col border border-slate-800 px-6 py-3 max-h-96 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "rgb(51 65 85) transparent",
                        }}
                      >
                        {filteredEmployees.map((employee) => (
                          <>
                            <div className="flex justify-between items-center duration-100 p-3">
                              <div className="flex flex-col gap-1 ">
                                <h2>
                                  {employee.firstName} {employee.lastName}
                                </h2>
                                <div className="flex gap-3 flex-wrap">
                                  <p className="text-slate-400">
                                    {employee.email}
                                  </p>
                                </div>
                              </div>
                              {/* <Image
                                src={Dropdown}
                                alt="Dropdown menu arrow"
                                width={15}
                                height={15}
                                className="-rotate-90"
                              ></Image> */}
                            </div>
                            {filteredEmployees.length != 1 && (
                              <hr className="border-t-0 border-b border-b-slate-800 w-full" />
                            )}{" "}
                          </>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-slate-900 h-screen border-slate-800 border-r w-72">
        <div className="fixed bg-slate-900 h-screen border-slate-800 border-r w-72">
          <div className="flex items-center gap-2 m-6">
            <Image
              src={Logo}
              alt=""
              width={110}
              height={110}
              style={{ margin: "-30px" }}
            ></Image>
            <h1 className="text-white text-3xl">Skillbit</h1>
          </div>
          <div className="flex flex-col justify-between mt-6 gap-2 absolute top-16 bottom-6 left-0 right-0 overflow-y-auto">
            <ul className="list-none text-white flex flex-col gap-6">
              <div
                className="flex-1 max-w-xl bg-slate-800 p-2 rounded-lg flex justify-between border border-slate-700 mx-6 cursor-pointer"
                onClick={() => setSearchClick(true)}
              >
                <div className="text-white bg-transparent focus:outline-none w-full placeholder:text-white text-ellipsis">
                  Search...
                </div>
                <Image src={SearchIcon} alt="" width={25} height={25}></Image>
              </div>
              <hr className="border-t border-slate-800" />
              <li
                className={
                  path == "/dashboard"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/dashboard")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/dashboard" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={DashboardIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Dashboard</p>
                </div>
              </li>
              <li
                className={
                  path == "/applicants"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/applicants")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/applicants" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={ApplicantsIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Candidate Manager</p>
                </div>
              </li>
              <li
                className={
                  path == "/questionWorkshop"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/questionWorkshop")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/questionWorkshop" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={WorkshopIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Template Workshop</p>
                </div>
              </li>
              <li
                className={
                  path == "/companyProfile"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/companyProfile")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/companyProfile" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={CompanyIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Company Profile</p>
                </div>
              </li>
            </ul>
            <ul className="list-none text-white flex flex-col gap-6 mt-4">
              <li
                className={
                  path == "/support"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/support")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/support" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={QuestionIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Support</p>
                </div>
              </li>
              <li
                className={
                  path == "/settings"
                    ? "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer"
                    : "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => router.push("/settings")}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: path == "/settings" ? "1" : "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image
                    src={SettingsIcon}
                    alt=""
                    width={25}
                    height={25}
                  ></Image>
                  <p>Settings</p>
                </div>
              </li>
              <li
                className={
                  "rounded-lg flex items-center gap-6 duration-100 text-white cursor-pointer opacity-50"
                }
                onClick={() => signOut()}
              >
                <div
                  className="w-1 h-4 rounded-r-md bg-white"
                  style={{ opacity: "0" }}
                ></div>
                <div className="flex gap-2">
                  <Image src={LogoutIcon} alt="" width={25} height={25}></Image>
                  <p>Log Out</p>
                </div>
              </li>
              <hr className="border-t border-slate-800" />
              <div className="mx-6 flex gap-2 items-center">
                <div className=" rounded-full p-1">
                  <Image
                    src={ProfileIcon}
                    width={35}
                    height={35}
                    alt="Profile"
                  ></Image>
                </div>
                <div className="">
                  <h2>
                    {firstName} {lastName}
                  </h2>
                  <p className="text-white opacity-50">{email}</p>
                </div>
              </div>
              {/* <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-white hover:bg-opacity-10 duration-100">
                <Image src={SupportIcon} alt="" width={25} height={25}></Image>
                <p>Contact Support</p>
              </li>
              <li className="p-2 rounded-lg flex items-center gap-2 hover:bg-white hover:bg-opacity-10 duration-100">
                <Image src={SettingsIcon} alt="" width={25} height={25}></Image>
                <p>Manage Account</p>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
