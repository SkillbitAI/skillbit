import { motion } from "framer-motion";
import Card1 from "../../public/assets/images/Card1.png";
import Click from "../../public/assets/icons/click.svg";
import Brain from "../../public/assets/icons/brain.svg";
import Graph from "../../public/assets/icons/graph.svg";
import Arrow from "../../public/assets/icons/arrow.svg";
import Image from "next/image";
import { useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div
      className="text-white flex items-center justify-center mt-40 pb-32 pt-20"
      id="features"
    >
      <div className="px-6 max-w-7xl m-auto">
        <h1 ref={ref} className="text-5xl">
          {isInView && (
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.5, ease: "backOut" }}
            >
              <h1 className="text-6xl"> Optimize your talent search</h1>
            </motion.div>
          )}
        </h1>
        <p className="mt-4">
          Our simplified interface makes technical interviewing practical for
          recruiters in need of quality question assessment.
        </p>
        <div className="flex flex-col lg:flex-row justify-center gap-6 mt-16">
          <motion.div
            className="rounded-2xl relative text-left flex flex-col gap-6 flex-1 p-3"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0, ease: "backOut" }}
            whileHover={"hover"}
          >
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
            <div className="p-10 bg-indigo-600 w-full flex justify-center items-center rounded-xl shadow-lg relative">
              <Image
                src={Click}
                alt=""
                width={100}
                height={100}
                className="drop-shadow-[0_35px_35px_#4338ca]"
              ></Image>
              <div className="w-20 h-20 bg-white opacity-10 rounded-lg absolute -left-5 -top-5"></div>
              <div className="w-14 h-14 bg-white opacity-10 rounded-lg absolute -left-10 -top-10"></div>
            </div>
            <div className="flex flex-col gap-3 p-3">
              <h1>One-click customization</h1>
              <p>
                Randomize and customize technical questions for each applicant
                to ensure evaluation integrity and accuracy.
              </p>
              <button className="mt-3 rounded-lg flex justify-start items-center underline">
                Learn more
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
          </motion.div>
          <motion.div
            className="rounded-2xl relative text-left flex flex-col gap-6 flex-1 p-3"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
          >
            <div className="p-10 bg-indigo-600 w-full flex justify-center items-center rounded-xl shadow-lg relative">
              <Image
                src={Graph}
                alt=""
                width={100}
                height={100}
                className="drop-shadow-[0_35px_35px_#4338ca]"
              ></Image>
            </div>
            <div className="flex flex-col gap-3 p-3">
              <h1>Detailed evaluation insights</h1>
              <p>
                See detailed insights so you can make informed talent decisions.
              </p>
              <button className="mt-3 rounded-lg flex justify-start items-center underline">
                Learn more
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
          </motion.div>
          <motion.div
            className="rounded-2xl relative text-left flex flex-col gap-6 flex-1 p-3"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "backOut" }}
          >
            <div className="p-10 bg-indigo-600 w-full flex justify-center items-center rounded-xl shadow-lg relative">
              <Image
                src={Brain}
                alt=""
                width={100}
                height={100}
                className="drop-shadow-[0_35px_35px_#4338ca]"
              ></Image>
            </div>
            <div className="flex flex-col gap-3 p-3">
              <h1>Intelligent ranking & grading</h1>
              <p>
                Streamline your grading process with AI insights, uniquely
                generated for each applicant.
              </p>
              <button className="mt-3 rounded-lg flex justify-start items-center underline">
                Learn more
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
          </motion.div>
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
