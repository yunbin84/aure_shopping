import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orders.js";
import HomeNavbar from "../components/home/HomeNavbar.jsx";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const formatDate = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");

const STATUS_META = {
  pending: { label: "처리중", className: "is-processing" },
  confirmed: { label: "처리중", className: "is-processing" },
  shipping: { label: "배송중", className: "is-shipping" },
  delivered: { label: "완료", className: "is-done" },
  cancelled: { label: "취소완료", className: "is-cancelled" },
  refunded: { label: "환불완료", className: "is-cancelled" },
};

const TABS = [
  { key: "all", label: "전체" },
  { key: "processing", label: "처리중", statuses: ["pending", "confirmed"] },
  { key: "shipping", label: "배송중", statuses: ["shipping"] },
  { key: "done", label: "완료", statuses: ["delivered", "cancelled", "refunded"] },
];

function ClockIcon() {
  return (
    <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#999999" strokeWidth="1.6" />
      <path d="M12 7V12L15.5 14" stroke="#999999" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function MyOrdersPage({
  onAdmin,
  onCart,
  onCategoryClick,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  onSelectOrder,
}) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("no-token");
      return;
    }

    const tab = TABS.find((item) => item.key === activeTab);

    setStatus("loading");

    const loadOrders = async () => {
      try {
        const data = await getMyOrders(token, { limit: 50, status: tab?.statuses });
        setOrders(data.orders || []);
        setStatus("ready");
      } catch (error) {
        setStatus("error");
      }
    };

    loadOrders();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    onGoHome();
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
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="order-shell">
        <div className="order-header">
          <h1>내 주문 목록</h1>
          <div>
            <span>홈</span>
            <span>›</span>
            <span>마이페이지</span>
            <span>›</span>
            <strong>주문 목록</strong>
          </div>
        </div>

        {status === "loading" ? <p className="order-message">주문 목록을 불러오고 있습니다.</p> : null}

        {status === "no-token" ? (
          <div className="order-empty">
            <h2>로그인이 필요합니다.</h2>
            <button onClick={onLogin} type="button">
              로그인하러 가기
            </button>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="order-empty">
            <h2>주문 목록을 불러오지 못했습니다.</h2>
            <button onClick={onGoHome} type="button">
              홈으로 가기
            </button>
          </div>
        ) : null}

        {status === "ready" ? (
          <>
            <div className="myorders-tabs">
              {TABS.map((tab) => (
                <button
                  className={activeTab === tab.key ? "is-active" : ""}
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {orders.length === 0 ? (
              <div className="order-empty">
                <h2>해당하는 주문이 없습니다.</h2>
              </div>
            ) : (
              <div className="myorders-list">
                {orders.map((order) => {
                  const meta = STATUS_META[order.orderStatus] || { label: order.orderStatus, className: "" };

                  return (
                    <article
                      className="myorders-card"
                      key={order._id}
                      onClick={() => onSelectOrder(order)}
                    >
                      <div className="myorders-card-header">
                        <div>
                          <ClockIcon />
                          <strong>주문 #{order.orderNumber}</strong>
                          <span>주문일: {formatDate(order.createdAt)}</span>
                        </div>
                        <div>
                          <span className={`myorders-badge ${meta.className}`}>{meta.label}</span>
                          <strong>{formatPrice(order.finalAmount)}</strong>
                        </div>
                      </div>

                      <div className="myorders-items">
                        {order.items.map((item) => (
                          <div className="myorders-item" key={item._id}>
                            <img alt={item.name} src={item.thumbnail} />
                            <div>
                              <strong>{item.name}</strong>
                              <span>
                                사이즈: {item.size || "-"} · 색상: {item.color || "-"}
                              </span>
                              <span>수량: {item.quantity}</span>
                              <b>{formatPrice(item.price)}</b>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </section>
    </main>
  );
}

export default MyOrdersPage;
