/* eslint-disable react/prop-types */
import LinearProgress from "./LinearProgress";
import LOGO_NAME from "../../assets/LOGO_NAME.png";

const Processbar = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <img
        src={LOGO_NAME}
        alt="Loading Image"
        className="w-64 h-64 object-contain mb-4"
      />
      <div className="w-3/9">
        <LinearProgress barColour={"#ff9000"} time={13} onComplete={onComplete} />
      </div>
    </div>
  );
};

export default Processbar;
