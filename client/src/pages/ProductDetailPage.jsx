import { useEffect, useMemo, useRef, useState } from "react";
import { addCartItem } from "../api/cart.js";
import { getProductById, getProducts } from "../api/products.js";
import { getMyProfile } from "../api/users.js";
import HomeNavbar from "../components/home/HomeNavbar.jsx";
import HomeFooter from "../components/home/HomeFooter.jsx";
import { footerGroups } from "../data/homeContent.js";

const categoryLabels = {
  leggings: "레깅스",
  bra: "브라탑",
  yogapants: "요가팬츠",
  bottom: "하의",
  top: "상의",
  outer: "아우터",
  shirt: "티셔츠",
};

const sizes = ["XS", "S", "M", "L", "XL"];
const colorOptions = ["블랙", "코코아", "세이지"];
const colorSwatches = ["#282828", "#9a8779", "#9ca792"];
const features = [
  "부드러운 4-way 스트레치 원단으로 자유로운 움직임",
  "압박 없이 흡수·건조하는 흡습속건 기능",
  "허리 말림 없는 스마트 허리 밴드",
  "군살을 잡아주는 하이웨이스트 컴포트 핏",
];

const TAB_ITEMS = [
  { key: "detail", label: "상세정보" },
  { key: "spec", label: "제품사양" },
  { key: "shipping", label: "배송·교환" },
  { key: "review", label: "리뷰 (0)" },
  { key: "inquiry", label: "상품문의 (0)" },
];

const specRows = [
  { label: "소재", value: "폴리에스터 87%, 스판덱스 13%" },
  { label: "색상", value: "블랙, 코코아, 세이지" },
  { label: "사이즈", value: "XS, S, M, L, XL" },
  { label: "제조국", value: "대한민국" },
  { label: "세탁방법", value: "찬물 단독 손세탁, 표백제 사용 금지, 그늘에서 건조" },
];

const shippingRows = [
  { label: "배송비", value: "2,500원 (5만원 이상 구매 시 무료배송)" },
  { label: "배송기간", value: "결제 완료 후 1~3일 이내 출고" },
  { label: "교환/반품", value: "상품 수령 후 14일 이내 가능 (착용 흔적·훼손 시 불가)" },
  { label: "반품 배송비", value: "단순 변심 시 왕복 배송비 5,000원 고객 부담" },
];

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;

const getDisplayName = (product) => {
  if (!product) {
    return "";
  }

  if (product.category === "leggings") {
    return "에어터치 하이웨이스트 레깅스";
  }

  return product.name;
};

const getProductBadge = (product) => (product?.category === "leggings" ? "BEST" : "NEW");

const getProductDescription = (product) => {
  if (product?.description) {
    return product.description;
  }

  if (product?.category === "leggings") {
    return "어디서나 편안하게 입기 좋은 하이웨이스트 레깅스입니다. 허리부터 발목까지 안정적으로 잡아주는 핏과 부드러운 스트레치 소재로 운동과 일상에 자연스럽게 어울립니다.";
  }

  return "움직임이 많은 하루에도 편안하게 착용할 수 있도록 설계된 프리미엄 애슬레저웨어입니다. 신축성과 복원력을 갖춘 소재로 데일리룩부터 운동까지 자연스럽게 어울립니다.";
};

const getOriginalPrice = (price) => Math.ceil(Number(price) / 0.8 / 1000) * 1000;

const getRelatedDisplayProducts = (product, relatedProducts) => {
  if (!product) {
    return [];
  }

  const displayProducts = [...relatedProducts];

  while (displayProducts.length < 4) {
    displayProducts.push(product);
  }

  return displayProducts.slice(0, 4);
};

