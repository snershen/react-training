import { useState, createContext, useContext } from "react";
import { useModal } from "./ModalProvider";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { showModal, hideModal } = useModal();
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState(null);

  const [modalType, setModalType] = useState("");

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
    showModal();
  };

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
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

  return (
    <>
      <ProductContext.Provider
        value={{
          products,
          pagination,
          setPagination,
          getProducts,
          updateProducts,
          removeProduct,
          modalType,
          showProductModal,
          templateData,
          setTemplateData,
        }}
      >
        {children}
      </ProductContext.Provider>
    </>
  );
};

export const useProduct = () => useContext(ProductContext);
