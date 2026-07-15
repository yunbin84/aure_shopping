import { useEffect, useState } from "react";
import { clearCart, getMyCart } from "../api/cart.js";
import { createOrder } from "../api/orders.js";
import HomeNavbar from "../components/home/HomeNavbar.jsx";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const SHIPPING_FEE = 2500;
const DISCOUNT_AMOUNT = 2000;
const PORTONE_MERCHANT_CODE = "imp36672880";

function ChekoutPage({
  onAdmin,
  onCart,
  onCategoryClick,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  onMyOrders,
  onOrderResult,
}) {
  const [cart, setCart] = useState({ items: [] });
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    receiverName: "",
    phone: "",
    postcode: "",
    address: "",
    deliveryMessage: "",
  });

  useEffect(() => {
    if (!window.IMP) {
      return;
    }

    window.IMP.init(PORTONE_MERCHANT_CODE);
  }, []);

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

  const productAmount = cart.items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const discountAmount = cart.items.length > 0 ? DISCOUNT_AMOUNT : 0;
  const shippingFee = cart.items.length > 0 ? SHIPPING_FEE : 0;
  const finalAmount = Math.max(productAmount - discountAmount + shippingFee, 0);
  const orderName =
    cart.items.length > 1
      ? `${cart.items[0].name} 외 ${cart.items.length - 1}건`
      : cart.items[0]?.name || "쇼핑몰 주문";

  const handleShippingInfoChange = (event) => {
    const { name, value } = event.target;

    setShippingInfo((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePayment = () => {
    setPaymentMessage("");

    if (!window.IMP) {
      setPaymentMessage("포트원 결제 모듈을 불러오지 못했습니다.");
      return;
    }

    if (cart.items.length === 0 || finalAmount <= 0) {
      setPaymentMessage("결제할 상품이 없습니다.");
      return;
    }

    if (!shippingInfo.receiverName || !shippingInfo.phone || !shippingInfo.postcode || !shippingInfo.address) {
      setPaymentMessage("배송정보를 모두 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    const merchantUid = `order_no_${Date.now()}`;
    const paymentData = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: merchantUid,
      name: orderName,
      amount: finalAmount,
      buyer_email: user?.email || "",
      buyer_name: shippingInfo.receiverName || user?.name || "",
      buyer_tel: shippingInfo.phone,
      buyer_addr: shippingInfo.address,
      buyer_postcode: shippingInfo.postcode,
      m_redirect_url: window.location.href,
    };

    console.log("PortOne paymentData", paymentData);
    setPaymentMessage(`결제 요청 PG: ${paymentData.pg}`);

    window.IMP.init(PORTONE_MERCHANT_CODE);
    window.IMP.request_pay(paymentData, async (response) => {
      if (!response.success) {
        setPaymentMessage(response.error_msg || "결제에 실패했습니다.");
        onOrderResult({ status: "fail", message: response.error_msg || "결제에 실패했습니다." });
        return;
      }

      try {
        const { order: createdOrder } = await createOrder(token, {
          items: cart.items.map((item) => ({
            product: item.product,
            name: item.name,
            thumbnail: item.thumbnail,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
          shippingAddress: {
            receiverName: shippingInfo.receiverName,
            phone: shippingInfo.phone,
            zipCode: shippingInfo.postcode,
            address1: shippingInfo.address,
            email: user?.email || "",
            deliveryMessage: shippingInfo.deliveryMessage,
          },
          productAmount,
          discountAmount,
          shippingFee,
          finalAmount,
          payment: {
            method: "card",
            impUid: response.imp_uid,
            merchantUid,
          },
        });

        await clearCart(token);

        setPaymentMessage("결제가 완료되었습니다.");
        onOrderResult({ status: "success", order: createdOrder });
      } catch (error) {
        setPaymentMessage(error.message || "주문 생성에 실패했습니다.");
        onOrderResult({ status: "fail", message: error.message || "주문 생성에 실패했습니다." });
      }
    });
  };

  return (
    <main className="order-page">
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
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="order-shell">
        <div className="order-header">
          <h1>주문/결제</h1>
          <div>
            <span>장바구니</span>
            <span>›</span>
            <strong>주문/결제</strong>
            <span>›</span>
            <span>주문 완료</span>
          </div>
        </div>

        {status === "loading" ? <p className="order-message">주문 정보를 불러오고 있습니다.</p> : null}

        {status === "no-token" ? (
          <div className="order-empty">
            <h2>로그인이 필요합니다.</h2>
            <button type="button" onClick={onLogin}>
              로그인하러 가기
            </button>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="order-empty">
            <h2>주문 정보를 불러오지 못했습니다.</h2>
            <button type="button" onClick={onCart}>
              장바구니로 돌아가기
            </button>
          </div>
        ) : null}

        {status === "ready" ? (
          <div className="order-layout">
            <div className="order-main">
              <section className="order-panel">
                <h2>배송정보</h2>
                <div className="order-form-grid">
                  <label>
                    받는 사람
                    <input
                      name="receiverName"
                      placeholder="이름을 입력해주세요"
                      type="text"
                      value={shippingInfo.receiverName}
                      onChange={handleShippingInfoChange}
                    />
                  </label>
                  <label>
                    휴대전화
                    <input
                      name="phone"
                      placeholder="010-0000-0000"
                      type="text"
                      value={shippingInfo.phone}
                      onChange={handleShippingInfoChange}
                    />
                  </label>
                  <label className="order-full-field">
                    우편번호
                    <input
                      name="postcode"
                      placeholder="123-456"
                      type="text"
                      value={shippingInfo.postcode}
                      onChange={handleShippingInfoChange}
                    />
                  </label>
                  <label className="order-full-field">
                    주소
                    <input
                      name="address"
                      placeholder="배송지를 입력해주세요"
                      type="text"
                      value={shippingInfo.address}
                      onChange={handleShippingInfoChange}
                    />
                  </label>
                  <label className="order-full-field">
                    배송메시지
                    <select
                      name="deliveryMessage"
                      value={shippingInfo.deliveryMessage}
                      onChange={handleShippingInfoChange}
                    >
                      <option value="" disabled>
                        배송 메시지를 선택해주세요
                      </option>
                      <option>문 앞에 놓아주세요</option>
                      <option>부재 시 경비실에 맡겨주세요</option>
                      <option>배송 전 연락주세요</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="order-panel">
                <h2>주문상품</h2>
                <div className="order-item-list">
                  {cart.items.map((item) => (
                    <article className="order-item" key={item._id}>
                      <img src={item.thumbnail} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.size || "사이즈 미선택"} / {item.color || "색상 미선택"}
                        </span>
                      </div>
                      <b>{item.quantity}</b>
                      <strong>{formatPrice(Number(item.price) * Number(item.quantity))}</strong>
                    </article>
                  ))}
                </div>
              </section>

              <section className="order-panel">
                <h2>결제수단</h2>
                <div className="order-payment-methods">
                  <button className="is-selected" type="button">
                    카드 결제
                  </button>
                  <button type="button">토스페이</button>
                  <button type="button">카카오페이</button>
                  <button type="button">네이버페이</button>
                </div>
              </section>
            </div>

            <aside className="order-summary">
              <h2>최종 결제정보</h2>
              <div>
                <span>총 주문금액</span>
                <b>{formatPrice(productAmount)}</b>
              </div>
              <div>
                <span>할인/부가결제</span>
                <b>-{formatPrice(discountAmount)}</b>
              </div>
              <div>
                <span>배송비</span>
                <b>+{formatPrice(shippingFee)}</b>
              </div>
              <div className="order-summary-total">
                <span>최종 결제금액</span>
                <strong>{formatPrice(finalAmount)}</strong>
              </div>
              <button type="button" onClick={handlePayment}>
                결제하기
              </button>
              {paymentMessage ? <p className="order-payment-message">{paymentMessage}</p> : null}
            </aside>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default ChekoutPage;
