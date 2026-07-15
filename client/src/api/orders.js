const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const getMyOrders = async (token, { page = 1, limit = 20, status } = {}) => {
  if (!token) {
    throw new Error("로그인 후 이용할 수 있습니다.");
  }

  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (status) {
    params.set("status", Array.isArray(status) ? status.join(",") : status);
  }

  const response = await fetch(`${API_BASE_URL}/orders?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "주문 목록을 불러오지 못했습니다.");
  }

  return data;
};

export const createOrder = async (token, orderData) => {
  if (!token) {
    throw new Error("로그인 후 주문할 수 있습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "주문 생성에 실패했습니다.");
  }

  return data;
};

export const cancelOrder = async (token, orderId, { reason, detailReason }) => {
  if (!token) {
    throw new Error("로그인 후 이용할 수 있습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderStatus: "cancelled",
      orderMemo: `[취소사유: ${reason}] ${detailReason || ""}`.trim(),
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "취소 신청에 실패했습니다.");
  }

  return data;
};

export const updateOrderStatus = async (token, orderId, orderStatus) => {
  if (!token) {
    throw new Error("로그인 후 이용할 수 있습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderStatus }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "주문 상태 변경에 실패했습니다.");
  }

  return data;
};
