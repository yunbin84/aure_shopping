import { useEffect, useState } from "react";
import { getMyProfile, loginUser } from "../api/users.js";
import HomeNavbar from "../components/home/HomeNavbar.jsx";
import LoginForm from "../components/LoginForm.jsx";

function LoginPage({ onGoCart, onGoCustomerCenter, onGoHome, onGoJoin, onGoLogin, onGoSearch }) {
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const handleLogin = (userData) => loginUser(userData);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsCheckingToken(false);
      return;
    }

    const checkToken = async () => {
      try {
        const data = await getMyProfile(token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onGoHome();
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, [onGoHome]);

  if (isCheckingToken) {
    return (
      <main className="login-page">
        <HomeNavbar
          isAdmin={false}
          isMenuOpen={false}
          onCart={onGoCart}
          onCustomerCenter={onGoCustomerCenter}
          onGoHome={onGoHome}
          onJoin={onGoJoin}
          onLogin={onGoLogin}
          onLogout={() => {}}
          onSearch={onGoSearch}
          onToggleMenu={() => {}}
          user={null}
        />
        <p className="login-checking">로그인 상태를 확인하고 있습니다.</p>
      </main>
    );
  }

  return (
    <main className="login-page">
      <HomeNavbar
        isAdmin={false}
        isMenuOpen={false}
        onCart={onGoCart}
        onCustomerCenter={onGoCustomerCenter}
        onGoHome={onGoHome}
        onJoin={onGoJoin}
        onLogin={onGoLogin}
        onLogout={() => {}}
        onSearch={onGoSearch}
        onToggleMenu={() => {}}
        user={null}
      />
      <LoginForm onJoin={onGoJoin} onLogin={handleLogin} onLoginSuccess={onGoHome} />
    </main>
  );
}

export default LoginPage;
