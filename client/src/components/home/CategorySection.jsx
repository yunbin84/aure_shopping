function CategorySection({ categories, onCategoryClick }) {
  return (
    <section className="home-section home-category-section">
      <p className="home-section-kicker">CATEGORY</p>
      <h2>카테고리별 쇼핑</h2>
      <div className="home-category-grid">
        {categories.map((category) => (
          <button
            className="home-category-card"
            key={category.name}
            onClick={() => onCategoryClick(category.key)}
            type="button"
          >
            <img alt={`${category.name} 카테고리`} src={category.image} />
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
