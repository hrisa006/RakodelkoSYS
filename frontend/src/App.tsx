import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Home from "./components/Home";
import MainLayout from "./layout/MainLayout";
import { useEffect } from "react";
import { injectCssVariables } from "./styles/theme";
import ItemsPage from "./components/ItemsPage";
import ItemDetailsPage from "./components/ItemDetailPage";
import NewItemsPage from "./components/NewItemsPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    injectCssVariables();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewItemsPage />} />
          <Route path="/items" element={<ItemsPage />}></Route>
          <Route path="/items/:id" element={<ItemDetailsPage />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
