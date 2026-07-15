function HomeFooter({ footerGroups }) {
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
            <button key={link} type="button">
              {link}
            </button>
          ))}
        </div>
      ))}
    </footer>
  );
}

export default HomeFooter;
