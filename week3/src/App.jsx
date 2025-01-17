import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from "bootstrap/js/dist/modal";
import "bootstrap/scss/bootstrap.scss";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "hotel-booking";

const LoginForm = ({ setIsAuth, getProducts }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      alert(error ? "登入失敗" : error.response.data.message);
    }
  };

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
};

const ProductList = ({ products, showProductModal, logout }) => {
  return (
    <div>
      <div className="container">
        <div className="text-end mt-4">
          <button className="btn btn-secondary me-2" onClick={logout}>
            登出
          </button>
          <button className="btn btn-primary" onClick={() => showProductModal("new")}>
            建立新的產品
          </button>
        </div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th width="120">分類</th>
              <th>產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="100">是否啟用</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td>{product.origin_price}</td>
                <td>{product.price}</td>
                <td>{product.is_enabled ? <span className="text-success">啟用</span> : <span>未啟用</span>}</td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => showProductModal("edit", product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => showProductModal("delete", product)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductModal = ({ id, modalType, templateData, setTemplateData, updateProducts, removeProduct, hideModal }) => {
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
    <div id={id} className="modal fade" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
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

const App = () => {
  // ===== 資料 =====
  // 驗證
  const [isAuth, setIsAuth] = useState(false);

  // 產品
  const [products, setProducts] = useState([]);

  // Modal
  const [modalType, setModalType] = useState("");
  const productModalRef = useRef(null);
  const [templateData, setTemplateData] = useState({
    category: "",
    content: "",
    description: "",
    id: "",
    imageUrl: "",
    imagesUrl: [],
    is_enabled: false,
    origin_price: "",
    price: "",
    title: "",
    unit: "",
    num: "",
  });

  // ===== 功能 =====
  // Modal
  const showProductModal = (type, product = {}) => {
    setModalType(type);
    setTemplateData({
      category: product.category || "",
      content: product.content || "",
      description: product.description || "",
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      imagesUrl: product.imagesUrl || [],
      is_enabled: product.is_enabled || false,
      origin_price: product.origin_price || "",
      price: product.price || "",
      title: product.title || "",
      unit: product.unit || "",
      num: product.num || "",
    });

    productModalRef.current.show();
  };

  const hideModal = () => {
    productModalRef.current.hide();
  };

  // ===== API =====
  // 登入與驗證
  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`);
      setIsAuth(false);
      document.cookie = `hexToken=;expires=;`;
    } catch (error) {
      alert("操作錯誤");
    }
  };

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
      getProducts();
      alert("通過驗證");
    } catch (error) {
      alert(error ? "尚未登入" : error.response?.data?.message);
    }
  };

  // 管理產品
  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(response.data.products);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const updateProducts = async (type, id) => {
    const method = type === "new" ? "post" : "put";
    const url = `${API_BASE}/api/${API_PATH}/admin/product${type === "edit" ? `/${id}` : ""}`;

    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        imagesUrl: templateData.imagesUrl,
        is_enabled: templateData.is_enabled ? 1 : 0,
      },
    };

    try {
      await axios[method](url, productData);
      getProducts();
      hideModal();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      hideModal();
      getProducts();
    } catch (error) {
      alert(error ? "刪除產品失敗" : error.message);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      axios.defaults.headers.common.Authorization = token;
      checkAdmin();
    }

    productModalRef.current = new Modal("#productModal", {
      keyboard: false,
      backdrop: "static",
    });
  }, []);

  return (
    <>
      {isAuth ? (
        <ProductList
          products={products}
          showProductModal={showProductModal}
          logout={logout}
          removeProduct={removeProduct}
        />
      ) : (
        <LoginForm setIsAuth={setIsAuth} getProducts={getProducts} />
      )}
      <ProductModal
        id="productModal"
        modalType={modalType}
        templateData={templateData}
        setTemplateData={setTemplateData}
        getProducts={getProducts}
        removeProduct={removeProduct}
        hideModal={hideModal}
        updateProducts={updateProducts}
      />
    </>
  );
};

export default App;
