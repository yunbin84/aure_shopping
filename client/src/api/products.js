const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const getProducts = async ({ page = 1, limit = 2, category } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (category) {
    params.set("category", category);
  }

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "상품 목록 조회에 실패했습니다.");
  }

  return data;
};

export const getProductById = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "상품 정보를 불러오지 못했습니다.");
  }

  return data;
};

export const createProduct = async (token, productData) => {
  if (!token) {
    throw new Error("관리자 로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "상품 등록에 실패했습니다.");
  }

  return data;
};
