"use client";

import { motion } from "framer-motion";

const AuthError = () => {
  return (
    <div className="graphPaper bg-slate-900 text-white h-screen w-screen flex items-center justify-center flex-col">
      {/* LOGO */}
      <div className="flex">
        <motion.div
          className="w-12 h-12 bg-white rounded-xl rotate-45 -mr-1"
          //   initial={{ opacity: 0, y: 200, rotate: 0, scale: 0 }}
          //   animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
          //   transition={{ duration: 1, delay: 0, ease: "backOut" }}
        ></motion.div>
        <motion.div
          className="w-12 h-12 bg-white rounded-xl rotate-45 -ml-1"
          //   initial={{ opacity: 0, y: -200, rotate: 0, scale: 0 }}
          //   animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
          //   transition={{ duration: 1, delay: 0.2, ease: "backOut" }}
        ></motion.div>
      </div>
      <motion.p className="mt-10">
        An error occured. Please try again later.
      </motion.p>
    </div>
  );
};

export default AuthError;
