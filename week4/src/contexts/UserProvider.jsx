import { useState, createContext, useContext } from "react";
import axios from "axios";

import { useProduct } from "./ProductProvider";

const API_BASE = import.meta.env.VITE_API_BASE;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { getProducts } = useProduct();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setIsAuth] = useState(false);

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

  return (
    <>
      <UserContext.Provider value={{ formData, handleInputChange, handleSubmit, isAuth, logout, checkAdmin }}>
        {children}
      </UserContext.Provider>
    </>
  );
};

export const useUser = () => useContext(UserContext);
