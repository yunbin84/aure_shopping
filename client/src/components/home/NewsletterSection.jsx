function NewsletterSection() {
  return (
    <section className="home-newsletter">
      <h2>가장 먼저 소식을 받아보세요</h2>
      <p>
        신상품 출시와 단독 할인 소식을 이메일로 전해드립니다. 지금 구독하면 첫
        구매 10% 쿠폰을 드려요.
      </p>
      <form>
        <input aria-label="이메일 주소" placeholder="이메일 주소를 입력하세요" />
        <button type="button">구독하기</button>
      </form>
    </section>
  );
}

export default NewsletterSection;
