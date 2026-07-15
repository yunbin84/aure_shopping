function SiteHeader({ currentPage, onGoHome, onGoJoin, onGoLogin }) {
  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={onGoHome}>
        shoppingmall
      </button>
      <nav className="site-nav" aria-label="상단 메뉴">
        <button type="button" onClick={onGoHome}>
          메인
        </button>
        <button
          type="button"
          aria-current={currentPage === "login" ? "page" : undefined}
          onClick={onGoLogin}
        >
          로그인
        </button>
        <button
          type="button"
          aria-current={currentPage === "join" ? "page" : undefined}
          onClick={onGoJoin}
        >
          회원가입
        </button>
      </nav>
    </header>
  );
}

export default SiteHeader;
