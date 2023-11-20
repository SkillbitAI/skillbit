import Image from "next/image";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Arrow from "../../public/assets/icons/arrow.svg";
import { useRouter } from "next/navigation";
import Button from "@/components/button/button";

const scrolltoHash = function (element_id: string) {
  const element = document.getElementById(element_id);
  element?.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};
const Nav = () => {
  const router = useRouter();

  return (
    <div>
      <div className="backdrop-blur-md justify-between items-center gap-20 z-20 flex flex-row py-6">
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
        <ul className="list-none flex items-center justify-center">
          <li className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl">
            <div onClick={() => scrolltoHash("home")}>Home</div>
          </li>
          <li className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl">
            <div onClick={() => scrolltoHash("about")}>About</div>
          </li>
          <li className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl">
            Spacer
          </li>
          <li className="hover:cursor-pointer transition hover:bg-opacity-10 bg-opacity-0 bg-white p-3 rounded-xl">
            Contact
          </li>
        </ul>
        <div className="flex justify-end ">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white bg-opacity-10 px-6 py-3 rounded-lg flex justify-center items-center backdrop-blur-lg"
          >
            Get Started{" "}
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
        </div>
      </div>
      <div className="filter blur-2xl"></div>
    </div>
  );
};

export default Nav;
