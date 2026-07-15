import express from "express";
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getMyCart,
  updateCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyCart);
router.post("/", protect, addCartItem);
router.put("/items/:itemId", protect, updateCartItem);
router.delete("/items/:itemId", protect, deleteCartItem);
router.delete("/", protect, clearCart);

export default router;
