import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <h1 className="text-6xl font-bold">

        Analyze Stocks With

        <span className="text-blue-500">
          {" "}AI
        </span>

      </h1>

      <p className="mt-5 text-slate-400 text-lg">

        Research any stock in seconds using
        Gemini AI + Finnhub data.

      </p>
    </motion.div>
  );
};

export default Hero;