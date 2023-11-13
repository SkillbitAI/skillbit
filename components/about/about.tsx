import { motion } from 'framer-motion';
import Card1 from "../../public/assets/images/Card1.png";
import Image from "next/image";
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <div className="text-white text-center bg-gradient-to-b from-transparent to-indigo-900 flex items-center my-20">
  <div className="relative max-w-screen-3xl my-20 mx-auto">
    
    <h1 ref={ref} className="text-5xl mt-10"><div style={{
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? "100" : "0",
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.1s"
        }}>Optimize your talent search.</div></h1>
    <p className="mt-10">
      Our simplified interface makes technical interviewing practical for recruiters in need of quality question assessment.
    </p>
    <div className="flex flex-col lg:flex-row items-center gap-40">
      <div className=" border-2 border-white/[.10] rounded-3xl relative h-[400px] w-[450px] mt-20 group">
        <div className="  hover:font-bold duration-100 rounded-xl absolute flex justify-left space-x-4">
          <div className="transition ease-out duration-100  my-5 delay-100 opacity-0 group-hover:opacity-100 ">
            <Image src={Card1} alt="" />
          </div>
          <div className="transition ease-out duration-200 my-5 delay-150 opacity-0 group-hover:opacity-100">
            <Image src={Card1} alt="" />
          </div>
          <div className="transition ease-out duration-300  my-5 delay-200 opacity-0 group-hover:opacity-100">
            <Image src={Card1} alt="" />
          </div>
          <div className="hover:font-bold duration-100 text-2xl absolute bottom-0 top-40 translate-y-full  h-[100px] text-left">Specification is Key.</div>
        </div>
        
        <div className="h-px  absolute bottom-40 inset-x-0 bg-gray-200 border-0 opacity-20 "></div>
        
        <div className="text-left absolute inset-x-4 bottom-5">Generate code with topic specific questions. Take a step further and customize as you wish.</div>
      </div>
      <div className=" border-2 border-white/[.10] rounded-3xl relative h-[400px] w-[450px] mt-20 group">
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
          <div className="  hover:font-bold duration-100 text-2xl absolute bottom-0 top-40 translate-y-full  h-[100px] text-left">blahblah BLAH! blah.</div>
        </div>
        
        <div className="h-px  absolute bottom-40 inset-x-0 bg-gray-200 border-0 opacity-20 "></div>
        
        <div className="text-left absolute inset-x-4 bottom-5">Helo hasf;lkjsdkljfhlsadjfghasjklgh;klasjdg LS;KGDJASDL;KJ SLAD;KGA,MGNCKLJAG </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default About;


