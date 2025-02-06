import { motion } from "framer-motion";
import logo from "../../assets/LOGO.png";
import heroBg from "../../assets/HERO_BG.png";
import { Button } from "../ui/button";
import { StepForward } from "lucide-react";

const HeroSection = () => {
  return (
    <>
      <section
        className="relative flex items-center justify-start w-full h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`, // Set background image dynamically
        }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-65"></div>
        <div className="z-10 text-white text-left px-6 sm:px-12 md:w-1/2">
          {/* Logo Above Heading, Positioned on the Left with Animation */}
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <img
              src={logo} // Replace with your logo URL
              alt="Logo"
              className="w-24 h-24 object-contain" // Adjust size as needed
            />
          </motion.div>

          {/* Heading Animation */}
          <motion.h1
            className="text-5xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
          >
            Welcome to the Future of Streaming
          </motion.h1>

          {/* Paragraph Animation */}
          <motion.p
            className="text-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
          >
            Experience a seamless, immersive viewing experience with exclusive
            shows and content.
          </motion.p>

          {/* Buttons with Gap Between Them */}
          <motion.div
            className="mt-4 flex gap-4" // Add gap between buttons
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {/* First Button with Zoom-out Animation */}
            <motion.div
              whileHover={{ scale: 0.95 }} // Scale down on hover (zoom-out)
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button className="px-6 py-6 bg-[#27272A] rounded-lg font-semibold transition duration-300">
                Get Started
              </Button>
            </motion.div>

            {/* Second Button with Zoom-out Animation */}
            <motion.div
              whileHover={{ scale: 0.95 }} // Scale down on hover (zoom-out)
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button className="px-6 py-6 bg-[#ff9000] text-white rounded-lg font-semibold  transition duration-300">
                Explore Collections <StepForward size={20} />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
