const SHOP_LINK_CATEGORY_KEYS = {
  신상품: "new",
  베스트: "best",
  레깅스: "leggings",
  브라탑: "bra",
};

const SUPPORT_LINK_TARGETS = {
  "주문/배송 조회": "myOrders",
  "교환/반품 안내": "customerCenter",
  "사이즈 가이드": "customerCenter",
  "1:1 문의": "customerCenter",
};

function HomeFooter({ footerGroups, onCategoryClick, onCustomerCenter, onMyOrders }) {
  const getLinkClickHandler = (group, link) => {
    if (group.title === "쇼핑") {
      const categoryKey = SHOP_LINK_CATEGORY_KEYS[link];
      return categoryKey ? () => onCategoryClick(categoryKey) : undefined;
    }

    if (group.title === "고객지원") {
      const target = SUPPORT_LINK_TARGETS[link];

      if (target === "myOrders") {
        return onMyOrders;
      }

      if (target === "customerCenter") {
        return onCustomerCenter;
      }
    }

    return undefined;
  };

  return (
    <footer className="home-footer">
      <div>
        <h2>AURÉ</h2>
        <p>
          매일이 편안한 프리미엄 애슬레저.
          <br />
          움직임의 자유를 디자인합니다.
        </p>
      </div>
      {footerGroups.map((group) => (
        <div key={group.title}>
          <h3>{group.title}</h3>
          {group.links.map((link) => (
            <button key={link} type="button" onClick={getLinkClickHandler(group, link)}>
              {link}
            </button>
          ))}
        </div>
      ))}
    </footer>
  );
}

export default HomeFooter;
