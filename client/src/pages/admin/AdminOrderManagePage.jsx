import { useEffect, useState } from "react";
import { getMyOrders, updateOrderStatus } from "../../api/orders.js";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const formatDate = (date) => (date ? new Date(date).toLocaleDateString("ko-KR") : "-");

const STATUS_META = {
  pending: { label: "주문대기", className: "is-processing" },
  confirmed: { label: "주문확인", className: "is-processing" },
  shipping: { label: "배송중", className: "is-shipping" },
  delivered: { label: "배송완료", className: "is-done" },
  cancelled: { label: "취소완료", className: "is-cancelled" },
  refunded: { label: "환불완료", className: "is-cancelled" },
};

const TABS = [
  { key: "all", label: "전체" },
  { key: "pending", label: "주문대기", statuses: ["pending"] },
  { key: "confirmed", label: "주문확인", statuses: ["confirmed"] },
  { key: "shipping", label: "배송중", statuses: ["shipping"] },
  { key: "delivered", label: "배송완료", statuses: ["delivered"] },
  { key: "cancelled", label: "취소", statuses: ["cancelled"] },
  { key: "refunded", label: "환불", statuses: ["refunded"] },
];

function AdminOrderManagePage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState("");

  const loadOrders = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const data = await getMyOrders(token, { limit: 100 });
      setOrders(data.orders || []);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    const previousOrders = orders;

    setOrders((current) =>
      current.map((order) => (order._id === orderId ? { ...order, orderStatus } : order)),
    );

    try {
      const token = localStorage.getItem("token");
      await updateOrderStatus(token, orderId, orderStatus);
    } catch (error) {
      setOrders(previousOrders);
      window.alert(error.message);
    }
  };

  const counts = TABS.reduce((acc, tab) => {
    acc[tab.key] = tab.statuses
      ? orders.filter((order) => tab.statuses.includes(order.orderStatus)).length
      : orders.length;

    return acc;
  }, {});

  const activeTabInfo = TABS.find((tab) => tab.key === activeTab);
  const visibleOrders = orders.filter(
    (order) => !activeTabInfo?.statuses || activeTabInfo.statuses.includes(order.orderStatus),
  );

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <h2>주문관리</h2>
        <p>전체 주문 현황을 확인하고 배송 상태를 관리합니다.</p>
      </div>

      {status === "loading" ? <p className="admin-message">주문 목록을 불러오고 있습니다.</p> : null}

      {status === "error" ? (
        <div className="admin-empty">
          <h2>주문 목록을 불러오지 못했습니다.</h2>
          <p>{errorMessage}</p>
          <button onClick={loadOrders} type="button">
            다시 불러오기
          </button>
        </div>
      ) : null}

      {status === "ready" ? (
        <>
          <div className="admin-order-tabs">
            {TABS.map((tab) => (
              <button
                className={activeTab === tab.key ? "is-active" : ""}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
                <span className="admin-order-tab-count">{counts[tab.key]}</span>
              </button>
            ))}
          </div>

          {visibleOrders.length === 0 ? (
            <div className="admin-product-empty">
              <h3>해당하는 주문이 없습니다.</h3>
            </div>
          ) : (
            <div className="admin-order-list-panel">
              {visibleOrders.map((order) => {
                const meta = STATUS_META[order.orderStatus] || { label: order.orderStatus, className: "" };
                const isExpanded = expandedOrderId === order._id;

                return (
                  <article className="admin-order-card" key={order._id}>
                    <div className="admin-order-card-header">
                      <div>
                        <strong>주문 #{order.orderNumber}</strong>
                        <span>
                          {order.user?.name} · {order.user?.email} · {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div>
                        <span className={`admin-order-badge ${meta.className}`}>{meta.label}</span>
                        <strong>{formatPrice(order.finalAmount)}</strong>
                        <button
                          className="admin-order-detail-toggle"
                          onClick={() => setExpandedOrderId(isExpanded ? "" : order._id)}
                          type="button"
                        >
                          {isExpanded ? "접기" : "상세보기"}
                        </button>
                      </div>
                    </div>

                    <div className="admin-order-card-body">
                      <div>
                        <span className="label">고객 연락처</span>
                        <p>{order.shippingAddress?.phone}</p>
                      </div>
                      <div>
                        <span className="label">주문 상품</span>
                        <p>{order.items.length}개 상품</p>
                      </div>
                      <div>
                        <span className="label">배송 주소</span>
                        <p>
                          {order.shippingAddress?.address1} {order.shippingAddress?.address2 || ""}
                        </p>
                      </div>
                    </div>

                    {isExpanded ? (
                      <div className="admin-order-items">
                        {order.items.map((item) => (
                          <div className="admin-order-item" key={item._id}>
                            <img alt={item.name} src={item.thumbnail} />
                            <div>
                              <strong>{item.name}</strong>
                              <span>
                                {item.size || "-"} / {item.color || "-"} · 수량 {item.quantity}
                              </span>
                              <b>{formatPrice(item.price * item.quantity)}</b>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="admin-order-actions">
                      <label>
                        상태 변경
                        <select
                          onChange={(event) => handleStatusChange(order._id, event.target.value)}
                          value={order.orderStatus}
                        >
                          <option value="pending">주문대기</option>
                          <option value="confirmed">주문확인</option>
                          <option value="shipping">배송중</option>
                          <option value="delivered">배송완료</option>
                          <option value="cancelled">취소</option>
                          <option value="refunded">환불</option>
                        </select>
                      </label>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}

export default AdminOrderManagePage;
