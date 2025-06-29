import FooterSection from "./FooterSection";
import logo from "../assets/logo-white-bordered.png";
import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="footer-sections">
          <img src={logo} alt="White logo of RakodelkoSYS" />
          <FooterSection
            heading='За "Ръкоделко"'
            sectionData={[
              { label: "За нас", href: "#" },
              { label: "Нашата мисия", href: "#" },
              { label: "Станете част от нас", href: "#" },
              { label: "Условия за използване", href: "#" },
              { label: "Блог", href: "#" },
            ]}
          />
          <FooterSection
            heading="Контакти"
            sectionData={[
              {
                label: "ул. „Георги Русев“ 27, София, България",
                href: "https://www.google.com/maps?q=ул.+„Георги+Русев“+27,+София,+България",
              },
              { label: "+359-895-226-371", href: "tel:+359895226371" },
              {
                label: "rakodelko.h@yahoo.com",
                href: "mailto:rakodelko.h@yahoo.com",
              },
              {
                label: "Работно време: Пон-Пет 10:00 - 18:00",
                isNotLink: true,
              },
            ]}
          />
          <FooterSection
            heading="Помощ"
            sectionData={[
              { label: "Как да пазарувам?", href: "#" },
              { label: "Доставка и връщане", href: "#" },
              { label: "Често задавани въпроси", href: "#" },
              { label: "Настройки на профила", href: "#" },
              { label: "Сигурност и поверителност", href: "#" },
            ]}
          />
        </div>
      </footer>
      <div className="copyright">
        <h4>2025 © Rakodelko SYS</h4>
      </div>
    </>
  );
}
