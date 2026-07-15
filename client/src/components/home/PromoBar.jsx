function PromoBar() {
  return (
    <div className="home-promo">
      <button type="button" aria-label="이전 프로모션">
        ‹
      </button>
      <span>봄맞이 시즌오프 최대 40% 할인 진행중</span>
      <button type="button" aria-label="다음 프로모션">
        ›
      </button>
    </div>
  );
}

export default PromoBar;
