import { useEffect, useState } from "react";
import { getMyProfile, getUsers } from "../../api/users.js";
import ProductCreatePanel from "../../components/admin/ProductCreatePanel.jsx";
import HomeNavbar from "../../components/home/HomeNavbar.jsx";
import AdminOrderManagePage from "./AdminOrderManagePage.jsx";
import ProductManagePage from "./ProductManagePage.jsx";

const adminTabs = [
  { id: "dashboard", label: "관리자 대시보드" },
  { id: "product", label: "상품관리" },
  { id: "order", label: "주문관리" },
];

function AdminPage({ onGoAdmin, onGoCart, onGoCategoryClick, onGoHome, onGoLogin, onGoMyOrders }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [productView, setProductView] = useState("list");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("no-token");
      return;
    }

    const loadAdminData = async () => {
      try {
        const profileData = await getMyProfile(token);

        if (profileData.user.user_type !== "admin") {
          setUser(profileData.user);
          setStatus("forbidden");
          return;
        }

        const usersData = await getUsers(token);
        setUser(profileData.user);
        setUsers(usersData.users || []);
        localStorage.setItem("user", JSON.stringify(profileData.user));
        setStatus("ready");
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setStatus("error");
      }
    };

    loadAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    onGoHome();
  };

  const customerCount = users.filter((item) => item.user_type === "customer").length;
  const sellerCount = users.filter((item) => item.user_type === "seller").length;
  const adminCount = users.filter((item) => item.user_type === "admin").length;

  return (
    <main className="admin-page">
      <HomeNavbar
        isAdmin={user?.user_type === "admin"}
        isMenuOpen={isMenuOpen}
        onAdmin={onGoAdmin}
        onCart={onGoCart}
        onCategoryClick={onGoCategoryClick}
        onGoHome={onGoHome}
        onLogin={onGoLogin}
        onLogout={handleLogout}
        onMyOrders={onGoMyOrders}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        user={user}
      />

      <section className="admin-shell">
        <div className="admin-heading">
          <p>ADMIN DASHBOARD</p>
          <h1>관리자 페이지</h1>
          <span>회원 현황을 확인하고 쇼핑몰 운영 정보를 관리하는 공간입니다.</span>
        </div>

        {status === "loading" ? (
          <p className="admin-message">어드민 권한을 확인하고 있습니다.</p>
        ) : null}

        {status === "no-token" ? (
          <div className="admin-empty">
            <h2>로그인이 필요합니다.</h2>
            <p>어드민 페이지는 관리자 계정으로 로그인한 뒤 이용할 수 있습니다.</p>
            <button type="button" onClick={onGoLogin}>
              로그인하러 가기
            </button>
          </div>
        ) : null}

        {status === "forbidden" ? (
          <div className="admin-empty">
            <h2>접근 권한이 없습니다.</h2>
            <p>현재 로그인한 계정은 어드민 권한을 가지고 있지 않습니다.</p>
            <button type="button" onClick={onGoHome}>
              메인으로 돌아가기
            </button>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="admin-empty">
            <h2>정보를 불러오지 못했습니다.</h2>
            <p>로그인 정보가 만료되었거나 서버 연결을 확인해야 합니다.</p>
            <button type="button" onClick={onGoLogin}>
              다시 로그인하기
            </button>
          </div>
        ) : null}

        {status === "ready" ? (
          <>
            <div className="admin-tabs" role="tablist" aria-label="어드민 메뉴">
              {adminTabs.map((tab) => (
                <button
                  aria-selected={activeTab === tab.id}
                  className={activeTab === tab.id ? "is-active" : ""}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "dashboard" ? (
              <>
                <div className="admin-stats">
                  <article>
                    <span>전체 회원</span>
                    <strong>{users.length}</strong>
                  </article>
                  <article>
                    <span>고객</span>
                    <strong>{customerCount}</strong>
                  </article>
                  <article>
                    <span>판매자</span>
                    <strong>{sellerCount}</strong>
                  </article>
                  <article>
                    <span>관리자</span>
                    <strong>{adminCount}</strong>
                  </article>
                </div>

                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <h2>유저 목록</h2>
                    <p>서버에 저장된 유저 데이터를 확인합니다.</p>
                  </div>

                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>이름</th>
                          <th>이메일</th>
                          <th>권한</th>
                          <th>주소</th>
                          <th>가입일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((item) => (
                          <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.user_type}</td>
                            <td>{item.adress || "-"}</td>
                            <td>{new Date(item.createdAt).toLocaleDateString("ko-KR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}

            {activeTab === "product" ? (
              productView === "create" ? (
                <ProductCreatePanel onBack={() => setProductView("list")} />
              ) : (
                <ProductManagePage onCreate={() => setProductView("create")} />
              )
            ) : null}

            {activeTab === "order" ? <AdminOrderManagePage /> : null}
          </>
        ) : null}
      </section>
    </main>
  );
}

export default AdminPage;
