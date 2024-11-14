import { useState, useEffect } from "react";
import SubChapterToc from "./SubChapterToc";
import { useRouter } from "next/router";
import { ConversorHtml } from "./ConversorHtml";
import { RefConversorHtml } from "./RefConversorHtml";
import TableOfContents from "./TableOfContents"; // Importar o componente

export const TextCapitulos = ({
  lista,
  activeTitle,
  setActiveTitle,
  currentCollection,
  isChapterActive,
  setIsChapterActive,
  scrollToTop,
}) => {
  const [headerBlocks, setHeaderBlocks] = useState([]);
  const [activeSubChapter, setActiveSubChapter] = useState(null);
  const [subchaptersList, setSubchaptersList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const extractedHeaderBlocks = lista.flatMap((cap) => {
      const blocks = JSON.parse(cap.attributes.descricao).blocks;
      return blocks.filter((block) => block.type === "header");
    });
    setHeaderBlocks(extractedHeaderBlocks);
  }, [lista]);

  useEffect(() => {
    // Update the list of subchapters based on the active chapter
    const activeChapter = lista.find((cap) => cap.id === activeTitle);
    if (activeChapter) {
      setSubchaptersList(activeChapter.attributes.subnivel || []);
    }
  }, [activeTitle, lista]);

  useEffect(() => {
    const chapterMatch = router.asPath.match(/#capitulo_(\d+)/);
    const subChapterMatch = router.asPath.match(/#subcapitulo_(\d+)/);

    if (chapterMatch) {
      const chapterId = parseInt(chapterMatch[1]);
      if (chapterId !== activeTitle) {
        setActiveTitle(chapterId);
        setActiveSubChapter(null);
      }
    } else if (subChapterMatch) {
      const subChapterId = parseInt(subChapterMatch[1]);
      const parentChapter = lista.find((cap) =>
        cap.attributes.subnivel.some((sub) => sub.id === subChapterId),
      );
      if (parentChapter) {
        setActiveTitle(parentChapter.id);
        setActiveSubChapter(subChapterId);
      }
    }
  }, [router.asPath, activeTitle, lista, setActiveTitle]);

  const handleNavigation = (chapterId) => {
    setActiveTitle(chapterId);
    setActiveSubChapter(null);
    setIsChapterActive({ [chapterId]: true }); // Atualizar o capítulo ativo no Sidebar

    // Atualizar a URL mantendo a referência da coleção atual
    if (currentCollection) {
      router.push(
        `/edicao-completa#collection_${currentCollection}#capitulo_${chapterId}`,
        undefined,
        { shallow: true },
      );
    }

    scrollToTop(); // Chamar scrollToTop ao trocar de capítulo
  };

  const handleSubChapterNavigation = (subChapterId) => {
    setActiveSubChapter(subChapterId);
    router.push(
      `/collection/${currentCollection}#subcapitulo_${subChapterId}`,
      undefined,
      { shallow: true },
    );

    // Garantir que o subcapítulo seja rolado para a visibilidade
    setTimeout(() => {
      const subChapterElement = document.getElementById(subChapterId);
      if (subChapterElement) {
        subChapterElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); // Ajuste o tempo conforme necessário
  };

  const handleSubChapterClick = (anchor) => {
    const subChapterElement = document.getElementById(anchor);
    if (subChapterElement) {
      const yOffset = -100; // Ajuste este valor conforme necessário
      const y =
        subChapterElement.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const currentIndex = lista.findIndex((cap) => cap.id === activeTitle);
  const prevChapter = lista[currentIndex - 1];
  const nextChapter = lista[currentIndex + 1];

  return (
    <>
      <div className="text-with-toc">
        <div className="text-content">
          <article className="article">
            {lista.map((cap) => (
              <div key={cap.id} className="bd-content ps-lg-2">
                {activeTitle === cap.id && (
                  <>
                    <h1 id={`capitulo_${cap.id}`}>{cap.attributes.titulo}</h1>
                    <div className="center-textArticle">
                      {cap.attributes.subtitle}
                    </div>
                    <ConversorHtml
                      data={JSON.parse(cap.attributes.descricao)}
                    />
                    {cap.attributes.subnivel &&
                      cap.attributes.subnivel.length > 0 && (
                        <div className="subchapter-section">
                          {cap.attributes.subnivel.map((subcap) => (
                            <div key={subcap.id} className="subchapter">
                              <h4 id={`subcapitulo_${subcap.id}`}>
                                {subcap.titulo_subcap}
                              </h4>
                              <ConversorHtml
                                data={JSON.parse(subcap.texto_subcap)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    {cap.attributes.referencias &&
                      cap.attributes.referencias.length > 0 &&
                      cap.attributes.referencias[0].descricao != null && (
                        <div className="references-section">
                          <h3>Instituição</h3>
                          {cap.attributes.referencias.map((ref, index) => (
                            <div key={index} className="reference">
                              {ref.descricao && (
                                <RefConversorHtml
                                  data={JSON.parse(ref.descricao)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </>
                )}
              </div>
            ))}
          </article>
        </div>
        <div className="table-of-contents">
          <SubChapterToc
            headerBlocks={subchaptersList}
            onSubChapterClick={handleSubChapterClick}
          />
          {/* <TableOfContents /> Remover a prop tocItems */}
        </div>
      </div>
      <nav
        className="pagination-nav docusaurus-mt-lg"
        aria-label="Páginas de documentação"
        style={{ zIndex: 99999 }}
      >
        {currentCollection !== "intro" && (
          <>
            {prevChapter && (
              <button
                className="pagination-nav__link pagination-nav__link--prev"
                onClick={() => handleNavigation(prevChapter.id)}
              >
                <div className="pagination-nav__sublabel">Anterior</div>
                <div className="pagination-nav__label">
                  {prevChapter.attributes.titulo}
                </div>
              </button>
            )}
            {nextChapter && (
              <button
                className="pagination-nav__link pagination-nav__link--next"
                onClick={() => handleNavigation(nextChapter.id)}
              >
                <div className="pagination-nav__sublabel">Próxima</div>
                <div className="pagination-nav__label">
                  {nextChapter.attributes.titulo}
                </div>
              </button>
            )}
          </>
        )}
      </nav>
    </>
  );
};
