/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress"; // Ensure correct import

const LinearProgressBar = ({
  time = 100,
  barColour,
  trackColour,
  nextPage = "#",
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [completed, setCompleted] = useState(false); // Track if animation is completed
  const navigate = useNavigate();
  const progressRef = useRef(() => {});

  useEffect(() => {
    progressRef.current = () => {
      if (progress >= 100) {
        setProgress(100);
        setBuffer(100);
        if (!completed) {
          setCompleted(true);
          if (onComplete) onComplete(); // Call onComplete prop
          setTimeout(() => {
            navigate(nextPage); // Redirect after a short delay
          }, 500);
        }
      } else {
        setProgress((prev) => prev + 1);
        if (buffer < 100 && progress % 5 === 0) {
          setBuffer(Math.min(100, buffer + 1 + Math.random() * 10));
        }
      }
    };
  });

  useEffect(() => {
    if (!completed) {
      const timer = setInterval(() => {
        progressRef.current();
      }, time); // Control speed using `time` prop

      return () => clearInterval(timer);
    }
  }, [completed, time]); // Dependency updated with `time`

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        sx={{
          "& .MuiLinearProgress-bar": { backgroundColor: barColour }, // Running bar color
          backgroundColor: trackColour, // Track color
          borderRadius: "10px", // Rounded corners
          height: "10px", // Adjust height if needed
        }}
        variant="determinate"
        value={progress}
        valueBuffer={buffer}
      />
    </Box>
  );
};

export default LinearProgressBar;
