import { motion, Variants } from "framer-motion";

const Loader = () => {
  const logoVariants: Variants = {
    hidden: (i: number) => ({
      x: i === 0 ? -50 : 50, // Left square from left, right square from right
      opacity: 0,
    }),
    visible: {
      x: 0, // Move to center
      scale: [2, 2, 1, 1, 1],
      rotate: [0, 0, 180, 180, 45],
      borderRadius: ["0%", "0%", "50%", "50%", "25%"],
      opacity: [0, 1, 1,],
      transition: {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
    exit: { y: 100, opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 z-50">
      <div className="graphPaper bg-slate-900 text-white h-screen w-screen flex items-center justify-center flex-col">
        {/* LOGO */}
        <div className="flex">
          {/* First Square */}
          <motion.div
            className="w-12 h-12 bg-white rounded-xl -mr-2"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            custom={0} // First square has no delay
          ></motion.div>

          {/* Second Square */}
          <motion.div
            className="w-12 h-12 bg-white rounded-xl -ml-2"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            custom={1} // Second square has a delay
          ></motion.div>
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mt-8 text-lg"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;
