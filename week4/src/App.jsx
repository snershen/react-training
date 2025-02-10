import "bootstrap/scss/bootstrap.scss";

import { UserProvider } from "./contexts/UserProvider";
import { ProductProvider } from "./contexts/ProductProvider";
import { ModalProvider } from "./contexts/ModalProvider";

import Admin from "./pages/Admin";

const App = () => {
  return (
    <ModalProvider>
      <ProductProvider>
        <UserProvider>
          <Admin />
        </UserProvider>
      </ProductProvider>
    </ModalProvider>
  );
};

export default App;
