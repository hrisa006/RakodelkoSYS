import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import Home from "./components/Home";
import MainLayout from "./layout/MainLayout";
import { useEffect } from "react";
import { injectCssVariables } from "./styles/theme";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    injectCssVariables();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />}></Route>
              <Route></Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
