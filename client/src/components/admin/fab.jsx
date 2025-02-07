/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const FloatingActionButton = ({ onFabClick }) => {
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    if (onFabClick) {
      onFabClick();
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ width: 56 }}
        animate={{ width: hover ? 140 : 56 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "50px",
          backgroundColor: "#155dfc",
          padding: "0 10px",
          overflow: "hidden",
        }}
      >
        <Fab
          aria-label="Add"
          sx={{
            minWidth: "auto",
            height: 56,
            boxShadow: "none",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent", // No darken effect on hover
            },
          }}
          onClick={handleClick} // Use the handleClick to dispatch the openSheet action
        >
          <AddIcon sx={{ color: "white" }} />
        </Fab>
        {hover && (
          <button className="cursor-pointer" onClick={handleClick}>
            <Typography
              sx={{
                color: "white",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Add Show
            </Typography>
          </button>
        )}
      </motion.div>
    </Box>
  );
};

export default FloatingActionButton;
