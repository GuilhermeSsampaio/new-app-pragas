import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export const SidebarCapitulos = ({
  isOffcanvasOpen,
  setIsOffcanvasOpen,
  onSelectCollection,
  collections,
  activeTitle, // Receber activeTitle
  setActiveTitle, // Receber setActiveTitle
  isChapterActive, // Receber isChapterActive
  setIsChapterActive, // Receber setIsChapterActive
  scrollToTop,
  expandedCollection,
  setExpandedCollection, // Adicionar setExpandedCollection
}) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  // const [expandedCollection, setExpandedCollection] = useState(null);
  var LogoIFEmbrapa = require("../../public/logo-if-embrapa.png");
  var LogoBasf = require("../../public/BASF-Logo.png");

  const isLoading = !collections || collections.length === 0;

  const sortedCollections = useMemo(() => {
    if (isLoading) return [];
    return collections.map((collection) => ({
      ...collection,
      data: {
        ...collection.data,
        data: collection.data.data.sort((a, b) => a.id - b.id),
      },
    }));
  }, [collections, isLoading]);

  const handleSummaryToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChapterClick = useCallback(
    (collectionId, chapterId) => {
      onSelectCollection(collectionId, chapterId);
      setActiveTitle(chapterId); // Gerenciar capítulo aberto
      setIsChapterActive({ [chapterId]: true }); // Ativar apenas o capítulo clicado
      router.push(
        `#collection_${collectionId}#capitulo_${chapterId}`,
        undefined,
        { shallow: true },
      );
      scrollToTop();
      setIsOffcanvasOpen(false);
    },
    [
      onSelectCollection,
      router,
      setIsOffcanvasOpen,
      setActiveTitle,
      setIsChapterActive,
    ],
  );

  const handleIntroductionClick = () => {
    setActiveTitle("intro");
    setIsChapterActive({}); // Resetar ativações ao clicar na introdução
    setExpandedCollection(null);
    router.push("#boas-praticas", undefined, { shallow: true });
    setIsOffcanvasOpen(false);
  };

  const handleToggle = useCallback(
    (collectionId) => {
      if (expandedCollection === collectionId) {
        setExpandedCollection(null);
      } else {
        setExpandedCollection(collectionId);
        setActiveTitle(null);
        setIsChapterActive({}); // Resetar ativações ao abrir uma nova coleção
      }
    },
    [expandedCollection, setActiveTitle, setIsChapterActive],
  );

  return (
    <div>
      <nav
        id="sidebarMenu"
        className={`collapse d-lg-block sidebar bg-white thin-scrollbar ${
          isOffcanvasOpen ? "show" : ""
        }`}
        tabIndex="-1"
      >
        <div className="position-sticky">
          <div></div>
          <div
            id="summary"
            className="list-group list-group-flush mt-2 py-2 menu_SIkG"
            style={{ display: showSummary ? "block" : "none" }}
          >
            <div className="logo-container-fixed">
              <div className="logo-container d-flex align-items-center justify-content-between">
                <Link href="/home">
                  <Image
                    src={LogoBasf}
                    width={100}
                    height={35}
                    alt="logo Basf"
                    className="img-sidebar-top mx-4"
                  />
                </Link>
                <button
                  id="btn-close-sidebar"
                  type="button"
                  className="btn-close btn-close-dark btn-close-cap"
                  aria-label="Close"
                  onClick={() => {
                    setIsOffcanvasOpen(false);
                    setShowSummary(true);
                  }}
                ></button>
              </div>
            </div>
            <hr className="featurette-divider line-menu"></hr>
            <button
              type="button"
              className="clean-btn navbar-sidebar__back"
              id="back-button"
              onClick={() => setShowSummary(false)}
            >
              ← Voltar para o menu principal
            </button>
            <div>
              <a
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                  isCollapsed ? "collapsed" : ""
                }`}
                aria-current="true"
                onClick={handleSummaryToggle}
                style={{ cursor: "pointer", backgroundColor: "#d9e4ea" }}
              >
                <span className="w-100 text-primary">Sumário</span>{" "}
                <i
                  className={`fas fa-chevron-${isCollapsed ? "right" : "down"} icon-deg`}
                ></i>
              </a>
              {!isCollapsed && (
                <>
                  <p
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center introduction-button-p ${
                      activeTitle === "intro" ? "active-dark" : ""
                    }`}
                    onClick={handleIntroductionClick}
                    style={{
                      cursor: "pointer",
                      marginBottom: "8px",
                      backgroundColor:
                        activeTitle === "intro" ? "#eeeeee" : "transparent",
                    }}
                  >
                    Introdução
                  </p>
                  {isLoading ? (
                    <div
                      className="spinner-container"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : (
                    sortedCollections.map(
                      (collection) =>
                        collection.data.data.length > 0 && (
                          <div key={collection.id} className="mt-1">
                            <p
                              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                                expandedCollection === collection.id
                                  ? "active-dark"
                                  : ""
                              }`}
                              onClick={() => handleToggle(collection.id)}
                              style={{
                                cursor: "pointer",
                                marginBottom: "5px",
                                backgroundColor:
                                  expandedCollection === collection.id
                                    ? "#eeeeee"
                                    : "transparent",
                              }}
                            >
                              <span
                                className="w-100 text-secondary-emphasis"
                                style={{ fontWeight: "500" }}
                              >
                                {collection.title}
                              </span>{" "}
                              <i
                                className={`fas fa-chevron-${
                                  expandedCollection === collection.id
                                    ? "down"
                                    : "right"
                                } ${
                                  expandedCollection === collection.id
                                    ? "icon-deg-active"
                                    : "icon-deg-right"
                                }`}
                                style={{
                                  color:
                                    expandedCollection === collection.id
                                      ? "#4f4f4f"
                                      : "inherit",
                                }}
                              ></i>
                            </p>
                            {expandedCollection === collection.id && (
                              <ul className="list-group list-group-flush mx-1">
                                {collection.data.data.map((item) => (
                                  <li
                                    key={item.id}
                                    className={`list-group-item py-2 ${
                                      isChapterActive[item.id]
                                        ? "active-dark"
                                        : ""
                                    } ${
                                      item.attributes.subnivel &&
                                      item.attributes.subnivel.length > 0
                                        ? "chapter-with-subchapters"
                                        : ""
                                    }`}
                                    style={{
                                      cursor: "pointer",
                                      marginBottom: "8px",
                                      fontSize: "15px",
                                      backgroundColor: isChapterActive[item.id]
                                        ? "#eeeeee"
                                        : "transparent",
                                    }}
                                  >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <a
                                        href={`#collection_${collection.id}#capitulo_${item.id}`}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleChapterClick(
                                            collection.id,
                                            item.id,
                                          );
                                        }}
                                        className="d-flex align-items-center"
                                        style={{
                                          textDecoration: "none",
                                          color: "inherit",
                                          width: "100%",
                                        }}
                                      >
                                        {item.attributes.titulo}
                                      </a>
                                    </div>
                                  </li>
                                ))}
                                {collection.data.data.length === 0 && (
                                  <p>Carregando...</p>
                                )}
                              </ul>
                            )}
                          </div>
                        ),
                    )
                  )}
                </>
              )}
            </div>
          </div>
          <div
            id="main-navbar-options-menu"
            style={{ marginTop: 16, display: showSummary ? "none" : "block" }}
          >
            <div className="logo-container d-flex align-items-center justify-content-between">
              <Link href="/home">
                <Image
                  className="img-sidebar-top mx-3"
                  src={LogoIFEmbrapa}
                  alt="logo Embrapa com letras em azul com um símbolo verde, sendo que as letras em cima do símbolo são brancas"
                  width="45%"
                  height={46}
                  priority
                />
              </Link>
              <button
                id="btn-close-sidebar"
                type="button"
                className="btn-close btn-close-dark btn-close-cap"
                aria-label="Close"
                onClick={() => {
                  setIsOffcanvasOpen(false);
                  setShowSummary(true);
                }}
              ></button>
            </div>
            <hr className="featurette-divider line-menu"></hr>
            <button
              type="button"
              className="clean-btn navbar-sidebar__back"
              id="back-button"
              onClick={() => setShowSummary(true)}
            >
              ← Voltar para o Sumário
            </button>
            <ul className="navbar-nav ms-auto d-flex itens-menu-cap">
              <li className="nav-item mx-3">
                <Link
                  className="nav-link back-item-link py-2"
                  href="/edicao-completa"
                  aria-current="page"
                  onClick={() => setIsOffcanvasOpen(false)}
                >
                  <span className="link-text">Edição Completa</span>
                </Link>
              </li>
              <li className="nav-item mx-3">
                <Link
                  className="nav-link back-item-link py-2"
                  href="/autores"
                  aria-current="page"
                  onClick={() => setIsOffcanvasOpen(false)}
                >
                  <span className="link-text">Autores</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {isOffcanvasOpen && (
        <div
          className="offcanvas-backdrop show"
          onClick={() => setIsOffcanvasOpen(false)}
        ></div>
      )}
    </div>
  );
};
