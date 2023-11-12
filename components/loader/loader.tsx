import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="graphPaper bg-slate-900 text-white h-screen w-screen flex items-center justify-center flex-col">
      {/* LOGO */}
      <div className="flex">
        <motion.div
          className="w-12 h-12 bg-white rounded-xl rotate-45 -mr-1"
          // initial={{ opacity: 0, y: 200, rotate: 0, scale: 0 }}
          // animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
          // transition={{ duration: 1, delay: 0, ease: "backOut" }}
        ></motion.div>
        <motion.div
          className="w-12 h-12 bg-white rounded-xl rotate-45 -ml-1"
          // initial={{ opacity: 0, y: -200, rotate: 0, scale: 0 }}
          // animate={{ opacity: 1, y: 0, rotate: 45, scale: 1 }}
          // transition={{ duration: 1, delay: 0.2, ease: "backOut" }}
        ></motion.div>
      </div>
      <motion.p
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="mt-10"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loader;
