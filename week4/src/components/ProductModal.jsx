import { useEffect } from "react";
import { Modal } from "bootstrap";

import { useProduct } from "../contexts/ProductProvider";
import { useModal } from "../contexts/ModalProvider";

const ProductModal = () => {
  const { modalType, templateData, setTemplateData, updateProducts, removeProduct } = useProduct();

  const { productModalRef, hideModal } = useModal();

  useEffect(() => {
    productModalRef.current = new Modal("#productModal", {
      keyboard: false,
      backdrop: "static",
    });
  }, []);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTemplateData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;
      return { ...prevData, imagesUrl: adjustImages(newImages, value, index) };
    });
  };

  const adjustImages = (images, value, index) => {
    if (value && index === images.length - 1 && images.length < 5) {
      images.push("");
    }

    if (images[images.length - 1] === "") {
      images.pop();
    }

    return images;
  };

  const handleAddImage = () => {
    if (templateData.imagesUrl.length >= 5) {
      alert("副圖數量不能超過 5 張");
      return;
    }
    setTemplateData((prevData) => ({
      ...prevData,
      imagesUrl: [...prevData.imagesUrl, ""],
    }));
  };

  const handleRemoveImage = () => {
    setTemplateData((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return { ...prevData, imagesUrl: newImages };
    });
  };

  return (
    <div id="productModal" className="modal fade" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 id="productModalLabel" className="modal-title">
              <span>{modalType === "new" ? "新增產品" : modalType === "edit" ? "編輯產品" : "移除產品"}</span>
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="h4">
                確定要刪除
                <span className="text-danger">{templateData.title}</span>
                嗎?
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        id="imageUrl"
                        value={templateData.imageUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                    <img className="img-fluid" src={templateData.imageUrl} alt="主圖" />
                  </div>
                  {templateData.imagesUrl.map((image, index) => (
                    <div key={index} className="mb-2">
                      {
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                        />
                      }

                      {image && <img src={image} alt={`副圖 ${index + 1}`} className="mb-2 img-fluid" />}
                    </div>
                  ))}
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm d-block w-100"
                      onClick={handleAddImage}
                      disabled={templateData.imagesUrl[templateData.imagesUrl.length - 1] === ""}
                    >
                      新增圖片
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-outline-danger btn-sm d-block w-100"
                      onClick={handleRemoveImage}
                      disabled={templateData.imagesUrl.length === 0}
                    >
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={templateData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={templateData.category}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={templateData.unit}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={templateData.origin_price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={templateData.price}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={templateData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={templateData.content}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={templateData.is_enabled}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={hideModal}>
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                modalType === "delete" ? removeProduct(templateData.id) : updateProducts(modalType, templateData.id)
              }
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
