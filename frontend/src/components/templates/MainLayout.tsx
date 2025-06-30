import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 160px)" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
