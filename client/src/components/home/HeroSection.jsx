import heroModelImage from "../../assets/home/hero-model.png";

function HeroSection({ onCategoryClick }) {
  return (
    <section className="home-hero">
      <div className="home-hero-copy">
        <p>2026 SPRING COLLECTION</p>
        <h1>
          매일이 편안한
          <br />
          나만의 무드
        </h1>
        <span>
          움직임을 방해하지 않는 에어터치 원단으로 완성한 데일리 애슬레저.
          <br />
          요가부터 러닝, 그리고 일상까지 함께합니다.
        </span>
        <div className="home-hero-buttons">
          <button
            className="home-primary-button"
            onClick={() => onCategoryClick("new")}
            type="button"
          >
            신상품 보러가기 <span>→</span>
          </button>
          <button
            className="home-secondary-button"
            onClick={() => onCategoryClick("best")}
            type="button"
          >
            베스트 컬렉션
          </button>
        </div>
      </div>
      <img src={heroModelImage} alt="AURÉ 봄 시즌 컬렉션" />
    </section>
  );
}

export default HeroSection;
