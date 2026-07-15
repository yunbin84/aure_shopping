import { useEffect, useState } from "react";
import HomeNavbar from "../components/home/HomeNavbar.jsx";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;

function SuccessIcon() {
  return (
    <svg fill="none" height="64" viewBox="0 0 64 64" width="64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#c15a25" strokeWidth="2.5" />
      <path
        d="M20 33L28 41L44 24"
        stroke="#c15a25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function FailIcon() {
  return (
    <svg fill="none" height="64" viewBox="0 0 64 64" width="64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" stroke="#d33b2f" strokeWidth="2.5" />
      <path d="M23 23L41 41M41 23L23 41" stroke="#d33b2f" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

function OrderCompletePage({
  onAdmin,
  onCart,
  onCategoryClick,
  onGoHome,
  onLogin,
  onViewOrder,
  result,
}) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    onGoHome();
  };

  const isSuccess = result?.status !== "fail";
  const order = result?.order;

  return (
    <main className="order-page">
      <HomeNavbar
        isAdmin={user?.user_type === "admin"}
        isMenuOpen={isMenuOpen}
        onAdmin={onAdmin}
        onCart={onCart}
        onCategoryClick={onCategoryClick}
        onGoHome={onGoHome}
        onLogin={onLogin}
        onLogout={handleLogout}
        onMyOrders={onViewOrder}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="order-shell">
        <div className="order-header">
          <h1>주문/결제</h1>
          <div>
            <span>장바구니</span>
            <span>›</span>
            <span>주문/결제</span>
            <span>›</span>
            <strong>{isSuccess ? "주문 완료" : "주문 실패"}</strong>
          </div>
        </div>

        <div className="order-result">
          {isSuccess ? <SuccessIcon /> : <FailIcon />}

          <h2>{isSuccess ? "고객님의 주문이 완료되었습니다." : "결제에 실패했습니다."}</h2>

          {isSuccess ? (
            <div className="order-result-info">
              <div>
                <span>주문번호</span>
                <strong>{order?.orderNumber}</strong>
              </div>
              <div>
                <span>결제금액</span>
                <strong>{formatPrice(order?.finalAmount)}</strong>
              </div>
            </div>
          ) : (
            <p className="order-result-message">
              {result?.message || "결제 처리 중 문제가 발생했습니다. 다시 시도해주세요."}
            </p>
          )}

          <div className="order-result-actions">
            {isSuccess ? (
              <>
                <button type="button" onClick={onViewOrder}>
                  주문내역 조회
                </button>
                <button className="is-primary" type="button" onClick={onGoHome}>
                  계속 쇼핑하기
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={onGoHome}>
                  홈으로 가기
                </button>
                <button className="is-primary" type="button" onClick={onCart}>
                  다시 시도하기
                </button>
              </>
            )}
          </div>

          {isSuccess ? (
            <p className="order-result-note">
              <strong>⏱ 꼭 확인해 주세요!</strong>
              구매 고객님께는 할인 쿠폰이 발급될 수 있으며, 지급 시 메시지를 통해 안내할 수 있습니다.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default OrderCompletePage;
