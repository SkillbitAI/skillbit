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
      <div className="fixed w-full top-0   backdrop-blur-md justify-between items-center gap-20 z-20 flex flex-row">
        <ul className=" ml-[10px] left-10 basis-1/3 list-none flex gap-6">
          <li className="opacity-60 hover:cursor-pointer hover:opacity-100 transition duration-500 hover:scale-125">
            <div onClick={() => scrolltoHash("home")}>Home</div>
          </li>
          <li className="opacity-60 hover:cursor-pointer hover:opacity-100 transition duration-500 hover:scale-125">
            <div onClick={() => scrolltoHash("about")}>About</div>
          </li>
          <li className="opacity-60 hover:cursor-pointer hover:opacity-100 transition duration-500 hover:scale-125">
            Spacer
          </li>
          <li className="opacity-60 hover:cursor-pointer hover:opacity-100 transition duration-500 hover:scale-125">
            Contact
          </li>
        </ul>
        <div className="ml-[-10px] basis-1/3 flex justify-center items-center gap-2">
          <Image
            src={Logo}
            alt=""
            width={100}
            height={100}
            style={{ margin: "-30px" }}
          ></Image>
          <h1 className="">Skillbit</h1>
        </div>
        <div className="mr-[10px] basis-1/3 flex justify-end ">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-indigo-600 bg-opacity-50 border border-white border-opacity-50 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100 hover:bg-indigo-950 duration-200 hover:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#4f46e5,0_0_15px_#4f46e5,0_0_30px_#4f46e5]"
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
