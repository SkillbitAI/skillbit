import Image from "next/image";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Arrow from "../../public/assets/icons/arrow.svg";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center gap-4 z-20 relative bg-transparent">
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
      <ul className="list-none flex gap-6">
        <li className="">Home</li>
        <li className="opacity-60">About</li>
        <li className="opacity-60">Recruiters</li>
        <li className="opacity-60">Contact</li>
      </ul>
      <button
        onClick={() => router.push("/dashboard")}
        className="bg-indigo-600 bg-opacity-50 border border-indigo-600 border-opacity-50 px-6 py-3 rounded-lg flex justify-center items-center hover:bg-opacity-100 duration-200"
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
  );
};

export default Nav;
