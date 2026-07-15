const SHOP_LINK_CATEGORY_KEYS = {
  신상품: "new",
  베스트: "best",
  레깅스: "leggings",
  브라탑: "bra",
};

const SUPPORT_LINK_TARGETS = {
  "주문/배송 조회": { type: "myOrders" },
  "교환/반품 안내": { type: "customerCenter", section: "return" },
  "사이즈 가이드": { type: "customerCenter", section: "size-guide" },
  "1:1 문의": { type: "customerCenter", section: "inquiry" },
};

const COMPANY_LINK_SECTIONS = {
  "브랜드 스토리": "brand-story",
  "매장 안내": "store",
  "채용 정보": "careers",
  "제휴 문의": "partnership",
};

function HomeFooter({ footerGroups, onCategoryClick, onCompany, onCustomerCenter, onMyOrders }) {
  const getLinkClickHandler = (group, link) => {
    if (group.title === "쇼핑") {
      const categoryKey = SHOP_LINK_CATEGORY_KEYS[link];
      return categoryKey ? () => onCategoryClick(categoryKey) : undefined;
    }

    if (group.title === "고객지원") {
      const target = SUPPORT_LINK_TARGETS[link];

      if (target?.type === "myOrders") {
        return onMyOrders;
      }

      if (target?.type === "customerCenter") {
        return () => onCustomerCenter(target.section);
      }
    }

    if (group.title === "회사소개") {
      const section = COMPANY_LINK_SECTIONS[link];
      return section ? () => onCompany(section) : undefined;
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
