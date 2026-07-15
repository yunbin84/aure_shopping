import { useEffect, useState } from "react";
import { cancelOrder } from "../api/orders.js";
import HomeNavbar from "../components/home/HomeNavbar.jsx";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const formatDate = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");

const ORDER_STATUS_LABEL = {
  pending: "상품준비중",
  confirmed: "결제완료",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소완료",
  refunded: "환불완료",
};

const CANCEL_REASONS = ["고객변심", "서비스불만족", "배송지연", "기타"];

function OrderCancelPage({
  onAdmin,
  onBack,
  onCart,
  onCategoryClick,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  order,
}) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [detailReason, setDetailReason] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

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

  const canCancel = order?.orderStatus === "pending";

  const handleSubmit = async () => {
    if (!reason) {
      setMessage("취소 사유를 선택해주세요.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      await cancelOrder(token, order._id, { reason, detailReason });

      setStatus("done");
      setMessage("취소 신청이 접수되었습니다.");
    } catch (error) {
      setStatus("idle");
      setMessage(error.message || "취소 신청에 실패했습니다.");
    }
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
        onMyOrders={onBack}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="order-shell">
        <div className="order-header">
          <h1>취소신청</h1>
          <div>
            <span>홈</span>
            <span>›</span>
            <span>마이페이지</span>
            <span>›</span>
            <strong>취소신청</strong>
          </div>
        </div>

        {!order ? (
          <div className="order-empty">
            <h2>취소할 주문 정보를 찾을 수 없습니다.</h2>
            <button onClick={onGoHome} type="button">
              홈으로 가기
            </button>
          </div>
        ) : (
          <>
            <section className="order-panel">
              <h2>상품정보</h2>
              <div className="cancel-table-wrap">
                <table className="cancel-table">
                  <thead>
                    <tr>
                      <th>주문일자[주문번호]</th>
                      <th>상품정보</th>
                      <th>수량</th>
                      <th>신청수량</th>
                      <th>상품구매금액</th>
                      <th>주문처리상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {formatDate(order.createdAt)}
                          <br />[{order.orderNumber}]
                        </td>
                        <td>
                          <div className="cancel-table-product">
                            <img alt={item.name} src={item.thumbnail} />
                            <div>
                              <strong>{item.name}</strong>
                              <span>
                                [옵션: {item.size || "-"} / {item.color || "-"}]
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.quantity}</td>
                        <td>{formatPrice(item.price * item.quantity)}</td>
                        <td>{ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="cancel-note">주문상품 전체 취소인 경우, 사은품은 자동으로 취소 신청됩니다.</p>
            </section>

            {!canCancel ? (
              <div className="order-empty">
                <h2>취소 신청이 불가한 주문입니다.</h2>
                <p>이미 처리 중이거나 완료된 주문은 고객센터로 문의해주세요.</p>
              </div>
            ) : status === "done" ? (
              <div className="order-empty">
                <h2>취소 신청이 접수되었습니다.</h2>
                <button onClick={onGoHome} type="button">
                  홈으로 가기
                </button>
              </div>
            ) : (
              <>
                <section className="order-panel">
                  <h2>취소사유</h2>
                  <div className="order-form-grid">
                    <label>
                      사유선택
                      <select onChange={(event) => setReason(event.target.value)} value={reason}>
                        <option disabled value="">
                          선택하세요
                        </option>
                        {CANCEL_REASONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="order-full-field">
                      상세사유
                      <textarea
                        onChange={(event) => setDetailReason(event.target.value)}
                        placeholder="상세 사유를 입력해주세요."
                        rows={4}
                        value={detailReason}
                      />
                    </label>
                  </div>
                </section>

                <section className="order-panel">
                  <h2>환불 정보</h2>
                  <div className="cancel-info-list">
                    <div>
                      <span>환불예정금액</span>
                      <strong>{formatPrice(order.finalAmount)}</strong>
                    </div>
                  </div>
                  <p className="cancel-note">
                    환불예정금액은 취소 접수 처리 완료 후 실제 환불 금액과 다를 수 있습니다.
                  </p>
                  <p className="cancel-note">배송비는 취소 사유 및 쇼핑몰 정책에 따라 환불 또는 추가 청구될 수 있습니다.</p>
                  <p className="cancel-note">현금환불 발생 시 등록된 환불계좌로 환불 처리됩니다.</p>
                </section>

                {message ? <p className="order-payment-message">{message}</p> : null}

                <div className="cancel-actions">
                  <button
                    className="is-primary"
                    disabled={status === "submitting"}
                    onClick={handleSubmit}
                    type="button"
                  >
                    취소신청
                  </button>
                  <button onClick={onBack} type="button">
                    이전페이지
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default OrderCancelPage;
