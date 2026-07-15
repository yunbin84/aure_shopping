import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const isInvalidObjectId = (id) => !mongoose.Types.ObjectId.isValid(id);

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};

const populateCart = (cart) =>
  cart.populate({
    path: "items.product",
    select: "name sku barcode price category thumbnail description",
  });

export const getMyCart = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user.id);
    await populateCart(cart);

    res.json({
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "장바구니 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const { color, productId, quantity = 1, size } = req.body;

    if (!productId || isInvalidObjectId(productId)) {
      return res.status(400).json({
        message: "유효한 상품 ID가 필요합니다.",
      });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({
        message: "수량은 1개 이상이어야 합니다.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    const cart = await findOrCreateCart(req.user.id);
    const sameItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (item.size || "") === (size || "") &&
        (item.color || "") === (color || ""),
    );

    if (sameItem) {
      sameItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        thumbnail: product.thumbnail,
        price: product.price,
        quantity: Number(quantity),
        size,
        color,
      });
    }

    await cart.save();
    await populateCart(cart);

    res.status(201).json({
      message: "장바구니에 상품이 추가되었습니다.",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: "장바구니 상품 추가에 실패했습니다.",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { color, quantity, size } = req.body;

    if (isInvalidObjectId(itemId)) {
      return res.status(400).json({
        message: "유효한 장바구니 상품 ID가 필요합니다.",
      });
    }

    if (quantity !== undefined && Number(quantity) < 1) {
      return res.status(400).json({
        message: "수량은 1개 이상이어야 합니다.",
      });
    }

    const cart = await findOrCreateCart(req.user.id);
    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "장바구니 상품을 찾을 수 없습니다.",
      });
    }

    if (quantity !== undefined) {
      item.quantity = Number(quantity);
    }

    if (size !== undefined) {
      item.size = size;
    }

    if (color !== undefined) {
      item.color = color;
    }

    await cart.save();
    await populateCart(cart);

    res.json({
      message: "장바구니 상품이 수정되었습니다.",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      message: "장바구니 상품 수정에 실패했습니다.",
      error: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (isInvalidObjectId(itemId)) {
      return res.status(400).json({
        message: "유효한 장바구니 상품 ID가 필요합니다.",
      });
    }

    const cart = await findOrCreateCart(req.user.id);
    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "장바구니 상품을 찾을 수 없습니다.",
      });
    }

    item.deleteOne();
    await cart.save();
    await populateCart(cart);

    res.json({
      message: "장바구니 상품이 삭제되었습니다.",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "장바구니 상품 삭제에 실패했습니다.",
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();

    res.json({
      message: "장바구니가 비워졌습니다.",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "장바구니 비우기에 실패했습니다.",
      error: error.message,
    });
  }
};
