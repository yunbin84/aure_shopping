import { useEffect, useState } from "react";
import { getProducts } from "../../api/products.js";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("ko-KR") : "-";

function ProductManagePage({ onCreate }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalProducts: 0,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
  });
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadProducts = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const data = await getProducts({ page, limit: 10 });
      setProducts(data.products || []);
      setPagination(
        data.pagination || {
          currentPage: page,
          limit: 10,
          totalProducts: 0,
          totalPages: 0,
          hasPrevPage: false,
          hasNextPage: false,
        },
      );
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading admin-panel-heading-row">
        <div>
          <h2>상품 조회</h2>
          <p>서버에 저장된 상품 정보를 확인합니다.</p>
        </div>
        <button
          className="admin-new-product-button"
          type="button"
          onClick={onCreate}
        >
          + 새 상품 등록
        </button>
      </div>

      {status === "loading" ? (
        <p className="admin-product-message">상품 목록을 불러오고 있습니다.</p>
      ) : null}

      {status === "error" ? (
        <div className="admin-product-empty">
          <h3>상품 목록을 불러오지 못했습니다.</h3>
          <p>{errorMessage}</p>
          <button type="button" onClick={loadProducts}>
            다시 불러오기
          </button>
        </div>
      ) : null}

      {status === "ready" && products.length === 0 ? (
        <div className="admin-product-empty">
          <h3>등록된 상품이 없습니다.</h3>
          <p>새 상품 등록 버튼을 눌러 첫 상품을 등록해보세요.</p>
          <button type="button" onClick={onCreate}>
            새 상품 등록하기
          </button>
        </div>
      ) : null}

      {status === "ready" && products.length > 0 ? (
        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-item" key={product._id}>
              <img src={product.thumbnail} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <span>SKU: {product.sku}</span>
                <span>바코드: {product.barcode}</span>
              </div>
              <div>
                <span>카테고리: {product.category}</span>
                <b>{formatPrice(product.price)}</b>
                <span>등록일: {formatDate(product.createdAt)}</span>
              </div>
              <p>{product.description || "설명 없음"}</p>
            </article>
          ))}
          <div className="admin-product-pagination">
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
            >
              이전
            </button>
            <span>
              {pagination.currentPage} / {pagination.totalPages || 1}
              <b>총 {pagination.totalProducts}개</b>
            </span>
            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              다음
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ProductManagePage;
