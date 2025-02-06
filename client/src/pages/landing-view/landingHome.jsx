import { useState } from "react";
import Processbar from "../../components/landing/processBar";
import HeroSection from "../../components/landing/HeroSection";

const LandingHome = () => {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      {showContent ? (
        <HeroSection />
      ) : (
        <Processbar onComplete={() => setShowContent(true)} />
      )}
    </div>
  );
};

export default LandingHome;
