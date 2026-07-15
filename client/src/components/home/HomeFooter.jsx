const SHOP_LINK_CATEGORY_KEYS = {
  신상품: "new",
  베스트: "best",
  레깅스: "leggings",
  브라탑: "bra",
};

function HomeFooter({ footerGroups, onCategoryClick }) {
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
          {group.links.map((link) => {
            const categoryKey = group.title === "쇼핑" ? SHOP_LINK_CATEGORY_KEYS[link] : null;

            return (
              <button
                key={link}
                type="button"
                onClick={categoryKey ? () => onCategoryClick(categoryKey) : undefined}
              >
                {link}
              </button>
            );
          })}
        </div>
      ))}
    </footer>
  );
}

export default HomeFooter;
