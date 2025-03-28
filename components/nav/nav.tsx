import Image from "next/image";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Arrow from "../../public/assets/icons/arrow.svg";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Nav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const scrolltoHash = function (element_id: string) {
    const element = document.getElementById(element_id);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const [scrolling, setScrolling] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname !== "/applicantGuide" && pathname !== "/recruiterGuide") {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 500;
        setScrolling(isScrolled);
      };
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [pathname]);

  const isApplicantGuidePage = pathname === "/applicantGuide";
  const isRecruiterGuidePage = pathname === "/recruiterGuide";
  const navbarPosition =
    isApplicantGuidePage || isRecruiterGuidePage ? "static" : "fixed";
  const backgroundClass =
    scrolling && !isApplicantGuidePage && !isRecruiterGuidePage
      ? "bg-slate-900 bg-opacity-50 py-3"
      : "py-6";

  return (
    <div
      className={`${navbarPosition} w-full top-0 left-0 right-0 backdrop-blur-lg z-50 duration-200 border-b border-white/10 px-6 ${backgroundClass}`}
    >
      <div className="justify-between items-center gap-20 flex flex-row max-w-7xl m-auto">
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
        <ul className="list-none hidden md:flex items-center justify-center gap-3">
          {status === "authenticated" ? (
            <li
              className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl"
              onClick={() => router.push("/dashboard")}
            >
              Home
            </li>
          ) : (
            <li
              className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl"
              onClick={() => scrolltoHash("top")}
            >
              Home
            </li>
          )}
          <li
            className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl"
            onClick={() => scrolltoHash("features")}
          >
            Features
          </li>
          <li
            className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl"
            onClick={() => scrolltoHash("how it works")}
          >
            How It Works
          </li>
          <li
            className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl"
            onClick={() => router.push("/support")}
          >
            Contact
          </li>
        </ul>
        <div className="flex justify-end ">
          {status === "authenticated" ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-white bg-opacity-10 px-6 py-3 rounded-lg flex justify-center items-center backdrop-blur-lg"
            >
              Go to Dashboard
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
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="bg-white bg-opacity-10 px-6 py-3 rounded-lg flex justify-center items-center backdrop-blur-lg"
            >
              Sign In
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
            </button>
          )}
        </div>
      </div>
      <div className="filter blur-2xl"></div>
    </div>
  );
};

export default Nav;
