import { useEffect, useState } from "react";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNavbar from "../components/home/HomeNavbar.jsx";
import { footerGroups } from "../data/homeContent.js";

const faqItems = [
  {
    id: 47,
    tag: "회원",
    question: "회원 탈퇴는 어떻게 하나요?",
    answer: "마이페이지 > 회원정보 수정 하단의 '회원 탈퇴' 메뉴에서 신청할 수 있습니다. 탈퇴 시 보유하신 쿠폰/적립금은 모두 소멸됩니다.",
  },
  {
    id: 46,
    tag: "교환/환불",
    question: "제품이 불량인 것 같아요, 교환 또는 환불 받고 싶어요",
    answer: "1:1 문의 또는 고객센터로 주문번호와 불량 부위 사진을 남겨주시면, 확인 후 무료로 교환/환불 도와드립니다.",
  },
  {
    id: 45,
    tag: "회원",
    question: "마이페이지는 어떻게 볼 수 있나요?",
    answer: "로그인 후 상단에 표시되는 '마이페이지' 버튼을 누르면 내 주문 목록 등을 확인할 수 있습니다.",
  },
  {
    id: 44,
    tag: "회원",
    question: "AURÉ에 회원가입 하고 싶어요",
    answer: "상단의 '회원가입' 메뉴를 클릭한 뒤 이메일, 비밀번호, 이름을 입력하고 약관에 동의하면 바로 가입이 완료됩니다.",
  },
  {
    id: 43,
    tag: "회원",
    question: "AURÉ의 회원 등급(멤버십)이 궁금해요",
    answer: "누적 구매 금액에 따라 웰컴, 그린, 블랙 등급으로 나뉘며, 등급별로 적립률과 무료배송 혜택이 달라집니다.",
  },
  {
    id: 42,
    tag: "회원",
    question: "강사회원은 어떻게 신청하나요?",
    answer: "요가/필라테스 강사 인증 자료를 1:1 문의로 제출해주시면 심사 후 강사회원 전용 할인 혜택을 안내해드립니다.",
  },
  {
    id: 41,
    tag: "주문",
    question: "주문조회하는 방법을 알려주세요",
    answer: "로그인 후 마이페이지 > 내 주문 목록에서 주문 상태와 배송 현황을 확인할 수 있습니다.",
  },
  {
    id: 40,
    tag: "교환/환불",
    question: "사이즈교환 방법을 알려주세요.",
    answer: "내 주문 목록에서 해당 주문을 선택해 교환 신청을 남겨주시면, 상품 회수 후 원하시는 사이즈로 바로 발송해드립니다.",
  },
  {
    id: 39,
    tag: "주문취소",
    question: "주문취소 방법을 알려주세요.",
    answer: "상품 준비중 상태까지는 내 주문 목록에서 직접 취소할 수 있으며, 이미 출고된 경우에는 반품 절차로 진행됩니다.",
  },
  {
    id: 38,
    tag: "문의",
    question: "고객센터 문의 방법을 알려주세요.",
    answer: "이 페이지 하단의 1:1 문의를 이용해주시면 영업일 기준 1~2일 이내 답변드립니다.",
  },
  {
    id: 37,
    tag: "배송",
    question: "무료배송의 기준이 있나요?",
    answer: "5만원 이상 구매 시 무료배송이며, 미만인 경우 배송비 2,500원이 부과됩니다.",
  },
  {
    id: 36,
    tag: "교환/반품",
    question: "반품비는 얼마이고, 어떻게 책정되나요?",
    answer: "단순 변심으로 인한 반품은 왕복 배송비 5,000원이 차감되며, 상품 하자의 경우 반품비는 무료입니다.",
  },
  {
    id: 35,
    tag: "배송",
    question: "배송조회 방법을 알려주세요.",
    answer: "내 주문 목록에서 주문 건을 선택하면 택배사 및 송장번호를 확인할 수 있습니다.",
  },
  {
    id: 34,
    tag: "교환/반품",
    question: "반품신청 하고 싶어요.",
    answer: "내 주문 목록에서 반품하실 상품을 선택 후 반품 신청 버튼을 눌러주시면 접수됩니다.",
  },
  {
    id: 33,
    tag: "주문",
    question: "사은품을 수령하지 못했습니다.",
    answer: "사은품은 이벤트 재고 소진 시 누락될 수 있는 점 양해 부탁드리며, 1:1 문의 남겨주시면 확인 후 안내드립니다.",
  },
];

const sizeGuideRows = [
  { size: "XS", chest: "78-82", waist: "60-64", hip: "84-88" },
  { size: "S", chest: "83-87", waist: "65-69", hip: "89-93" },
  { size: "M", chest: "88-92", waist: "70-74", hip: "94-98" },
  { size: "L", chest: "93-97", waist: "75-79", hip: "99-103" },
  { size: "XL", chest: "98-102", waist: "80-84", hip: "104-108" },
];

