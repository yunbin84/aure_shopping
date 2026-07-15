const TOTAL_SLOTS = 8;

function BestSellerSection({ activeFilter, filterTabs, onFilterClick, onProductClick, products, status }) {
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, index) => products[index] || null);

  return (
    <section className="home-section home-best-section">
      <p className="home-section-kicker">BEST SELLERS</p>
      <h2>지금 가장 사랑받는 아이템</h2>
      <div className="home-filter-tabs">
        {filterTabs.map((tab) => (
          <button
            className={tab === activeFilter ? "is-active" : ""}
            key={tab}
            type="button"
            onClick={() => onFilterClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {status === "loading" ? (
        <p className="home-product-status">상품 정보를 불러오고 있습니다.</p>
      ) : null}
      {status === "error" ? (
        <p className="home-product-status">상품 정보를 불러오지 못했습니다.</p>
      ) : null}
      <div className="home-product-grid">
        {slots.map((product, index) =>
          product ? (
            <button
              className="home-product-card"
              disabled={!product.id}
              key={product.uiKey || product.id || product.name}
              onClick={() => onProductClick(product.id)}
              type="button"
            >
              <div className="home-product-image">
                <img alt={product.name} src={product.image} />
                <span>{product.badge}</span>
              </div>
              <p>{product.category}</p>
              <h3>{product.name}</h3>
              <div className="home-price-row">
                {product.originalPrice ? <strong>20%</strong> : null}
                <b>{product.price}</b>
                {product.originalPrice ? <del>{product.originalPrice}</del> : null}
              </div>
              <div className="home-review-row">
                <span>★ {product.rating}</span>
                <span>{product.reviews}</span>
              </div>
            </button>
          ) : (
            <div className="home-product-card home-product-card-empty" key={`empty-${index}`}>
              <div className="home-product-image" />
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export default BestSellerSection;
