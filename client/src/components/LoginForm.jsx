import { useState } from "react";

const initialForm = {
  email: "",
  password: "",
};

function LoginForm({ onJoin, onLogin, onLoginSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const data = await onLogin(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.alert("로그인 성공");
      setForm(initialForm);
      onLoginSuccess();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.alert(`${provider} 로그인 연동 준비중입니다.`);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>로그인</h1>

      <p className="login-benefit">
        카카오톡 채널 추가 시 <strong>1만원 할인 쿠폰</strong> 즉시 지급!
      </p>

      <button
        className="kakao-login-button"
        type="button"
        onClick={() => handleSocialLogin("카카오")}
      >
        <span aria-hidden="true">●</span>
        카카오 회원가입/로그인
      </button>

      <section className="login-panel" aria-label="로그인 입력">
        <div className="login-field">
          <input
            id="loginEmail"
            name="email"
            onChange={handleChange}
            placeholder="아이디"
            required
            type="email"
            value={form.email}
          />
        </div>

        <div className="login-field">
          <input
            id="loginPassword"
            name="password"
            onChange={handleChange}
            placeholder="비밀번호"
            required
            type="password"
            value={form.password}
          />
        </div>

        <label className="login-save">
          <input type="checkbox" />
          보안접속
        </label>

        {status && <p className="login-status">{status}</p>}

        <button className="login-submit-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>
      </section>

      <div className="login-links">
        <button type="button">아이디 찾기</button>
        <button type="button">비밀번호 찾기</button>
        <button type="button">비회원주문조회</button>
      </div>

      <div className="social-login-grid">
        <button
          className="social-login-button naver-login-button"
          type="button"
          onClick={() => handleSocialLogin("네이버")}
        >
          <span aria-hidden="true">N</span>
          네이버 로그인
        </button>
        <button
          className="social-login-button apple-login-button"
          type="button"
          onClick={() => handleSocialLogin("애플")}
        >
          <span aria-hidden="true">●</span>
          애플 로그인
        </button>
      </div>

      <button className="join-benefit-button" type="button" onClick={onJoin}>
        회원가입 후 혜택받기
      </button>
    </form>
  );
}

export default LoginForm;
