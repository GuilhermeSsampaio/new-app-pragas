import React, { useEffect, useState, useRef, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../../public/BASF-Logo.png";
import { TextCapitulos } from "./TextCapitulos";
import BreadcrumbsItem from "./BreadCrumbsItem.jsx";
import useFetchCollections from "@/hooks/useFetchCollections";
import { SidebarCapitulos } from "./SidebarCapitulos";
import { FooterCapitulos } from "./FooterCapitulos";
import { NavbarCapitulos } from "./NavbarCapitulos";
import Intro from "./Intro";
import { Breadcrumbs } from "./BreadCrumbs";
import { BreadcrumbContext } from "../Layout/Layout";

export const Capitulos = () => {
  const LogoIF = require("../../public/ifms-dr-marca-2015.png");
  const LogoEmbrapa = require("../../public/logo-embrapa-400.png");
  const router = useRouter();
  const { asPath } = router;
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [data, setData] = useState([]);
  const [activeTitle, setActiveTitle] = useState(null);
  const [isChapterActive, setIsChapterActive] = useState({}); // Nova flag de estado
  const [currentCollection, setCurrentCollection] = useState(null);
  const [isChapterLoading, setIsChapterLoading] = useState(false);
  const [collectionsData, setCollectionsData] = useState({});
  const { collections, activeCollection, setActiveCollection } =
    useFetchCollections();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api-cartilha.squareweb.app";
  const handleToggleBackDrop = () => {
    setIsOffcanvasOpen((prevState) => !prevState);
  };

  const fetchCapitulosRef = useRef(null);
  const [expandedCollection, setExpandedCollection] = useState(null); // Adicionar estado para coleção expandida
  const { setBreadcrumbTitle } = useContext(BreadcrumbContext);

  useEffect(() => {
    return () => {
      if (fetchCapitulosRef.current) {
        fetchCapitulosRef.current.abort();
      }
    };
  }, []);

  const extractCollectionAndChapterFromAnchor = (path) => {
    const collectionMatch = path.match(/#collection_(\d+)/);
    const chapterMatch = path.match(/#capitulo_(\d+)/);
    const collectionId = collectionMatch ? parseInt(collectionMatch[1]) : null;
    const chapterId = chapterMatch ? parseInt(chapterMatch[1]) : null;
    const isIntroduction =
      path.includes("#introduction") || path.includes("#boas-praticas");
    return { collectionId, chapterId, isIntroduction };
  };

  useEffect(() => {
    const { collectionId, chapterId, isIntroduction } =
      extractCollectionAndChapterFromAnchor(asPath);

    if (isIntroduction) {
      setCurrentCollection("intro");
      setActiveTitle("intro");
      setActiveCollection(null);
      setBreadcrumbTitle("Introdução");
    } else if (collectionId && chapterId) {
      handleSelectCollection(collectionId, chapterId);
      setActiveCollection(collectionId);
      setExpandedCollection(collectionId); // Adicionar esta linha para garantir
      setIsChapterActive({ [chapterId]: true }); // Adicionar esta linha para garantir
    } else if (!collectionId && !chapterId && currentCollection !== "intro") {
      setCurrentCollection("intro");
      setActiveTitle("intro");
      setActiveCollection(null);
      setBreadcrumbTitle("Introdução");
    }
  }, [asPath]);

  const collectionsMap = {
    1: "pesticida-abelhas",
    2: "boa-pratica-agroes",
    3: "boa-pratica-apicolas",
    4: "boa-pratica-comunicacaos",
  };

  const handleSelectCollection = (
    collectionId,
    chapterId = null,
    isFromSearch = false,
  ) => {
    if (chapterId !== null || isFromSearch) {
      setCurrentCollection(collectionsMap[collectionId]);
      setActiveTitle(chapterId);
      setActiveCollection(collectionId);
      setIsChapterActive({ [chapterId]: true }); // Ativar apenas o capítulo clicado
      const collection = collections.find((col) => col.id === collectionId);
      if (collection) {
        setBreadcrumbTitle(collection.title);
      }
    }
  };

  useEffect(() => {
    const loadCapitulos = async () => {
      if (!currentCollection || activeTitle === null) return;

      if (collectionsData[currentCollection]) {
        setData(collectionsData[currentCollection]);
        return;
      }

      setIsChapterLoading(true);
      fetchCapitulosRef.current = new AbortController();

      const url = `${baseUrl}/api/${currentCollection}?populate=*`;

      try {
        const response = await fetch(url, {
          signal: fetchCapitulosRef.current.signal,
        });
        if (response.ok) {
          const json = await response.json();
          const data = json.data;
          setData(data);

          setCollectionsData((prevData) => ({
            ...prevData,
            [currentCollection]: data,
          }));
        } else {
          throw new Error(
            "Falha na requisição. Código de status: " + response.status,
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setIsChapterLoading(false);
      }
    };

    loadCapitulos();
  }, [collectionsData, currentCollection, activeTitle]);

  useEffect(() => {
    if (
      currentCollection !== "intro" &&
      data.length > 0 &&
      activeTitle === null
    ) {
      setActiveTitle(data[0].id);
      // setIsChapterActive(true);
    }
  }, [data, activeTitle, currentCollection]);

  // useEffect(() => {
  //   if (isChapterActive !== null) {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [isChapterActive]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!currentCollection && collections.length > 0) {
      setCurrentCollection("intro");
      setActiveTitle(null);
      setActiveCollection(null);
    }
  }, [collections, currentCollection]);

  const activeChapter = data.find((item) => item.id === activeTitle);

  const currentCollectionTitle =
    activeTitle === "intro"
      ? null
      : collections.find((col) => col.id === activeCollection)?.title;

  const displayedTitle =
    activeTitle === "intro"
      ? "Introdução"
      : activeChapter
        ? activeChapter.attributes.titulo
        : "Título do Capítulo";

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
        <title>Boas Práticas</title>
      </Head>

      <div className="container-wrapper">
        <SidebarCapitulos
          isOffcanvasOpen={isOffcanvasOpen}
          setIsOffcanvasOpen={setIsOffcanvasOpen}
          onSelectCollection={handleSelectCollection}
          activeCollection={activeCollection}
          collections={collections}
          activeTitle={activeTitle}
          setActiveTitle={setActiveTitle}
          isChapterActive={isChapterActive} // Passar nova flag
          setIsChapterActive={setIsChapterActive} // Passar função para atualizar a flag
          scrollToTop={scrollToTop} // Passar scrollToTop para SidebarCapitulos
          expandedCollection={expandedCollection} // Passar coleção expandida
          setExpandedCollection={setExpandedCollection} // Passar setExpandedCollection para SidebarCapitulos
        />

        <NavbarCapitulos
          isOffcanvasOpen={isOffcanvasOpen}
          setIsOffcanvasOpen={setIsOffcanvasOpen}
          handleToggleBackDrop={handleToggleBackDrop}
          collections={collections}
          handleSelectCollection={handleSelectCollection}
          Logo={Logo}
          LogoIF={LogoIF}
          LogoEmbrapa={LogoEmbrapa}
          activeTitle={activeTitle}
          setActiveTitle={setActiveTitle}
          isChapterActive={isChapterActive} // Passar nova flag
          setIsChapterActive={setIsChapterActive} // Passar função para atualizar a flag
          scrollToTop={scrollToTop} // Passar scrollToTop para NavbarCapitulos
          setExpandedCollection={setExpandedCollection} // Passar setExpandedCollection para NavbarCapitulos
        />

        <main className="docMainContainer_gTbr">
          <div className="container-fluid padding-bottom--lg">
            <div className="col">
              <Breadcrumbs
                displayedTitle={displayedTitle}
                collectionTitle={currentCollectionTitle}
              />
              {/* Substituir o código do <nav> pelos breadcrumbs */}
              <section
                className="home-section right-sidebar"
                style={{ marginTop: "30px" }}
              >
                <div id="contents" className="bd-content ps-lg-2">
                  {isChapterLoading ? (
                    <p>Carregando...</p>
                  ) : currentCollection === "intro" ? (
                    <Intro />
                  ) : (
                    <TextCapitulos
                      lista={data}
                      activeTitle={activeTitle}
                      setActiveTitle={setActiveTitle}
                      currentCollection={activeCollection}
                      isChapterActive={isChapterActive} // Passar nova flag
                      setIsChapterActive={setIsChapterActive} // Passar função para atualizar a flag
                      scrollToTop={scrollToTop} // Passar scrollToTop para TextCapitulos
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      {/* <FooterCapitulos /> */}
    </>
  );
};

export default Capitulos;
