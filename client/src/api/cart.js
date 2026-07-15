const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const getMyCart = async (token) => {
  if (!token) {
    return { cart: { items: [] } };
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "장바구니 조회에 실패했습니다.");
  }

  return data;
};

export const addCartItem = async (token, cartItem) => {
  if (!token) {
    throw new Error("로그인 후 장바구니를 이용할 수 있습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartItem),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "장바구니 추가에 실패했습니다.");
  }

  return data;
};

export const updateCartItem = async (token, itemId, cartItem) => {
  if (!token) {
    throw new Error("로그인 후 장바구니를 이용할 수 있습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartItem),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "장바구니 상품 수정에 실패했습니다.");
  }

  return data;
};

export const deleteCartItem = async (token, itemId) => {
  if (!token) {
    throw new Error("로그인 후 장바구니를 이용할 수 있습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "장바구니 상품 삭제에 실패했습니다.");
  }

  return data;
};

export const clearCart = async (token) => {
  if (!token) {
    throw new Error("로그인 후 장바구니를 이용할 수 있습니다.");
  }

  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "장바구니 비우기에 실패했습니다.");
  }

  return data;
};
