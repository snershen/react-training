import { useUser } from "../contexts/UserProvider";
import { useProduct } from "../contexts/ProductProvider";
import { useModal } from "../contexts/ModalProvider";


import ProductModal from "./ProductModal";
import Pagination from "./Pagination";

const ProductList = () => {
  const { logout } = useUser();
  const { products, showProductModal } = useProduct();
  const { showModal } = useModal();
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
                      onClick={() => showProductModal("edit", product, showModal())}
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
        <Pagination />
      </div>
      <ProductModal />
    </div>
  );
};

export default ProductList;
