import Link from "next/link";
import BreadcrumbsItem from "./BreadCrumbsItem";
import { useContext } from "react";
import { BreadcrumbContext } from "../Layout/Layout";

// Componente para Breadcrumbs
export const Breadcrumbs = ({ displayedTitle, collectionTitle }) => {
  const { breadcrumbTitle } = useContext(BreadcrumbContext);

  return (
    <nav
      className="home-section"
      aria-label="Breadcrumbs"
      style={{ marginTop: "120px" }}
    >
      <ul className="breadcrumbs">
        <li className="breadcrumbs__item">
          <Link href="/home" className="breadcrumbs__link">
            <i className="fas fa-home" style={{ fontSize: "13px" }}></i>
          </Link>
          <i className="fas fa-chevron-right" style={{ fontSize: "10px" }}></i>
        </li>
        <li className="breadcrumbs__item">
          <span className="breadcrumbs__link">Sumário</span>
          <meta itemProp="position" content="1" />
          <i className="fas fa-chevron-right" style={{ fontSize: "10px" }}></i>
        </li>
        {breadcrumbTitle && (
          <>
            <li className="breadcrumbs__item">
              <span className="breadcrumbs__link">{breadcrumbTitle}</span>
              <meta itemProp="position" content="2" />
              <i
                className="fas fa-chevron-right"
                style={{ fontSize: "10px" }}
              ></i>
            </li>
          </>
        )}
        <BreadcrumbsItem displayedTitle={displayedTitle} />
      </ul>
    </nav>
  );
};
