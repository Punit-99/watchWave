import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} from "../../controllers/auth/auth-controller.js";

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authentic user!",
    user,
  });
});

export default router;
