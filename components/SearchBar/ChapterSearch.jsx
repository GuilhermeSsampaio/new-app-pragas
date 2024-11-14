import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const ChapterSearch = ({
  collections,
  onSelectCollection,
  closeSidebar,
  activeTitle, // Receber activeTitle
  setActiveTitle, // Receber setActiveTitle
  setIsChapterActive, // Receber setIsChapterActive
  scrollToTop,
  setExpandedCollection, // Receber setExpandedCollection
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const resultsListRef = useRef(null);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
  }, []);

  // Função para buscar capítulos filtrados
  const filteredChapters = useCallback(() => {
    if (!searchQuery) return [];
    return collections.flatMap((collection) =>
      collection.data.data
        .filter((chapter) =>
          chapter.attributes.titulo
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
        .map((chapter) => ({
          collectionId: collection.id,
          chapterId: chapter.id,
          title: chapter.attributes.titulo,
          collectionTitle: collection.title,
        })),
    );
  }, [collections, searchQuery]);

  // Lógica para definir a pausa após o término da digitação
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 300); // tempo de pausa em milissegundos

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleChapterClick = useCallback(
    (collectionId, chapterId) => {
      setExpandedCollection(collectionId);
      setIsChapterActive({ [chapterId]: true });
      setActiveTitle(chapterId);
      onSelectCollection(collectionId, chapterId, true);

      Promise.resolve().then(() => {
        router
          .push(
            `/edicao-completa#collection_${collectionId}#capitulo_${chapterId}`,
            undefined,
            { shallow: true },
          )
          .then(() => {
            scrollToTop();
            closeSidebar();
            setSearchQuery("");
          });
      });
    },
    [
      onSelectCollection,
      router,
      closeSidebar,
      setActiveTitle,
      setIsChapterActive,
      setExpandedCollection,
      scrollToTop,
    ],
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        resultsListRef.current &&
        !resultsListRef.current.contains(event.target)
      ) {
        setSearchQuery(""); // Limpa a busca ao clicar fora
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const results = filteredChapters();

  return (
    <div className="input-wrapper">
      <i id="search-icon" className="fas fa-search"></i>
      <input
        className="navbar-input"
        type="text"
        placeholder="Pesquisar capítulos..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {searchQuery && (
        <div className="results-list thin-scrollbar" ref={resultsListRef}>
          {results.length > 0
            ? results.map((item) => (
                <li
                  key={`${item.collectionId}-${item.chapterId}`}
                  className="result-link"
                  onClick={() =>
                    handleChapterClick(item.collectionId, item.chapterId)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="search-result">
                    <small>{item.collectionTitle}</small>
                    <br />
                    {item.title}
                  </div>
                </li>
              ))
            : !isSearching && (
                <p className="no-results">Nenhum resultado encontrado</p>
              )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ChapterSearch);
