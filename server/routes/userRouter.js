import express from "express";
import {
  createUser,
  deleteUser,
  getMyProfile,
  getUserById,
  getUsers,
  loginUser,
  updateUser,
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/me", protect, getMyProfile);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