function ProductDetailPage({
  onAdmin,
  onBack,
  onBuyNow,
  onCart,
  onCategoryClick,
  onGoHome,
  onLogin,
  onMyOrders,
  productId,
}) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cartStatus, setCartStatus] = useState("");
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("detail");

  const detailSectionRef = useRef(null);
  const specSectionRef = useRef(null);
  const shippingSectionRef = useRef(null);
  const reviewSectionRef = useRef(null);
  const inquirySectionRef = useRef(null);

  const sectionRefsByTab = {
    detail: detailSectionRef,
    spec: specSectionRef,
    shipping: shippingSectionRef,
    review: reviewSectionRef,
    inquiry: inquirySectionRef,
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    sectionRefsByTab[key].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const loadProduct = async () => {
      setStatus("loading");
      setErrorMessage("");

      try {
        const [productData, productsData] = await Promise.all([
          getProductById(productId),
          getProducts({ page: 1, limit: 8 }),
        ]);
        const currentProduct = productData.product;

        setProduct(currentProduct);
        setSelectedImage(currentProduct.thumbnail);
        setRelatedProducts(
          (productsData.products || []).filter((item) => item._id !== currentProduct._id),
        );
        setStatus("ready");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    };

    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem("aure_wishlist") || "[]");
    setIsWishlisted(wishlist.includes(product._id));
  }, [product]);

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

  const thumbnails = useMemo(() => {
    if (!product) {
      return [];
    }

    const relatedImages = relatedProducts.slice(0, 3).map((item) => item.thumbnail);
    return [product.thumbnail, ...relatedImages].slice(0, 4);
  }, [product, relatedProducts]);

  const totalPrice = product ? Number(product.price) * quantity : 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    onBack();
  };

  const handleAddCart = async () => {
    setCartStatus("");

    if (!selectedSize) {
      setCartStatus("사이즈를 선택해주세요.");
      return;
    }

    setIsAddingCart(true);

    try {
      const token = localStorage.getItem("token");

      await addCartItem(token, {
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      setCartStatus("장바구니에 상품이 추가되었습니다.");
      setIsCartModalOpen(true);
    } catch (error) {
      setCartStatus(error.message);
    } finally {
      setIsAddingCart(false);
    }
  };

  const handleBuyNow = async () => {
    setCartStatus("");

    if (!selectedSize) {
      setCartStatus("사이즈를 선택해주세요.");
      return;
    }

    setIsBuyingNow(true);

    try {
      const token = localStorage.getItem("token");

      await addCartItem(token, {
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      onBuyNow();
    } catch (error) {
      setCartStatus(error.message);
      setIsBuyingNow(false);
    }
  };

  const handleToggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("aure_wishlist") || "[]");
    const alreadyWishlisted = wishlist.includes(product._id);
    const nextWishlist = alreadyWishlisted
      ? wishlist.filter((id) => id !== product._id)
      : [...wishlist, product._id];

    localStorage.setItem("aure_wishlist", JSON.stringify(nextWishlist));
    setIsWishlisted(!alreadyWishlisted);
  };

  const renderNavbar = () => (
    <HomeNavbar
      isAdmin={user?.user_type === "admin"}
      isMenuOpen={isMenuOpen}
      onAdmin={onAdmin}
      onCart={onCart}
      onCategoryClick={onCategoryClick}
      onGoHome={onGoHome}
      onLogin={onLogin}
      onLogout={handleLogout}
      onMyOrders={onMyOrders}
      onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      user={user}
    />
  );

  if (status === "loading") {
    return (
      <main className="product-detail-page product-detail-dark">
        {renderNavbar()}
        <p className="product-detail-message">상품 정보를 불러오고 있습니다.</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="product-detail-page product-detail-dark">
        {renderNavbar()}
        <div className="product-detail-error">
          <h1>상품 정보를 불러오지 못했습니다.</h1>
          <p>{errorMessage}</p>
        </div>
      </main>
    );
  }

  const displayName = getDisplayName(product);
  const originalPrice = getOriginalPrice(product.price);
  const relatedDisplayProducts = getRelatedDisplayProducts(product, relatedProducts);

  return (
    <main className="product-detail-page product-detail-dark">
      {renderNavbar()}

      <section className="dark-product-shell">
        <button className="dark-product-back" type="button" onClick={onBack}>
          홈 / 쇼핑 / {categoryLabels[product.category] || product.category}
        </button>

        <div className="dark-product-layout">
          <div className="dark-product-gallery">
            <div className="dark-product-main-image">
              <img src={selectedImage} alt={displayName} />
            </div>
            <div className="dark-product-thumbnails">
              {thumbnails.map((image, index) => (
                <button
                  className={selectedImage === image ? "is-active" : ""}
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`${displayName} 썸네일 ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <aside className="dark-product-info">
            <span className="dark-product-badge">{getProductBadge(product)}</span>
            <p>{categoryLabels[product.category] || product.category}</p>
            <h1>{displayName}</h1>
            <div className="dark-product-review">
              <span>★ 4.9</span>
              <span>리뷰 3,421개</span>
            </div>
            <div className="dark-product-price-row">
              <span>20%</span>
              <strong>{formatPrice(product.price)}</strong>
              <del>{formatPrice(originalPrice)}</del>
            </div>
            <p className="dark-product-description">{getProductDescription(product)}</p>

            <div className="dark-product-option">
              <div className="dark-option-heading">
                <span>색상</span>
                <span>전체 {colorOptions.length}</span>
              </div>
              <div className="dark-color-options">
                {colorOptions.map((color, index) => (
                  <button
                    className={selectedColor === color ? "is-selected" : ""}
                    key={color}
                    style={{ backgroundColor: colorSwatches[index] }}
                    type="button"
                    aria-label={color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="dark-product-option">
              <div className="dark-option-heading">
                <span>사이즈</span>
                <button type="button">사이즈 가이드</button>
              </div>
              <div className="dark-size-options">
                {sizes.map((size) => (
                  <button
                    className={selectedSize === size ? "is-selected" : ""}
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="dark-product-option">
              <span>수량</span>
              <div className="dark-quantity">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="dark-total-row">
              <span>총 상품금액</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>

            <div className="dark-product-actions">
              <button disabled={isBuyingNow} type="button" onClick={handleBuyNow}>
                {isBuyingNow ? "이동 중" : "바로구매하기"}
              </button>
              <button disabled={isAddingCart} type="button" onClick={handleAddCart}>
                {isAddingCart ? "담는 중" : "장바구니"}
              </button>
              <button
                className={isWishlisted ? "is-wished" : ""}
                type="button"
                onClick={handleToggleWishlist}
              >
                {isWishlisted ? "관심상품 완료" : "관심상품"}
              </button>
            </div>

            <div className="dark-naverpay-row">
              <button
                className="naverpay-buy-button"
                disabled={isBuyingNow}
                type="button"
                onClick={handleBuyNow}
              >
                <span className="naverpay-mark" aria-hidden="true">N</span>
                pay 구매
              </button>
              <button
                className={`naverpay-wish-button ${isWishlisted ? "is-wished" : ""}`}
                type="button"
                aria-label="관심상품 찜하기"
                onClick={handleToggleWishlist}
              >
                찜
              </button>
            </div>

            <div className="naverpay-benefit-banner">
              <span aria-hidden="true">‹</span>
              <p>네이버페이 포인트 최대 5% 적립</p>
              <span aria-hidden="true">›</span>
            </div>

            {cartStatus ? <p className="dark-cart-status">{cartStatus}</p> : null}

            <ul className="dark-product-benefits">
              <li>회원만을 위한 기획 특가 무료배송</li>
              <li>수령 후 14일 이내 무료 교환/반품</li>
              <li>정품 보증 및 품질 A/S 지원</li>
            </ul>
          </aside>
        </div>

        <nav className="dark-product-tabs" aria-label="상품 상세 탭">
          {TAB_ITEMS.map((tab) => (
            <button
              className={activeTab === tab.key ? "is-active" : ""}
              key={tab.key}
              type="button"
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="dark-product-features" ref={detailSectionRef}>
          <h2>제품 특징</h2>
          <div>
            {features.map((feature, index) => (
              <article key={feature}>
                <span>{index + 1}</span>
                <p>{feature}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dark-related-section">
          <p>YOU MAY ALSO LIKE</p>
          <h2>함께 보면 좋은 상품</h2>
          <div className="dark-related-grid">
            {relatedDisplayProducts.map((item, index) => (
              <article className="dark-related-card" key={`${item._id}-${index}`}>
                <div>
                  <img src={item.thumbnail} alt={getDisplayName(item)} />
                  <span>{index === 0 ? "BEST" : "NEW"}</span>
                </div>
                <p>{categoryLabels[item.category] || item.category}</p>
                <h3>{getDisplayName(item)}</h3>
                <strong>{formatPrice(item.price)}</strong>
                <small>★ 4.9 리뷰 1,209</small>
              </article>
            ))}
          </div>
        </section>

        <section className="dark-info-section" ref={specSectionRef}>
          <h2>제품사양</h2>
          <dl className="dark-info-table">
            {specRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="dark-info-section" ref={shippingSectionRef}>
          <h2>배송·교환</h2>
          <dl className="dark-info-table">
            {shippingRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="dark-info-section dark-empty-section" ref={reviewSectionRef}>
          <h2>리뷰 (0)</h2>
          <p>아직 등록된 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요.</p>
          <button type="button" onClick={() => window.alert("리뷰 작성은 준비중입니다.")}>
            리뷰 작성하기
          </button>
        </section>

        <section className="dark-info-section dark-empty-section" ref={inquirySectionRef}>
          <h2>상품문의 (0)</h2>
          <p>아직 등록된 상품 문의가 없습니다.</p>
          <button type="button" onClick={() => window.alert("상품문의 작성은 준비중입니다.")}>
            문의하기
          </button>
        </section>
      </section>

      <HomeFooter footerGroups={footerGroups} onCategoryClick={onCategoryClick} />

      {isCartModalOpen ? (
        <div className="cart-added-modal" role="dialog" aria-modal="true">
          <div className="cart-added-card">
            <div className="cart-added-heading">
              <img src={product.thumbnail} alt={displayName} />
              <strong>장바구니에 상품을 담았습니다</strong>
              <button type="button" aria-label="닫기" onClick={() => setIsCartModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="cart-added-actions">
              <button type="button" onClick={onCart}>
                장바구니 이동
              </button>
              <button type="button" onClick={() => setIsCartModalOpen(false)}>
                쇼핑 계속하기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default ProductDetailPage;
