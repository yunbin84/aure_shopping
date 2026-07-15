import { useEffect, useState } from "react";
import BestSellerSection from "../components/home/BestSellerSection.jsx";
import CategorySection from "../components/home/CategorySection.jsx";
import HeroSection from "../components/home/HeroSection.jsx";
import HomeFooter from "../components/home/HomeFooter.jsx";
import HomeNavbar from "../components/home/HomeNavbar.jsx";
import LookbookSection from "../components/home/LookbookSection.jsx";
import NewsletterSection from "../components/home/NewsletterSection.jsx";
import PromoBar from "../components/home/PromoBar.jsx";
import SaleBanner from "../components/home/SaleBanner.jsx";
import { getProducts } from "../api/products.js";
import { getMyProfile } from "../api/users.js";
import { categories, filterTabs, footerGroups, lookbookItems } from "../data/homeContent.js";

const categoryLabels = {
  leggings: "레깅스",
  bra: "브라탑",
  yogapants: "요가팬츠",
  bottom: "하의",
  top: "상의",
  outer: "아우터",
  shirt: "티셔츠",
};

const categoryKeyByTab = {
  레깅스: "leggings",
  브라탑: "bra",
  요가팬츠: "yogapants",
  아우터: "outer",
  티셔츠: "shirt",
};

const formatProductPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const getOriginalPrice = (price) =>
  `${(Math.ceil(Number(price) / 0.8 / 1000) * 1000).toLocaleString("ko-KR")}원`;

const mapApiProductToHomeProduct = (product, index) => ({
  badge: index % 3 === 0 ? "NEW" : "BEST",
  category: categoryLabels[product.category] || product.category,
  id: product._id,
  image: product.thumbnail,
  name: product.name,
  originalPrice: index % 2 === 0 ? getOriginalPrice(product.price) : "",
  price: formatProductPrice(product.price),
  rating: index % 2 === 0 ? "4.9" : "4.8",
  reviews: index % 2 === 0 ? "리뷰 3,421" : "리뷰 2,187",
  uiKey: product._id,
});

function HomePage({
  onAdmin,
  onCart,
  onCategoryClick,
  onCustomerCenter,
  onGoHome,
  onJoin,
  onLogin,
  onMyOrders,
  onProductClick,
}) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mainProducts, setMainProducts] = useState([]);
  const [productStatus, setProductStatus] = useState("loading");
  const [activeFilter, setActiveFilter] = useState("전체");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    const loadMyProfile = async () => {
      try {
        const data = await getMyProfile(token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsMenuOpen(false);
      }
    };

    loadMyProfile();
  }, []);

  useEffect(() => {
    const loadMainProducts = async () => {
      setProductStatus("loading");

      try {
        const data = await getProducts({
          page: 1,
          limit: 8,
          category: categoryKeyByTab[activeFilter],
        });
        const apiProducts = data.products || [];

        setMainProducts(apiProducts.map(mapApiProductToHomeProduct));
        setProductStatus("ready");
      } catch (error) {
        setMainProducts([]);
        setProductStatus("error");
      }
    };

    loadMainProducts();
  }, [activeFilter]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <main className="home-page">
      <PromoBar />
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
      <HeroSection onCategoryClick={onCategoryClick} />
      <CategorySection categories={categories} onCategoryClick={onCategoryClick} />
      <BestSellerSection
        activeFilter={activeFilter}
        filterTabs={filterTabs}
        onFilterClick={setActiveFilter}
        onProductClick={onProductClick}
        products={mainProducts}
        status={productStatus}
      />
      <SaleBanner onCategoryClick={onCategoryClick} />
      <LookbookSection lookbookItems={lookbookItems} />
      <NewsletterSection />
      <HomeFooter footerGroups={footerGroups} onCategoryClick={onCategoryClick} />
    </main>
  );
}

export default HomePage;
