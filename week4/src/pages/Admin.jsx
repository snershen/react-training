import { useUser } from "../contexts/UserProvider";

import LoginForm from "../components/LoginForm";
import ProductList from "../components/ProductList";

const Admin = () => {
  const { isAuth } = useUser();
  return <>{isAuth ? <ProductList /> : <LoginForm />}</>;
};

export default Admin;
