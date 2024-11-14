import React from "react";
import Link from "next/link";
import Image from "next/image";
import ChapterSearch from "../SearchBar/ChapterSearch";

export const NavbarCapitulos = ({
  isOffcanvasOpen,
  setIsOffcanvasOpen,
  handleToggleBackDrop,
  collections,
  handleSelectCollection,
  Logo,
  LogoIF,
  LogoEmbrapa,
  activeTitle,
  setActiveTitle,
  isChapterActive,
  setIsChapterActive,
  scrollToTop,
  setExpandedCollection, // Adicionar setExpandedCollection
}) => {
  return (
    <nav
      id="main-navbar"
      className="navbar navbar-expand-lg navbar-light bg-white fixed-top"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-mdb-toggle="collapse"
          data-mdb-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle Offcanvas"
          onClick={handleToggleBackDrop}
        >
          <i className="fas fa-bars"></i>
        </button>
        <Link className="navbar-brand" href="/home">
          <Image src={Logo} width={120} height={44} alt="logo Basf" />
        </Link>
        <ul className="navbar-nav ms-auto d-flex flex-row">
          <li className="nav-item text-item-link mt-1">
            <Link
              className="nav-link back-item-link"
              href="/edicao-completa"
              aria-current="page"
            >
              <span className="link-text">Manual</span>
            </Link>
          </li>
          <li className="nav-item text-item-link mt-1">
            <Link
              className="nav-link back-item-link"
              href="/autores"
              aria-current="page"
            >
              <span className="link-text">Autores</span>
            </Link>
          </li>
          <div className="hide-form-search2">
            <form
              className="d-flex rounded-pill position-relative first-form-search"
              role="search"
            >
              <div className="search-bar-container mt-1 p-1">
                <ChapterSearch
                  collections={collections}
                  onSelectCollection={handleSelectCollection}
                  closeSidebar={() => setIsOffcanvasOpen(false)}
                  activeTitle={activeTitle}
                  setActiveTitle={setActiveTitle}
                  isChapterActive={isChapterActive}
                  setIsChapterActive={setIsChapterActive}
                  scrollToTop={scrollToTop}
                  setExpandedCollection={setExpandedCollection} // Passar setExpandedCollection para ChapterSearch
                />
              </div>
            </form>
          </div>
          <li className="nav-item">
            <Image
              src={LogoIF}
              className="logotipo img"
              width={130}
              height={35}
              alt="Logotipo do IFMS Campus Dourados"
              priority
            />
          </li>
          <li className="nav-item me-lg-0">
            <Image
              src={LogoEmbrapa}
              className="logotipo img"
              width={70}
              height={48}
              alt="Logotipo da Embrapa"
              priority
            />
          </li>
          <form className="d-flex rounded-pill position-relative" role="search">
            <div className="input-group hide-form-search">
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
                  setExpandedCollection={setExpandedCollection} // Passar setExpandedCollection para ChapterSearch
                />
              </div>
            </div>
          </form>
        </ul>
      </div>
      {isOffcanvasOpen && (
        <div
          className="offcanvas-backdrop show"
          onClick={handleToggleBackDrop}
        ></div>
      )}
    </nav>
  );
};
