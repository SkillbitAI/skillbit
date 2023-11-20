import { motion } from "framer-motion";
import Card1 from "../../public/assets/images/Card1.png";
import Click from "../../public/assets/icons/click.svg";
import Brain from "../../public/assets/icons/brain.svg";
import Graph from "../../public/assets/icons/graph.svg";
import Image from "next/image";
import { useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div className="text-white flex items-center justify-center mt-40">
      <div className="px-6 max-w-7xl m-auto">
        <h1 ref={ref} className="text-5xl">
          <div
            style={{
              transform: isInView ? "none" : "translateX(-200px)",
              opacity: isInView ? "100" : "0",
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.1s",
            }}
          >
            <h1 className="text-6xl"> Optimize your talent search.</h1>
          </div>
        </h1>
        <p className="mt-4">
          Our simplified interface makes technical interviewing practical for
          recruiters in need of quality question assessment.
        </p>
        <div className="flex flex-col lg:flex-row justify-center gap-12 mt-16">
          <div className="rounded-xl relative text-left flex flex-col items-center gap-6 flex-1">
            {/* <div className="duration-100 rounded-xl flex justify-left gap-3">
              <div className="transition ease-out duration-100 delay-100 opacity-0 group-hover:opacity-100 rounded-xl overflow-hidden">
                <Image src={Card1} alt="" />
              </div>
              <div className="transition ease-out duration-200 delay-150 opacity-0 group-hover:opacity-100 rounded-xl overflow-hidden">
                <Image src={Card1} alt="" />
              </div>
              <div className="transition ease-out duration-300 delay-200 opacity-0 group-hover:opacity-100 rounded-xl overflow-hidden">
                <Image src={Card1} alt="" />
              </div>
            </div> */}
            <div className="p-10 bg-gradient-to-t from-indigo-600 to-transparent w-full flex justify-center items-center rounded-3xl">
              <Image src={Click} alt="" width={100} height={100}></Image>
            </div>
            <div className="flex flex-col gap-3">
              <h1>One-click question customization</h1>
              <p>
                Randomize and customize technical questions for each applicant
                to ensure evaluation integrity and accuracy.
              </p>
            </div>
          </div>
          <div className="rounded-xl relative text-left flex flex-col items-center gap-6 flex-1">
            <div className="p-10 bg-gradient-to-t from-indigo-600 to-transparent w-full flex justify-center items-center rounded-3xl">
              <Image src={Graph} alt="" width={100} height={100}></Image>
            </div>
            <div className="flex flex-col gap-3">
              <h1>Detailed evaluation insights</h1>
              <p>
                See detailed insights so you can make informed talent decisions.
              </p>
            </div>
          </div>
          <div className="rounded-xl relative text-left flex flex-col items-center gap-6 flex-1">
            <div className="p-10 bg-gradient-to-t from-indigo-600 to-transparent w-full flex justify-center items-center rounded-3xl">
              <Image src={Brain} alt="" width={100} height={100}></Image>
            </div>
            <div className="flex flex-col gap-3">
              <h1>Intelligent ranking and grading</h1>
              <p>
                Streamline your grading process with AI insights, uniquely
                generated for each applicant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

{
  /* <div className=" border-2 border-white/[.10] rounded-3xl relative h-[400px] w-[450px] mt-20 group">
            <div className="   hover:font-bold duration-100 rounded-xl absolute flex justify-left space-x-4">
              <div className="transition ease-out duration-100  my-5 delay-100 opacity-0 group-hover:opacity-100">
                <Image src={Card1} alt="" />
              </div>
              <div className="transition ease-out duration-200 my-5 delay-150 opacity-0 group-hover:opacity-100">
                <Image src={Card1} alt="" />
              </div>
              <div className="transition ease-out duration-300  my-5 delay-200 opacity-0 group-hover:opacity-100">
                <Image src={Card1} alt="" />
              </div>
              <div className="  hover:font-bold duration-100 text-2xl absolute bottom-0 top-40 translate-y-full  h-[100px] text-left">
                blahblah BLAH! blah.
              </div>
            </div>

            <div className="h-px  absolute bottom-40 inset-x-0 bg-gray-200 border-0 opacity-20 "></div>

            <div className="text-left absolute inset-x-4 bottom-5">
              Helo hasf;lkjsdkljfhlsadjfghasjklgh;klasjdg LS;KGDJASDL;KJ
              SLAD;KGA,MGNCKLJAG{" "}
            </div>
          </div> */
}
