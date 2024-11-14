import { useRouter } from "next/router";
import { Navbar } from "./Navbar";
import { NavbarCapitulos } from "../Capitulos/NavbarCapitulos";
import { Footer } from "./Footer";
import { FooterCapitulos } from "../Capitulos/FooterCapitulos";
import { useEffect, useState, createContext } from "react";
import useFetchCapitulos from "../../hooks/useFetchCapitulos";
import { SidebarCapitulos } from "../Capitulos/SidebarCapitulos";
import useFetchCollections from "@/hooks/useFetchCollections";

// Criar contexto para compartilhar o estado do título
export const BreadcrumbContext = createContext();

// Componente que renderiza o layout da aplicação
export const Layout = ({ children }) => {
  const router = useRouter();
  const isEdicaoCompleta = router.pathname === "/edicao-completa";
  const { asPath } = router;
  const [results, setResults] = useState([]);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const { collections, activeCollection, setActiveCollection } =
    useFetchCollections();
  const [activeTitle, setActiveTitle] = useState(null);
  const [isChapterActive, setIsChapterActive] = useState(false);
  const scrollToTop = () => window.scrollTo(0, 0);
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [breadcrumbTitle, setBreadcrumbTitle] = useState("");

  //Função para quando o usuário quiser fechar o sidebar
  const closeSidebar = () => {
    const sidebarMenu = document.getElementById("sidebarMenu");
    if (sidebarMenu) {
      sidebarMenu.classList.remove("show");
    }
    setIsOffcanvasOpen(false);
  };

  //faz aparecer o backdrop
  const handleToggleBackDrop = () => {
    //setIsOffcanvasOpen((prevState) => !prevState);
  };

  const handleCloseBackdrop = () => {
    setIsOffcanvasOpen(false);
    closeSidebar();
  };

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
      setExpandedCollection(collectionId);
      setCurrentCollection(collectionsMap[collectionId]);
      setActiveCollection(collectionId);
      setActiveTitle(chapterId);
      setIsChapterActive({ [chapterId]: true });

      if (!router.pathname.includes("edicao-completa")) {
        setTimeout(() => {
          router.push(
            `/edicao-completa#collection_${collectionId}#capitulo_${chapterId}`,
          );
        }, 0);
      }
    }
  };

  const handleSelectCollectionWrapper = (
    collectionId,
    chapterId,
    isFromSearch,
  ) => {
    handleSelectCollection(collectionId, chapterId, isFromSearch);
    const collection = collections.find((col) => col.id === collectionId);
    if (collection) {
      setCurrentCollection(collection.title);
      setBreadcrumbTitle(collection.title);
    }
  };

  useEffect(() => {
    const extractIds = (path) => {
      const collectionMatch = path.match(/#collection_(\d+)/);
      const chapterMatch = path.match(/#capitulo_(\d+)/);
      return {
        collectionId: collectionMatch ? parseInt(collectionMatch[1]) : null,
        chapterId: chapterMatch ? parseInt(chapterMatch[1]) : null,
      };
    };

    const { collectionId, chapterId } = extractIds(asPath);

    if (collectionId && chapterId) {
      handleSelectCollectionWrapper(collectionId, chapterId, true);
      setExpandedCollection(collectionId);
      setIsChapterActive({ [chapterId]: true });
      setActiveTitle(chapterId);
    }
  }, [asPath]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbTitle, setBreadcrumbTitle }}>
      {isEdicaoCompleta ? (
        <>
          <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <div className="flex-grow-1">{children}</div>
            <FooterCapitulos />
          </div>
        </>
      ) : (
        <>
          <Navbar
            collections={collections}
            handleSelectCollection={handleSelectCollectionWrapper}
            isOffcanvasOpen={isOffcanvasOpen}
            setIsOffcanvasOpen={setIsOffcanvasOpen}
            activeTitle={activeTitle}
            setActiveTitle={setActiveTitle}
            isChapterActive={isChapterActive}
            setIsChapterActive={setIsChapterActive}
            scrollToTop={scrollToTop}
            setExpandedCollection={setExpandedCollection} // Assegurar que está sendo passado
            setCurrentCollection={setCurrentCollection}
          />
          <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <div className="flex-grow-1">{children}</div>
            <Footer />
          </div>
        </>
      )}
    </BreadcrumbContext.Provider>
  );
};
