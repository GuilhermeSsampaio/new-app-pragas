import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ChapterSearch from "../SearchBar/ChapterSearch";

export const Navbar = ({
  collections,
  handleSelectCollection,
  isOffcanvasOpen,
  setIsOffcanvasOpen,
  activeTitle,
  setActiveTitle,
  isChapterActive,
  setIsChapterActive,
  scrollToTop,
  setExpandedCollection,
  setCurrentCollection,
}) => {
  //Importação das Imagens
  var LogoIF = require("../../public/ifms-dr-marca-2015.png");
  var LogoEmbrapa = require("../../public/logo-embrapa-400.png");
  var LogoIFEmbrapa = require("../../public/logo-if-embrapa.png");
  var LogoBasf = require("../../public/BASF-Logo.png");

  const [results, setResults] = useState([]);
  const handleCloseResults = () => {
    setResults([]); // Limpa os resultados
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <>
      {/* Código Navbar Offcanvas */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white fixed-top"
        aria-label="Offcanvas navbar large"
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar2"
              aria-controls="offcanvasNavbar2"
            >
              <i className="fas fa-bars"></i>
            </button>
            {/* Logo Navbar */}
            <Link className="navbar-brand" href="/home">
              <Image src={LogoBasf} width={120} height={44} alt="logo Basf" />
            </Link>
          </div>
          {/* Input Search para tela menor que 992px */}
          <div className="search-container first-form-search p-1">
            <div className="search-bar-container">
              <ChapterSearch
                collections={collections}
                onSelectCollection={handleSelectCollection}
                closeSidebar={() => setIsOffcanvasOpen(false)}
                activeTitle={activeTitle}
                setActiveTitle={setActiveTitle}
                isChapterActive={isChapterActive}
                setIsChapterActive={setIsChapterActive}
                scrollToTop={scrollToTop}
                setExpandedCollection={setExpandedCollection}
              />
            </div>
          </div>

          {/* Código dos Itens Exibidos no Navbar */}
          <div
            className="offcanvas offcanvas-start text-bg-light"
            tabIndex="-1"
            id="offcanvasNavbar2"
            aria-labelledby="offcanvasNavbar2Label"
          >
            <div className="offcanvas-header">
              <ul className="navbar-nav d-flex links-logo-ifembrapa flex-row mx-1">
                {/* Logo IF / Embrapa Dentro do Menu */}
                <li className="nav-item">
                  <Link href="/home">
                    <Image
                      src={LogoBasf}
                      width={100}
                      height={32}
                      alt="logo Basf"
                      className="me-4 mt-1"
                    />
                    <Image
                      src={LogoIFEmbrapa}
                      className="img-navbar-menu me-3"
                      width="100%"
                      height={46}
                      alt="logo Embrapa com letras em azul com um simbolo verde, sendo que as letras em cima do simbolo são brancas"
                      priority
                    />
                  </Link>
                </li>
              </ul>
              <button
                type="button"
                className="btn-close btn-close-dark"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <hr className="featurette-divider"></hr>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 center-itens">
                <li className="nav-item mt-1">
                  <Link
                    className="nav-link back-item-link"
                    href="/edicao-completa"
                    aria-current="page"
                  >
                    <span className="link-text">Manual</span>
                  </Link>
                </li>
                <li className="nav-item mt-1">
                  <Link
                    className="nav-link back-item-link"
                    href="/autores"
                    aria-current="page"
                    onClick={(e) => {
                      if (router.pathname === "/autores") {
                        e.preventDefault();
                        window.location.reload();
                      }
                    }}
                  >
                    <span className="link-text">Autores</span>
                  </Link>
                </li>
              </ul>
              {/* Input Search para tela maior que 992px */}
              <div id="searchForm" className="search-container">
                <div className="d-flex position-relative p-1 search-bar-container">
                  <ChapterSearch
                    collections={collections}
                    onSelectCollection={handleSelectCollection}
                    closeSidebar={() => setIsOffcanvasOpen(false)}
                    activeTitle={activeTitle}
                    setActiveTitle={setActiveTitle}
                    isChapterActive={isChapterActive}
                    setIsChapterActive={setIsChapterActive}
                    scrollToTop={scrollToTop}
                    setExpandedCollection={setExpandedCollection}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
