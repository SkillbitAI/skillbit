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
          <Button></Button>
        </div>
      </div>
      <div className="filter blur-2xl"></div>
    </div>
  );
};

export default Nav;
