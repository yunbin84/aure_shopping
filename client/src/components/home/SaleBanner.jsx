import seasonOffImage from "../../assets/home/season-off-clean.png";

function SaleBanner({ onCategoryClick }) {
  return (
    <section className="home-sale-banner">
      <img src={seasonOffImage} alt="봄맞이 시즌오프" />
      <div>
        <p>SEASON OFF</p>
        <h2>
          봄맞이 시즌오프
          <br />
          최대 40% 할인
        </h2>
        <span>
          베스트셀러 레깅스부터 신상 아우터까지, 지금이 가장 좋은 기회예요.
          기간 한정 특가로 만나보세요.
        </span>
        <button type="button" onClick={() => onCategoryClick("sale")}>
          할인 상품 보기 →
        </button>
      </div>
    </section>
  );
}

export default SaleBanner;
