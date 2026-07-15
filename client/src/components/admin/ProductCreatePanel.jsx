import { useState } from "react";
import { createProduct } from "../../api/products.js";
import {
  cloudinaryConfig,
  isCloudinaryConfigured,
} from "../../config/cloudinary.js";

const initialProductForm = {
  name: "",
  sku: "",
  barcode: "",
  price: "",
  category: "",
  thumbnail: "",
  description: "",
};

const DRAFT_STORAGE_KEY = "aure_product_drafts";

const loadDraftsFromStorage = () => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const saveDraftsToStorage = (drafts) => {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
};

const formatDraftLabel = (draft) => {
  const time = new Date(draft.savedAt).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${draft.form.name || "이름 없음"} (${time})`;
};

const buildProductPayload = (form) => {
  const price = Number(form.price);

  if (Number.isNaN(price) || price < 0) {
    throw new Error("상품 가격을 올바르게 입력해주세요.");
  }

  if (!form.thumbnail) {
    throw new Error("상품 썸네일 이미지를 업로드해주세요.");
  }

  return {
    name: form.name.trim(),
    sku: form.sku.trim(),
    barcode: form.barcode.trim(),
    price,
    category: form.category,
    thumbnail: form.thumbnail,
    description: form.description.trim(),
  };
};

function ProductCreatePanel({ onBack }) {
  const [form, setForm] = useState(initialProductForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drafts, setDrafts] = useState(loadDraftsFromStorage);
  const [selectedDraftId, setSelectedDraftId] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleThumbnailUpload = () => {
    setStatus("");

    if (!isCloudinaryConfigured) {
      setStatus(
        "Cloudinary 설정이 필요합니다. client/.env에 VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET 값을 추가해주세요.",
      );
      return;
    }

    if (!window.cloudinary) {
      setStatus("Cloudinary 위젯을 불러오지 못했습니다. 네트워크 연결을 확인해주세요.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudinaryConfig.cloudName,
        uploadPreset: cloudinaryConfig.uploadPreset,
        sources: ["local", "url"],
        multiple: false,
        resourceType: "image",
        folder: "shoppingmall/products",
      },
      (error, result) => {
        if (error) {
          setStatus("이미지 업로드에 실패했습니다.");
          return;
        }

        if (result.event === "success") {
          setForm((currentForm) => ({
            ...currentForm,
            thumbnail: result.info.secure_url,
          }));
        }
      },
    );

    widget.open();
  };

  const handleSaveDraft = () => {
    const draftId = selectedDraftId || `draft-${Date.now()}`;
    const nextDraft = { id: draftId, savedAt: new Date().toISOString(), form };
    const nextDrafts = [nextDraft, ...drafts.filter((draft) => draft.id !== draftId)];

    saveDraftsToStorage(nextDrafts);
    setDrafts(nextDrafts);
    setSelectedDraftId(draftId);
    setStatus("임시저장되었습니다.");
  };

  const handleLoadDraft = (event) => {
    const draftId = event.target.value;
    setSelectedDraftId(draftId);
    setStatus("");

    if (!draftId) {
      setForm(initialProductForm);
      return;
    }

    const draft = drafts.find((item) => item.id === draftId);

    if (draft) {
      setForm(draft.form);
      setStatus("임시저장된 상품을 불러왔습니다.");
    }
  };

  const handleDeleteDraft = () => {
    if (!selectedDraftId) {
      return;
    }

    const nextDrafts = drafts.filter((draft) => draft.id !== selectedDraftId);

    saveDraftsToStorage(nextDrafts);
    setDrafts(nextDrafts);
    setSelectedDraftId("");
    setForm(initialProductForm);
    setStatus("임시저장을 삭제했습니다.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const productPayload = buildProductPayload(form);

      await createProduct(token, productPayload);

      if (selectedDraftId) {
        const nextDrafts = drafts.filter((draft) => draft.id !== selectedDraftId);
        saveDraftsToStorage(nextDrafts);
        setDrafts(nextDrafts);
      }

      window.alert("상품 등록 성공");
      setForm(initialProductForm);
      setSelectedDraftId("");
      onBack();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="product-create-page">
      <header className="product-create-header">
        <div>
          <button type="button" onClick={onBack} aria-label="상품 관리로 돌아가기">
            ←
          </button>
          <h2>상품 관리</h2>
        </div>
        <button className="product-create-top-button" type="button">
          + 새 상품 등록
        </button>
      </header>

      <div className="product-create-tabs">
        <button type="button" onClick={onBack}>
          상품 목록
        </button>
        <button className="is-active" type="button">
          상품 등록
        </button>
      </div>

      <form className="product-create-card" onSubmit={handleSubmit}>
        <div className="product-create-title-row">
          <h3>새 상품 등록</h3>

          {drafts.length > 0 ? (
            <div className="product-create-draft-picker">
              <select onChange={handleLoadDraft} value={selectedDraftId}>
                <option value="">임시저장 불러오기 ({drafts.length}개)</option>
                {drafts.map((draft) => (
                  <option key={draft.id} value={draft.id}>
                    {formatDraftLabel(draft)}
                  </option>
                ))}
              </select>
              {selectedDraftId ? (
                <button type="button" onClick={handleDeleteDraft}>
                  임시저장 삭제
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="product-create-grid">
          <div className="product-create-left">
            <label>
              상품명
              <input
                name="name"
                onChange={handleChange}
                placeholder="상품명을 입력하세요"
                required
                value={form.name}
              />
            </label>

            <div className="product-create-row">
              <label>
                SKU ID
                <input
                  name="sku"
                  onChange={handleChange}
                  placeholder="예: AURE-LEGGINGS-001"
                  required
                  value={form.sku}
                />
              </label>
              <label>
                바코드
                <input
                  name="barcode"
                  onChange={handleChange}
                  placeholder="바코드를 입력하세요"
                  required
                  value={form.barcode}
                />
              </label>
            </div>

            <label>
              상품 가격
              <input
                min="0"
                name="price"
                onChange={handleChange}
                placeholder="0"
                required
                type="number"
                value={form.price}
              />
            </label>

            <label>
              카테고리
              <select
                name="category"
                onChange={handleChange}
                required
                value={form.category}
              >
                <option value="" disabled>
                  카테고리 선택
                </option>
                <option value="leggings">레깅스</option>
                <option value="bra">브라탑</option>
                <option value="yogapants">요가팬츠</option>
                <option value="bottom">하의</option>
                <option value="top">상의</option>
                <option value="outer">아우터</option>
                <option value="shirt">티셔츠</option>
              </select>
            </label>

            <label>
              썸네일
              <div className="product-thumbnail-uploader">
                {form.thumbnail ? (
                  <img src={form.thumbnail} alt="상품 썸네일 미리보기" />
                ) : (
                  <div className="product-thumbnail-empty">이미지 미리보기</div>
                )}
                <button type="button" onClick={handleThumbnailUpload}>
                  Cloudinary로 이미지 업로드
                </button>
                <input
                  name="thumbnail"
                  readOnly
                  required
                  value={form.thumbnail}
                  placeholder="업로드하면 이미지 URL이 들어갑니다"
                />
              </div>
            </label>
          </div>

          <div className="product-create-right">
            <label>
              설명
              <textarea
                name="description"
                onChange={handleChange}
                placeholder="상품에 대한 자세한 설명을 입력하세요"
                rows="10"
                value={form.description}
              />
            </label>
          </div>
        </div>

        {status ? <p className="product-create-status">{status}</p> : null}

        <div className="product-create-actions">
          <button type="button" onClick={onBack}>
            취소
          </button>
          <button type="button" onClick={handleSaveDraft}>
            임시저장
          </button>
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "등록 중" : "상품 등록하기"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductCreatePanel;
