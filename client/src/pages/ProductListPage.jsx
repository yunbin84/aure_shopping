import { useEffect, useState } from "react";
import { getProducts } from "../api/products.js";
import { getMyProfile } from "../api/users.js";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNavbar from "../components/home/HomeNavbar.jsx";
import { footerGroups } from "../data/homeContent.js";

const CATEGORY_LABELS = {
  leggings: "레깅스",
  bra: "브라탑",
  yogapants: "요가팬츠",
  bottom: "하의",
  top: "상의",
  outer: "아우터",
  shirt: "티셔츠",
};

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;

function ProductListPage({
  category,
  keyword,
  onAdmin,
  onCart,
  onCategoryClick,
  onCompany,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  onMyOrders,
  onProductClick,
  onSearch,
  title,
}) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    hasPrevPage: false,
    hasNextPage: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    const loadMyProfile = async () => {
      try {
        const data = await getMyProfile(token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsMenuOpen(false);
      }
    };

    loadMyProfile();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [category, keyword]);

  useEffect(() => {
    const loadProducts = async () => {
      setStatus("loading");

      try {
        const data = await getProducts({ page, limit: 12, category, keyword });
        setProducts(data.products || []);
        setPagination(
          data.pagination || {
            currentPage: page,
            totalPages: 0,
            totalProducts: 0,
            hasPrevPage: false,
            hasNextPage: false,
          },
        );
        setStatus("ready");
      } catch (error) {
        setStatus("error");
      }
    };

    loadProducts();
  }, [page, category, keyword]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <main className="home-page">
      <HomeNavbar
        isAdmin={user?.user_type === "admin"}
        isMenuOpen={isMenuOpen}
        onAdmin={onAdmin}
        onCart={onCart}
        onCategoryClick={onCategoryClick}
        onCustomerCenter={onCustomerCenter}
        onGoHome={onGoHome}
        onJoin={onJoin}
        onLogin={onLogin}
        onLogout={handleLogout}
        onMyOrders={onMyOrders}
        onSearch={onSearch}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="home-section product-list-section">
        <p className="home-section-kicker">SHOP</p>
        <h2>{title}</h2>

        {status === "loading" ? (
          <p className="home-product-status">상품 정보를 불러오고 있습니다.</p>
        ) : null}

        {status === "error" ? (
          <p className="home-product-status">상품 목록을 불러오지 못했습니다.</p>
        ) : null}

        {status === "ready" && products.length === 0 ? (
          <p className="home-product-status">등록된 상품이 없습니다.</p>
        ) : null}

        {status === "ready" && products.length > 0 ? (
          <>
            <div className="home-product-grid">
              {products.map((product) => (
                <button
                  className="home-product-card"
                  key={product._id}
                  onClick={() => onProductClick(product._id)}
                  type="button"
                >
                  <div className="home-product-image">
                    <img alt={product.name} src={product.thumbnail} />
                  </div>
                  <p>{CATEGORY_LABELS[product.category] || product.category}</p>
                  <h3>{product.name}</h3>
                  <div className="home-price-row">
                    <b>{formatPrice(product.price)}</b>
                  </div>
                </button>
              ))}
            </div>

            <div className="product-list-pagination">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                type="button"
              >
                이전
              </button>
              <span>
                {pagination.currentPage} / {pagination.totalPages || 1}
              </span>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                다음
              </button>
            </div>
          </>
        ) : null}
      </section>

      <HomeFooter
        footerGroups={footerGroups}
        onCategoryClick={onCategoryClick}
        onCompany={onCompany}
        onCustomerCenter={onCustomerCenter}
        onMyOrders={onMyOrders}
      />
    </main>
  );
}

export default ProductListPage;
