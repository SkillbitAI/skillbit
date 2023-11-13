import Image from "next/image";
import Logo from "../../public/assets/branding/logos/logo_mini_transparent_white.png";
import Arrow from "../../public/assets/icons/arrow.svg";
import { useRouter } from "next/navigation";

const Button = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/auth")}
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
  );
};

export default Button;
