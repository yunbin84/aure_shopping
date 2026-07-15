import mongoose from "mongoose";
import Order from "../models/Order.js";

const PORTONE_V2_API_BASE_URL = "https://api.portone.io";

const getPortOnePayment = async (paymentId) => {
  const response = await fetch(`${PORTONE_V2_API_BASE_URL}/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `PortOne ${process.env.PORTONE_V2_API_SECRET || process.env.portone_v2_api_secret}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "결제 정보를 조회할 수 없습니다.");
  }

  return data;
};

const isInvalidObjectId = (id) => !mongoose.Types.ObjectId.isValid(id);

const generateOrderNumber = () => {
  const date = new Date();
  const timestamp = date
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

  return `ORD-${timestamp}-${random}`;
};

const getOrderQueryByRole = (req) => {
  const query = req.user?.user_type === "admin" ? {} : { user: req.user.id };
  const statuses = (req.query.status || "")
    .split(",")
    .map((status) => status.trim())
    .filter(Boolean);

  if (statuses.length > 0) {
    query.orderStatus = { $in: statuses };
  }

  return query;
};

const canAccessOrder = (req, order) =>
  req.user?.user_type === "admin" || order.user.toString() === req.user.id;

export const getOrders = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const query = getOrderQueryByRole(req);
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find(query)
      .populate("user", "email name user_type")
      .populate("items.product", "name sku price thumbnail category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        limit,
        totalOrders,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "주문 목록 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 주문 ID입니다.",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "email name user_type")
      .populate("items.product", "name sku price thumbnail category");

    if (!order) {
      return res.status(404).json({
        message: "주문을 찾을 수 없습니다.",
      });
    }

    if (!canAccessOrder(req, order)) {
      return res.status(403).json({
        message: "해당 주문에 접근할 권한이 없습니다.",
      });
    }

    res.json({
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "주문 조회에 실패했습니다.",
      error: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { impUid, merchantUid } = req.body.payment || {};

    if (!impUid || !merchantUid) {
      return res.status(400).json({
        message: "결제 정보(imp_uid, merchant_uid)가 없습니다.",
      });
    }

    const duplicateOrder = await Order.findOne({
      $or: [{ "payment.impUid": impUid }, { "payment.merchantUid": merchantUid }],
    });

    if (duplicateOrder) {
      return res.status(409).json({
        message: "이미 처리된 주문입니다.",
      });
    }

    let paymentInfo;

    try {
      paymentInfo = await getPortOnePayment(merchantUid);
    } catch (error) {
      console.error("[결제 검증 오류]", { impUid, merchantUid }, error);
      return res.status(502).json({
        message: "결제 검증 중 오류가 발생했습니다.",
        error: error.message,
      });
    }

    if (paymentInfo.status !== "PAID") {
      return res.status(402).json({
        message: "결제가 완료되지 않았습니다.",
      });
    }

    if (paymentInfo.transactionId !== impUid) {
      return res.status(400).json({
        message: "주문 정보와 결제 정보가 일치하지 않습니다.",
      });
    }

    if (Number(paymentInfo.amount?.total) !== Number(req.body.finalAmount)) {
      return res.status(400).json({
        message: "결제 금액이 주문 금액과 일치하지 않습니다.",
      });
    }

    const order = await Order.create({
      ...req.body,
      orderNumber: req.body.orderNumber || generateOrderNumber(),
      user: req.user.id,
      payment: {
        ...req.body.payment,
        impUid,
        merchantUid,
        paymentStatus: "paid",
        paidAt: new Date(paymentInfo.paidAt),
      },
    });
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "email name user_type")
      .populate("items.product", "name sku price thumbnail category");

    res.status(201).json({
      message: "주문이 생성되었습니다.",
      order: populatedOrder,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "이미 처리된 주문이거나 사용 중인 주문번호입니다.",
      });
    }

    res.status(400).json({
      message: "주문 생성에 실패했습니다.",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 주문 ID입니다.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "주문을 찾을 수 없습니다.",
      });
    }

    if (!canAccessOrder(req, order)) {
      return res.status(403).json({
        message: "해당 주문을 수정할 권한이 없습니다.",
      });
    }

    if (req.user?.user_type !== "admin" && order.orderStatus !== "pending") {
      return res.status(403).json({
        message: "주문 접수 상태에서만 수정할 수 있습니다.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: order.user,
        orderNumber: order.orderNumber,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
      .populate("user", "email name user_type")
      .populate("items.product", "name sku price thumbnail category");

    res.json({
      message: "주문이 수정되었습니다.",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      message: "주문 수정에 실패했습니다.",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInvalidObjectId(id)) {
      return res.status(400).json({
        message: "유효하지 않은 주문 ID입니다.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "주문을 찾을 수 없습니다.",
      });
    }

    if (!canAccessOrder(req, order)) {
      return res.status(403).json({
        message: "해당 주문을 삭제할 권한이 없습니다.",
      });
    }

    if (req.user?.user_type !== "admin" && order.orderStatus !== "pending") {
      return res.status(403).json({
        message: "주문 접수 상태에서만 삭제할 수 있습니다.",
      });
    }

    await Order.findByIdAndDelete(id);

    res.json({
      message: "주문이 삭제되었습니다.",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "주문 삭제에 실패했습니다.",
      error: error.message,
    });
  }
};
