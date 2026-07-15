import { useEffect, useState } from "react";
import { clearCart, deleteCartItem, getMyCart, updateCartItem } from "../api/cart.js";
import HomeNavbar from "../components/home/HomeNavbar.jsx";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const SHIPPING_FEE = 2500;
const DISCOUNT_AMOUNT = 2000;

function CartPage({
  onAdmin,
  onCategoryClick,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  onMyOrders,
  onOrder,
}) {
  const [cart, setCart] = useState({ items: [] });
  const [status, setStatus] = useState("loading");
  const [cartMessage, setCartMessage] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState("");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (!token) {
      setStatus("no-token");
      return;
    }

    const loadCart = async () => {
      try {
        const data = await getMyCart(token);
        setCart(data.cart || { items: [] });
        setStatus("ready");
      } catch (error) {
        setStatus("error");
      }
    };

    loadCart();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    onGoHome();
  };

  const handleQuantityChange = async (item, nextQuantity) => {
    if (nextQuantity < 1) {
      return;
    }

    setCartMessage("");
    setUpdatingItemId(item._id);

    try {
      const token = localStorage.getItem("token");
      const data = await updateCartItem(token, item._id, {
        quantity: nextQuantity,
      });
      setCart(data.cart || { items: [] });
    } catch (error) {
      setCartMessage(error.message);
    } finally {
      setUpdatingItemId("");
    }
  };

  const handleDeleteItem = async (itemId) => {
    setCartMessage("");
    setUpdatingItemId(itemId);

    try {
      const token = localStorage.getItem("token");
      const data = await deleteCartItem(token, itemId);
      setCart(data.cart || { items: [] });
    } catch (error) {
      setCartMessage(error.message);
    } finally {
      setUpdatingItemId("");
    }
  };

  const handleClearCart = async () => {
    setCartMessage("");

    try {
      const token = localStorage.getItem("token");
      const data = await clearCart(token);
      setCart(data.cart || { items: [] });
    } catch (error) {
      setCartMessage(error.message);
    }
  };

  const totalPrice = cart.items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const hasItems = cart.items.length > 0;
  const discountPrice = hasItems ? DISCOUNT_AMOUNT : 0;
  const shippingFee = hasItems ? SHIPPING_FEE : 0;
  const paymentPrice = Math.max(totalPrice - discountPrice + shippingFee, 0);

  return (
    <main className="cart-page">
      <HomeNavbar
        isAdmin={user?.user_type === "admin"}
        isMenuOpen={isMenuOpen}
        onAdmin={onAdmin}
        onCart={() => {}}
        onCategoryClick={onCategoryClick}
        onCustomerCenter={onCustomerCenter}
        onGoHome={onGoHome}
        onJoin={onJoin}
        onLogin={onLogin}
        onLogout={handleLogout}
        onMyOrders={onMyOrders}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="cart-shell">
        <div className="cart-header-row">
          <h1>장바구니</h1>
          <div className="cart-step">
            <strong>장바구니</strong>
            <span>›</span>
            <span>주문/결제</span>
            <span>›</span>
            <span>주문 완료</span>
          </div>
        </div>

        {status === "loading" ? (
          <p className="cart-message">장바구니를 불러오고 있습니다.</p>
        ) : null}

        {status === "no-token" ? (
          <div className="cart-empty">
            <h2>로그인이 필요합니다.</h2>
            <p>장바구니는 로그인 후 이용할 수 있습니다.</p>
            <button type="button" onClick={onLogin}>
              로그인하러 가기
            </button>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="cart-empty">
            <h2>장바구니를 불러오지 못했습니다.</h2>
            <p>서버 연결 또는 로그인 상태를 확인해주세요.</p>
          </div>
        ) : null}

        {status === "ready" && cart.items.length === 0 ? (
          <div className="cart-empty">
            <h2>장바구니가 비어 있습니다.</h2>
            <p>마음에 드는 상품을 담아보세요.</p>
            <button type="button" onClick={onGoHome}>
              쇼핑 계속하기
            </button>
          </div>
        ) : null}

        {status === "ready" && cart.items.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-main">
              <div className="cart-list-toolbar">
                <label>
                  <input type="checkbox" checked readOnly />
                  전체선택({cart.items.length}/{cart.items.length})
                </label>
                <button type="button" onClick={handleClearCart}>
                  선택삭제
                </button>
              </div>

              {cartMessage ? <p className="cart-inline-message">{cartMessage}</p> : null}

              <div className="cart-list">
                {cart.items.map((item) => (
                  <article className="cart-item" key={item._id}>
                    <label className="cart-item-check">
                      <input type="checkbox" checked readOnly />
                    </label>

                    <img src={item.thumbnail} alt={item.name} />

                    <div className="cart-item-info">
                      <strong>{item.name}</strong>
                      <span>
                        [옵션: {item.size || "사이즈 미선택"} / {item.color || "색상 미선택"}]
                      </span>
                      <button type="button">옵션변경</button>
                    </div>

                    <div className="cart-quantity-control">
                      <button
                        type="button"
                        disabled={updatingItemId === item._id || Number(item.quantity) <= 1}
                        onClick={() => handleQuantityChange(item, Number(item.quantity) - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        disabled={updatingItemId === item._id}
                        onClick={() => handleQuantityChange(item, Number(item.quantity) + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      <del>{formatPrice(Number(item.price) + 2000)}</del>
                      <b>{formatPrice(Number(item.price) * Number(item.quantity))}</b>
                    </div>

                    <button
                      className="cart-item-delete"
                      type="button"
                      aria-label={`${item.name} 삭제`}
                      disabled={updatingItemId === item._id}
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <aside className="cart-summary">
              <div className="cart-summary-box">
                <div>
                  <span>상품금액</span>
                  <b>{formatPrice(totalPrice)}</b>
                </div>
                <div>
                  <span>할인금액</span>
                  <b>{formatPrice(discountPrice)}</b>
                </div>
                <div>
                  <span>배송비</span>
                  <b>+{formatPrice(shippingFee)}</b>
                </div>
                <div className="cart-summary-total">
                  <span>전체 합계</span>
                  <strong>{formatPrice(paymentPrice)}</strong>
                </div>
              </div>
              <button className="cart-order-button" type="button" onClick={onOrder}>
                주문하기
              </button>
              <button className="cart-continue-button" type="button" onClick={onGoHome}>
                계속 쇼핑하기
              </button>
              <p>
                · 최종 결제 금액은 주문결제 페이지에서 확인해주세요.
                <br />
                · 비회원 구매 시 사은품 등 회원 대상 이벤트 혜택이 적용되지 않습니다.
              </p>
            </aside>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default CartPage;
