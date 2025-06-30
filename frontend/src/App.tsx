import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

import MainLayout from "./components/templates/MainLayout";
import ItemsPage from "./components/pages/ItemsPage";
import ItemDetailsPage from "./components/pages/ItemDetailPage";
import NewItemsPage from "./components/pages/NewItemsPage";
import LoginPage from "./components/pages/auth/LoginPage";
import RequireAuth from "./components/templates/RequireAuth";
import Home from "./components/pages/Home";
import OrderConfirmPage from "./components/pages/private/OrderConfirmPage";
import CartPage from "./components/pages/private/CartPage";
import ProfilePage from "./components/pages/private/ProfilePage";
import RegisterPage from "./components/pages/auth/RegisterPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/new" element={<NewItemsPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/:id" element={<ItemDetailsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <CartPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:id/confirm"
            element={
              <RequireAuth>
                <OrderConfirmPage />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
