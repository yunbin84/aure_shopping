import { useState } from "react";

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      return;
    }

    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <section className="home-newsletter">
      <h2>가장 먼저 소식을 받아보세요</h2>
      <p>
        신상품 출시와 단독 할인 소식을 이메일로 전해드립니다. 지금 구독하면 첫
        구매 10% 쿠폰을 드려요.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          aria-label="이메일 주소"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일 주소를 입력하세요"
          required
          type="email"
          value={email}
        />
        <button type="submit">구독하기</button>
      </form>

      {isSubscribed ? (
        <div className="newsletter-modal" role="dialog" aria-modal="true">
          <div className="newsletter-modal-card">
            <p className="newsletter-modal-title">축하합니다!</p>
            <p className="newsletter-modal-message">
              이메일로 10% 할인 쿠폰을 보내드렸습니다.
            </p>
            <button type="button" onClick={() => setIsSubscribed(false)}>
              확인
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default NewsletterSection;
