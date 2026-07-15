import { useEffect, useState } from "react";
import { getMyCart } from "../../api/cart.js";
import seasonOffImage from "../../assets/home/season-off-clean.png";
import { categories } from "../../data/homeContent.js";

const MEGA_MENU_LINKS = [
  { key: "new", label: "신상품" },
  { key: "best", label: "베스트" },
  { key: "leggings", label: "레깅스" },
  { key: "bra", label: "브라탑" },
  { key: "yogapants", label: "요가팬츠" },
  { key: "outer", label: "아우터" },
  { key: "shirt", label: "티셔츠" },
  { key: "sale", label: "세일" },
];

function HomeNavbar({
  isAdmin,
  onAdmin,
  onCart,
  onCategoryClick,
  onCustomerCenter,
  onGoHome,
  isMenuOpen,
  onJoin,
  onLogin,
  onLogout,
  onMyOrders,
  onSearch,
  onToggleMenu,
  user,
}) {
  const [cartCount, setCartCount] = useState(0);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const userName = user?.name || "회원";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      return;
    }

    const loadCartCount = async () => {
      try {
        const data = await getMyCart(token);
        const count = (data.cart?.items || []).reduce(
          (total, item) => total + Number(item.quantity || 0),
          0,
        );
        setCartCount(count);
      } catch (error) {
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [user]);

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleMegaMenuSelect = (key) => {
    setIsMegaMenuOpen(false);
    onCategoryClick(key);
  };

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmed = searchKeyword.trim();

    if (!trimmed) {
      return;
    }

    onSearch(trimmed);
    setIsSearchOpen(false);
    setSearchKeyword("");
  };

  return (
    <>
      <div className="home-utility-bar">
        {user ? (
          <button type="button" onClick={onMyOrders}>
            마이페이지
          </button>
        ) : (
          <button type="button" onClick={onJoin}>
            회원가입
          </button>
        )}
        <span aria-hidden="true">|</span>
        <button type="button" onClick={onCustomerCenter}>
          고객센터
        </button>
      </div>
      <header className="home-navbar">
      <div className="home-nav-left">
        <button
          aria-expanded={isMegaMenuOpen}
          aria-haspopup="menu"
          aria-label="전체 메뉴"
          className="home-icon-button"
          type="button"
          onClick={() => setIsMegaMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <button className="home-logo" type="button" onClick={onGoHome}>
          AURÉ
        </button>
      </div>

      <nav className="home-nav-links" aria-label="메인 메뉴">
        <button type="button" onClick={() => onCategoryClick("new")}>
          신상품
        </button>
        <button type="button" onClick={() => onCategoryClick("best")}>
          베스트
        </button>
        <button type="button" onClick={() => onCategoryClick("leggings")}>
          레깅스
        </button>
        <button type="button" onClick={() => onCategoryClick("bra")}>
          브라탑
        </button>
        <button type="button" onClick={() => onCategoryClick("yogapants")}>
          요가팬츠
        </button>
        <button type="button" onClick={() => onCategoryClick("outer")}>
          아우터
        </button>
        <button type="button" onClick={() => onCategoryClick("shirt")}>
          티셔츠
        </button>
        <button type="button" onClick={() => onCategoryClick("sale")}>
          세일
        </button>
      </nav>

      <div className="home-nav-actions">
        {isAdmin ? (
          <button className="home-admin-button" type="button" onClick={onAdmin}>
            어드민
          </button>
        ) : null}

        {user ? (
          <div className="home-user-menu">
            <button
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              className="home-welcome-button"
              type="button"
              onClick={onToggleMenu}
            >
              {userName}님 환영합니다
            </button>
            {isMenuOpen ? (
              <div className="home-dropdown" role="menu">
                <button
                  className="home-myorders-button"
                  type="button"
                  onClick={onMyOrders}
                  role="menuitem"
                >
                  내 주문 목록
                </button>
                <button
                  className="home-logout-button"
                  type="button"
                  onClick={handleLogoutClick}
                  role="menuitem"
                >
                  로그아웃
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button className="home-login-button" type="button" onClick={onLogin}>
            로그인
          </button>
        )}

        <div className="home-search-wrap">
          <button
            aria-expanded={isSearchOpen}
            aria-label="검색"
            className="home-icon-button"
            type="button"
            onClick={handleToggleSearch}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {isSearchOpen ? (
            <form className="home-search-panel" onSubmit={handleSearchSubmit}>
              <input
                autoFocus
                aria-label="상품 검색"
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="상품명을 검색해보세요"
                type="text"
                value={searchKeyword}
              />
              <button aria-label="검색하기" type="submit">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>
          ) : null}
        </div>
        <button
          className="home-cart-button"
          type="button"
          aria-label={`장바구니 ${cartCount}개`}
          onClick={onCart}
        >
          <span className="home-cart-icon-wrap">
            <svg className="home-cart-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6.5 8h11l-0.9 11.1a2 2 0 0 1-2 1.9H9.4a2 2 0 0 1-2-1.9L6.5 8z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M9 8V6.5a3 3 0 0 1 6 0V8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <b>{cartCount}</b>
          </span>
        </button>
      </div>

      {isMegaMenuOpen ? (
        <div className="home-mega-menu" role="menu">
          <nav className="home-mega-menu-links" aria-label="전체 카테고리">
            {MEGA_MENU_LINKS.map((link) => (
              <button key={link.key} type="button" onClick={() => handleMegaMenuSelect(link.key)}>
                {link.label}
              </button>
            ))}
          </nav>

          <div className="home-mega-menu-grid">
            {categories.map((category) => (
              <button
                className="home-mega-menu-card"
                key={category.key}
                type="button"
                onClick={() => handleMegaMenuSelect(category.key)}
              >
                <img alt={category.name} src={category.image} />
                <strong>{category.name}</strong>
                <span>{category.count}</span>
              </button>
            ))}
          </div>

          <button
            className="home-mega-menu-promo"
            type="button"
            onClick={() => handleMegaMenuSelect("sale")}
          >
            <img alt="봄맞이 시즌오프" src={seasonOffImage} />
            <span>봄맞이 시즌오프 최대 40% 할인 →</span>
          </button>
        </div>
      ) : null}
      </header>
    </>
  );
}

export default HomeNavbar;
