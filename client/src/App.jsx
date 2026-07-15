import { useEffect, useState } from "react";
import AdminPage from "./pages/admin/AdminPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ChekoutPage from "./pages/ChekoutPage.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import CustomerCenterPage from "./pages/CustomerCenterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import JoinPage from "./pages/JoinPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import OrderCancelPage from "./pages/OrderCancelPage.jsx";
import OrderCompletePage from "./pages/OrderCompletePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";

const CATEGORY_FILTERS = {
  new: { category: undefined, title: "신상품" },
  best: { category: undefined, title: "베스트" },
  leggings: { category: "leggings", title: "레깅스" },
  bra: { category: "bra", title: "브라탑" },
  yogapants: { category: "yogapants", title: "요가팬츠" },
  outer: { category: "outer", title: "아우터" },
  shirt: { category: "shirt", title: "티셔츠" },
  sale: { category: undefined, title: "세일" },
};

const buildHistoryState = ({
  page,
  selectedProductId,
  orderResult,
  activeOrder,
  productListFilter,
  customerCenterSection,
  companySection,
}) => ({
  page,
  selectedProductId,
  orderResult,
  activeOrder,
  productListFilter,
  customerCenterSection,
  companySection,
});

function App() {
  const [page, setPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [productListFilter, setProductListFilter] = useState(CATEGORY_FILTERS.new);
  const [customerCenterSection, setCustomerCenterSection] = useState(null);
  const [companySection, setCompanySection] = useState(null);

  useEffect(() => {
    window.history.replaceState(
      buildHistoryState({
        page: "home",
        selectedProductId: "",
        orderResult: null,
        activeOrder: null,
        productListFilter: CATEGORY_FILTERS.new,
        customerCenterSection: null,
        companySection: null,
      }),
      "",
    );

    const handlePopState = (event) => {
      const state = event.state;

      if (!state) {
        setPage("home");
        return;
      }

      setPage(state.page);
      setSelectedProductId(state.selectedProductId || "");
      setOrderResult(state.orderResult || null);
      setActiveOrder(state.activeOrder || null);
      setProductListFilter(state.productListFilter || CATEGORY_FILTERS.new);
      setCustomerCenterSection(state.customerCenterSection || null);
      setCompanySection(state.companySection || null);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPage, updates = {}) => {
    const nextState = {
      page: nextPage,
      selectedProductId: "selectedProductId" in updates ? updates.selectedProductId : selectedProductId,
      orderResult: "orderResult" in updates ? updates.orderResult : orderResult,
      activeOrder: "activeOrder" in updates ? updates.activeOrder : activeOrder,
      productListFilter: "productListFilter" in updates ? updates.productListFilter : productListFilter,
      customerCenterSection:
        "customerCenterSection" in updates ? updates.customerCenterSection : customerCenterSection,
      companySection: "companySection" in updates ? updates.companySection : companySection,
    };

    setPage(nextState.page);
    setSelectedProductId(nextState.selectedProductId);
    setOrderResult(nextState.orderResult);
    setActiveOrder(nextState.activeOrder);
    setProductListFilter(nextState.productListFilter);
    setCustomerCenterSection(nextState.customerCenterSection);
    setCompanySection(nextState.companySection);

    window.history.pushState(buildHistoryState(nextState), "");
  };

  const goAdmin = () => navigate("admin");
  const goHome = () => navigate("home");
  const goJoin = () => navigate("join");
  const goLogin = () => navigate("login");
  const goCustomerCenter = (section) =>
    navigate("customer-center", { customerCenterSection: typeof section === "string" ? section : null });
  const goCompany = (section) =>
    navigate("company", { companySection: typeof section === "string" ? section : null });
  const goCart = () => navigate("cart");
  const goOrder = () => navigate("order");
  const goOrderResult = (result) => navigate("order-complete", { orderResult: result });
  const goMyOrders = () => navigate("my-orders");
  const goOrderCancel = (order) => navigate("order-cancel", { activeOrder: order });
  const goProductDetail = (productId) => navigate("product-detail", { selectedProductId: productId });
  const goProductList = (key) =>
    navigate("product-list", { productListFilter: CATEGORY_FILTERS[key] || CATEGORY_FILTERS.new });

  if (page === "admin") {
    return (
      <AdminPage
        onGoAdmin={goAdmin}
        onGoCart={goCart}
        onGoCategoryClick={goProductList}
        onGoHome={goHome}
        onGoLogin={goLogin}
        onGoMyOrders={goMyOrders}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage
        onGoCart={goCart}
        onGoCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onGoJoin={goJoin}
        onGoLogin={goLogin}
      />
    );
  }

  if (page === "join") {
    return (
      <JoinPage
        onGoCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onGoJoin={goJoin}
        onGoLogin={goLogin}
      />
    );
  }

  if (page === "customer-center") {
    return (
      <CustomerCenterPage
        onAdmin={goAdmin}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCompany={goCompany}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onMyOrders={goMyOrders}
        targetSection={customerCenterSection}
      />
    );
  }

  if (page === "company") {
    return (
      <CompanyPage
        onAdmin={goAdmin}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCompany={goCompany}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onMyOrders={goMyOrders}
        targetSection={companySection}
      />
    );
  }

  if (page === "cart") {
    return (
      <CartPage
        onAdmin={goAdmin}
        onCategoryClick={goProductList}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onMyOrders={goMyOrders}
        onOrder={goOrder}
      />
    );
  }

  if (page === "order") {
    return (
      <ChekoutPage
        onAdmin={goAdmin}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onMyOrders={goMyOrders}
        onOrderResult={goOrderResult}
      />
    );
  }

  if (page === "order-complete") {
    return (
      <OrderCompletePage
        onAdmin={goAdmin}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onViewOrder={goMyOrders}
        result={orderResult}
      />
    );
  }

  if (page === "my-orders") {
    return (
      <MyOrdersPage
        onAdmin={goAdmin}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onSelectOrder={goOrderCancel}
      />
    );
  }

  if (page === "order-cancel") {
    return (
      <OrderCancelPage
        onAdmin={goAdmin}
        onBack={goMyOrders}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        order={activeOrder}
      />
    );
  }

  if (page === "product-detail") {
    return (
      <ProductDetailPage
        onAdmin={goAdmin}
        onBack={goHome}
        onBuyNow={goOrder}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCompany={goCompany}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onMyOrders={goMyOrders}
        productId={selectedProductId}
      />
    );
  }

  if (page === "product-list") {
    return (
      <ProductListPage
        category={productListFilter.category}
        onAdmin={goAdmin}
        onCart={goCart}
        onCategoryClick={goProductList}
        onCompany={goCompany}
        onCustomerCenter={goCustomerCenter}
        onGoHome={goHome}
        onJoin={goJoin}
        onLogin={goLogin}
        onMyOrders={goMyOrders}
        onProductClick={goProductDetail}
        title={productListFilter.title}
      />
    );
  }

  return (
    <HomePage
      onAdmin={goAdmin}
      onJoin={goJoin}
      onCompany={goCompany}
      onCustomerCenter={goCustomerCenter}
      onLogin={goLogin}
      onCart={goCart}
      onCategoryClick={goProductList}
      onGoHome={goHome}
      onMyOrders={goMyOrders}
      onProductClick={goProductDetail}
    />
  );
}

export default App;
