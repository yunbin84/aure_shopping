import mongoose from "mongoose";
import Product from "../models/Product.js";

const isInvalidObjectId = (id) => !mongoose.Types.ObjectId.isValid(id);

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 2, 1);
    const skip = (page - 1) * limit;
    const query = req.query.category ? { category: req.query.category } : {};
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      pagination: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "상품 목록 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 상품 ID입니다.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "상품 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "상품이 생성되었습니다.",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "이미 사용 중인 SKU입니다.",
      });
    }

    res.status(400).json({
      message: "상품 생성에 실패했습니다.",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 상품 ID입니다.",
      });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.json({
      message: "상품이 수정되었습니다.",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "이미 사용 중인 SKU입니다.",
      });
    }

    res.status(400).json({
      message: "상품 수정에 실패했습니다.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 상품 ID입니다.",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.json({
      message: "상품이 삭제되었습니다.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "상품 삭제에 실패했습니다.",
      error: error.message,
    });
  }
};