const SECTION_ID_BY_TARGET = {
  faq: "cc-faq",
  return: "cc-return",
  "size-guide": "cc-size-guide",
  inquiry: "cc-inquiry",
};

function CustomerCenterPage({
  onAdmin,
  onCart,
  onCategoryClick,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  onMyOrders,
  targetSection,
}) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryStatus, setInquiryStatus] = useState("");

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

  const handleToggleFaq = (id) => {
    setOpenFaqId((current) => (current === id ? null : id));
  };

  const handleInquirySubmit = (event) => {
    event.preventDefault();

    if (!inquiryEmail || !inquiryMessage) {
      return;
    }

    setInquiryStatus("문의가 접수되었습니다. 영업일 기준 1~2일 이내 답변드리겠습니다.");
    setInquiryEmail("");
    setInquiryMessage("");
  };

  return (
    <main className="customer-center-page">
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
        <p className="home-section-kicker">CUSTOMER CENTER</p>
        <h1>고객센터</h1>
        <p>궁금하신 점을 빠르게 확인해보세요.</p>
      </section>

      <section className="cc-section" id="cc-faq">
        <h2>자주 묻는 질문</h2>
        <div className="cc-faq-list">
          {faqItems.map((item) => (
            <div className="cc-faq-item" key={item.id}>
              <button
                className="cc-faq-question"
                type="button"
                onClick={() => handleToggleFaq(item.id)}
                aria-expanded={openFaqId === item.id}
              >
                <span className="cc-faq-number">{item.id}</span>
                <span className="cc-faq-text">
                  [{item.tag}] {item.question}
                </span>
                <span className={`cc-faq-chevron ${openFaqId === item.id ? "is-open" : ""}`} aria-hidden="true">
                  ⌄
                </span>
              </button>
              {openFaqId === item.id ? (
                <p className="cc-faq-answer">{item.answer}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="cc-section" id="cc-return">
        <h2>반품/교환 안내</h2>
        <ul className="cc-info-list">
          <li>상품 수령 후 14일 이내 반품/교환 신청이 가능합니다.</li>
          <li>단순 변심으로 인한 반품 시 왕복 배송비 5,000원이 차감됩니다.</li>
          <li>상품 하자, 오배송의 경우 반품/교환 배송비는 전액 무료입니다.</li>
          <li>세탁 또는 착용 흔적이 있는 상품은 반품/교환이 제한될 수 있습니다.</li>
          <li>반품/교환 신청은 마이페이지 &gt; 내 주문 목록에서 접수할 수 있습니다.</li>
        </ul>
      </section>

      <section className="cc-section" id="cc-size-guide">
        <h2>사이즈 가이드</h2>
        <div className="cc-size-table-wrap">
          <table className="cc-size-table">
            <thead>
              <tr>
                <th>사이즈</th>
                <th>가슴둘레(cm)</th>
                <th>허리둘레(cm)</th>
                <th>엉덩이둘레(cm)</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuideRows.map((row) => (
                <tr key={row.size}>
                  <td>{row.size}</td>
                  <td>{row.chest}</td>
                  <td>{row.waist}</td>
                  <td>{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cc-size-note">
          제품 특성 및 측정 방법에 따라 1~2cm 오차가 있을 수 있습니다.
        </p>
      </section>

      <section className="cc-section" id="cc-inquiry">
        <h2>1:1 문의</h2>
        <p className="cc-inquiry-desc">
          운영시간: 평일 10:00 - 17:00 (주말/공휴일 휴무) · 이메일: support@aure-shopping.com
        </p>
        <form className="cc-inquiry-form" onSubmit={handleInquirySubmit}>
          <input
            aria-label="답변받을 이메일"
            onChange={(event) => setInquiryEmail(event.target.value)}
            placeholder="답변받을 이메일 주소"
            required
            type="email"
            value={inquiryEmail}
          />
          <textarea
            aria-label="문의 내용"
            onChange={(event) => setInquiryMessage(event.target.value)}
            placeholder="문의 내용을 입력해주세요."
            required
            rows={5}
            value={inquiryMessage}
          />
          <button type="submit">문의 등록하기</button>
        </form>
        {inquiryStatus ? <p className="cc-inquiry-status">{inquiryStatus}</p> : null}
      </section>

      <HomeFooter
        footerGroups={footerGroups}
        onCategoryClick={onCategoryClick}
        onCustomerCenter={onCustomerCenter}
        onMyOrders={onMyOrders}
      />
    </main>
  );
}

export default CustomerCenterPage;
