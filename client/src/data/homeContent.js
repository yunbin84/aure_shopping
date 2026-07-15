import categoryBraImage from "../assets/home/category-bra.png";
import categoryLeggingsImage from "../assets/home/category-leggings.png";
import categoryOuterImage from "../assets/home/category-outer.png";
import categoryShirtImage from "../assets/home/category-shirt.png";
import lookbook01Image from "../assets/home/lookbook-01.png";
import lookbook02Image from "../assets/home/lookbook-02.png";
import lookbook03Image from "../assets/home/lookbook-03.png";
import lookbook04Image from "../assets/home/lookbook-04.png";

export const categories = [
  { key: "leggings", name: "레깅스", count: "48개 상품", image: categoryLeggingsImage },
  { key: "bra", name: "브라탑", count: "32개 상품", image: categoryBraImage },
  { key: "outer", name: "아우터", count: "21개 상품", image: categoryOuterImage },
  { key: "shirt", name: "티셔츠", count: "39개 상품", image: categoryShirtImage },
];

export const filterTabs = ["전체", "레깅스", "브라탑", "요가팬츠", "아우터", "티셔츠"];

export const lookbookItems = [
  lookbook01Image,
  lookbook02Image,
  lookbook03Image,
  lookbook04Image,
];

export const footerGroups = [
  {
    title: "쇼핑",
    links: ["신상품", "베스트", "레깅스", "브라탑"],
  },
  {
    title: "고객지원",
    links: ["주문/배송 조회", "교환/반품 안내", "사이즈 가이드", "1:1 문의"],
  },
  {
    title: "회사소개",
    links: ["브랜드 스토리", "매장 안내", "채용 정보", "제휴 문의"],
  },
];
