import { useState } from "react";

const initialForm = {
  email: "",
  name: "",
  password: "",
  passwordConfirm: "",
  user_type: "customer",
  adress: "",
};

const initialAgreements = {
  privacy: false,
  age: false,
  marketing: false,
};

function JoinForm({ onJoin, onJoinSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [agreements, setAgreements] = useState(initialAgreements);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAllAgreed = Object.values(agreements).every(Boolean);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAgreementChange = (event) => {
    const { name, checked } = event.target;
    setAgreements((current) => ({
      ...current,
      [name]: checked,
    }));
  };

  const handleAllAgreementsChange = (event) => {
    const { checked } = event.target;
    setAgreements({
      privacy: checked,
      age: checked,
      marketing: checked,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");

    if (form.password !== form.passwordConfirm) {
      setStatus("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await onJoin(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setForm(initialForm);
      setAgreements(initialAgreements);
      onJoinSuccess();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      <h1>회원가입</h1>

      <section className="form-section">
        <div className="section-heading">
          <h2>기본정보</h2>
          <div className="member-type" role="radiogroup" aria-label="회원 유형">
            <label>
              <input
                checked={form.user_type === "customer"}
                name="user_type"
                onChange={handleChange}
                type="radio"
                value="customer"
              />
              고객회원
            </label>
            <label>
              <input
                checked={form.user_type === "admin"}
                name="user_type"
                onChange={handleChange}
                type="radio"
                value="admin"
              />
              관리자
            </label>
            <label>
              <input
                checked={form.user_type === "seller"}
                name="user_type"
                onChange={handleChange}
                type="radio"
                value="seller"
              />
              판매자
            </label>
          </div>
        </div>

        <div className="field-row">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={form.email}
          />
        </div>

        <div className="field-row">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            minLength="6"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={form.password}
          />
          <p>6자 이상 입력해주세요.</p>
        </div>

        <div className="field-row">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            minLength="6"
            name="passwordConfirm"
            onChange={handleChange}
            required
            type="password"
            value={form.passwordConfirm}
          />
        </div>

        <div className="field-row">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            onChange={handleChange}
            required
            type="text"
            value={form.name}
          />
        </div>

        <div className="field-row">
          <label htmlFor="adress">주소</label>
          <input
            id="adress"
            name="adress"
            onChange={handleChange}
            placeholder="선택 입력"
            type="text"
            value={form.adress}
          />
        </div>
      </section>

      <section className="form-section option-section">
        <h2>회원가입 필수·선택 약관 안내</h2>
        <div className="agreement-list">
          <label className="agreement-all">
            <input checked={isAllAgreed} onChange={handleAllAgreementsChange} type="checkbox" />
            전체 동의
          </label>
          <label>
            <input
              checked={agreements.privacy}
              name="privacy"
              onChange={handleAgreementChange}
              required
              type="checkbox"
            />
            [필수] 개인정보수집 이용 동의
          </label>
          <label>
            <input
              checked={agreements.age}
              name="age"
              onChange={handleAgreementChange}
              required
              type="checkbox"
            />
            [필수] 만 14세 이상입니다.
          </label>
          <label>
            <input
              checked={agreements.marketing}
              name="marketing"
              onChange={handleAgreementChange}
              type="checkbox"
            />
            [선택] 쇼핑정보 수신 동의
          </label>
        </div>
      </section>

      {status && <p className="form-status">{status}</p>}

      <button className="submit-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "가입 중" : "회원가입하기"}
      </button>
    </form>
  );
}

export default JoinForm;
