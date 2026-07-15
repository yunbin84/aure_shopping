import { useState } from "react";
import JoinForm from "../components/JoinForm.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { createUser } from "../api/users.js";

function JoinPage({ onGoHome, onGoJoin, onGoLogin }) {
  const [isJoined, setIsJoined] = useState(false);
  const handleJoin = (userData) => createUser(userData);

  return (
    <main className="join-page">
      <SiteHeader
        currentPage="join"
        onGoHome={onGoHome}
        onGoJoin={onGoJoin}
        onGoLogin={onGoLogin}
      />

      {isJoined ? (
        <section className="join-complete">
          <h1>회원가입이 완료되었습니다.</h1>
          <button type="button" onClick={onGoHome}>
            지금 쇼핑하기
          </button>
        </section>
      ) : (
        <JoinForm onJoin={handleJoin} onJoinSuccess={() => setIsJoined(true)} />
      )}
    </main>
  );
}

export default JoinPage;
