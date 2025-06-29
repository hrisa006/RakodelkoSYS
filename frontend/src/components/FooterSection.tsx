import React from "react";
import "./FooterSection.css";

interface FooterSectionProps {
  heading: string;
  sectionData: { label: string; href?: string; isNotLink?: boolean }[];
}

const FooterSection: React.FC<FooterSectionProps> = ({
  heading,
  sectionData,
}) => (
  <div className="footer-section">
    <h3>{heading}</h3>
    <ul>
      {sectionData.map((d) => (
        <li key={d.label}>
          <a href={d.href} className={d.isNotLink ? "not-link" : undefined}>
            {d.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterSection;
