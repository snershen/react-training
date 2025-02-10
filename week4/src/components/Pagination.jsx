import { useProduct } from "../contexts/ProductProvider";

const Pagination = () => {
  const { pagination, setPagination, getProducts } = useProduct();

  if (!pagination || !pagination.current_page) {
    return null;
  }

  const { current_page, total_pages, has_pre, has_next } = pagination;

  const goToPage = (page) => {
    if (page < 1 || page > total_pages) return;
    setPagination({
      ...pagination,
      current_page: page,
    });
    getProducts(page);
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className={`page-item ${!has_pre ? "disabled" : ""}`}>
          <a className="page-link" href="#" onClick={() => goToPage(current_page - 1)}>
            上一頁
          </a>
        </li>
        {Array.from({ length: total_pages }, (_, index) => index + 1).map((page) => (
          <li className={`page-item ${page === current_page ? "active" : ""}`} key={page}>
            <a className="page-link" href="#" onClick={() => goToPage(page)}>
              {page}
            </a>
          </li>
        ))}
        <li className={`page-item ${!has_next ? "disabled" : ""}`}>
          <a className="page-link" href="#" onClick={() => goToPage(current_page + 1)}>
            下一頁
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
