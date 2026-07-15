import { useEffect, useState } from "react";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNavbar from "../components/home/HomeNavbar.jsx";
import { footerGroups } from "../data/homeContent.js";

const brandMilestones = [
  { year: "2024", text: "AURÉ 브랜드 론칭" },
  { year: "2024", text: "온라인 스토어 오픈" },
  { year: "2025", text: "시그니처 에어터치 원단 개발" },
  { year: "2026", text: "강남 플래그십 스토어 오픈" },
];

const storeRows = [
  { name: "강남 플래그십 스토어", address: "서울 강남구 테헤란로 123", hours: "11:00 - 21:00" },
  { name: "성수 쇼룸", address: "서울 성동구 아차산로 45", hours: "11:00 - 20:00" },
  { name: "부산 센텀시티점", address: "부산 해운대구 센텀중앙로 90", hours: "10:30 - 20:00" },
];

const careerRows = [
  { position: "MD / 상품기획", location: "서울 본사", note: "경력 2년 이상" },
  { position: "온라인 마케터", location: "서울 본사", note: "신입 / 경력" },
  { position: "물류 / CS 담당", location: "인천 물류센터", note: "경력 무관" },
];

const SECTION_ID_BY_TARGET = {
  "brand-story": "co-brand-story",
  store: "co-store",
  careers: "co-careers",
  partnership: "co-partnership",
};

function CompanyPage({
  onAdmin,
  onCart,
  onCategoryClick,
  onCompany,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  onMyOrders,
  targetSection,
}) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [partnershipEmail, setPartnershipEmail] = useState("");
  const [partnershipMessage, setPartnershipMessage] = useState("");
  const [partnershipStatus, setPartnershipStatus] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const elementId = targetSection ? SECTION_ID_BY_TARGET[targetSection] : null;
    const element = elementId ? document.getElementById(elementId) : null;

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [targetSection]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    onGoHome();
  };

  const handlePartnershipSubmit = (event) => {
    event.preventDefault();

    if (!partnershipEmail || !partnershipMessage) {
      return;
    }

    setPartnershipStatus("제휴 문의가 접수되었습니다. 담당자 확인 후 회신드리겠습니다.");
    setPartnershipEmail("");
    setPartnershipMessage("");
  };

  return (
    <main className="company-page">
      <HomeNavbar
        isAdmin={user?.user_type === "admin"}
        isMenuOpen={isMenuOpen}
        onAdmin={onAdmin}
        onCart={onCart}
        onCategoryClick={onCategoryClick}
        onCustomerCenter={onCustomerCenter}
        onGoHome={onGoHome}
        onJoin={onJoin}
        onLogin={onLogin}
        onLogout={handleLogout}
        onMyOrders={onMyOrders}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="cc-hero">
        <p className="home-section-kicker">ABOUT</p>
        <h1>회사소개</h1>
        <p>AURÉ에 대해 소개합니다.</p>
      </section>

      <section className="cc-section" id="co-brand-story">
        <h2>브랜드 스토리</h2>
        <p className="cc-inquiry-desc">
          AURÉ는 &apos;매일이 편안한 나만의 무드&apos;라는 철학 아래 시작된 프리미엄 애슬레저 브랜드입니다.
          움직임을 방해하지 않는 소재 연구와 미니멀한 디자인으로, 운동부터 일상까지 자연스럽게 이어지는 옷을
          만듭니다.
        </p>
        <ul className="cc-info-list">
          {brandMilestones.map((item) => (
            <li key={`${item.year}-${item.text}`}>
              <strong>{item.year}</strong> — {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="cc-section" id="co-store">
        <h2>매장 안내</h2>
        <div className="cc-size-table-wrap">
          <table className="cc-size-table">
            <thead>
              <tr>
                <th>매장명</th>
                <th>주소</th>
                <th>운영시간</th>
              </tr>
            </thead>
            <tbody>
              {storeRows.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.address}</td>
                  <td>{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="cc-section" id="co-careers">
        <h2>채용 정보</h2>
        <div className="cc-size-table-wrap">
          <table className="cc-size-table">
            <thead>
              <tr>
                <th>포지션</th>
                <th>근무지</th>
                <th>모집 조건</th>
              </tr>
            </thead>
            <tbody>
              {careerRows.map((row) => (
                <tr key={row.position}>
                  <td>{row.position}</td>
                  <td>{row.location}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cc-size-note">지원 문의는 아래 제휴 문의 폼을 통해 이력서와 함께 남겨주세요.</p>
      </section>

      <section className="cc-section" id="co-partnership">
        <h2>제휴 문의</h2>
        <p className="cc-inquiry-desc">
          입점, 협업, 브랜드 제휴 관련 문의는 아래 양식으로 남겨주시면 담당자가 확인 후 연락드립니다.
        </p>
        <form className="cc-inquiry-form" onSubmit={handlePartnershipSubmit}>
          <input
            aria-label="답변받을 이메일"
            onChange={(event) => setPartnershipEmail(event.target.value)}
            placeholder="답변받을 이메일 주소"
            required
            type="email"
            value={partnershipEmail}
          />
          <textarea
            aria-label="제휴 문의 내용"
            onChange={(event) => setPartnershipMessage(event.target.value)}
            placeholder="제휴 문의 내용을 입력해주세요."
            required
            rows={5}
            value={partnershipMessage}
          />
          <button type="submit">문의 등록하기</button>
        </form>
        {partnershipStatus ? <p className="cc-inquiry-status">{partnershipStatus}</p> : null}
      </section>

      <HomeFooter
        footerGroups={footerGroups}
        onCategoryClick={onCategoryClick}
        onCompany={onCompany}
        onCustomerCenter={onCustomerCenter}
        onMyOrders={onMyOrders}
      />
    </main>
  );
}

export default CompanyPage;
