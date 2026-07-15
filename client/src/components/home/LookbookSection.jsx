function LookbookSection({ lookbookItems }) {
  return (
    <section className="home-section home-lookbook-section">
      <p className="home-section-kicker">LOOKBOOK</p>
      <h2>스타일 무드보드</h2>
      <p className="home-instagram">@aure.official</p>
      <div className="home-lookbook-grid">
        {lookbookItems.map((image) => (
          <div className="home-lookbook-item" key={image}>
            <img alt="AURÉ 스타일 룩북" src={image} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default LookbookSection;
