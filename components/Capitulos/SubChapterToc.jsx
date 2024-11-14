import React, { useState, useEffect } from "react";

const SubChapterToc = ({ headerBlocks: collections, onSubChapterClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tocItems, setTocItems] = useState([]);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsExpanded(false); // Fecha o menu após clicar
  };

  useEffect(() => {
    const headings = document.querySelectorAll("h2, h3, h4");
    const items = [];

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substr(1));
      const titleText = heading.textContent;
      const anchor = titleText.replace(/ /g, "_");

      items.push({
        level: level,
        title: titleText,
        anchor: anchor,
      });

      heading.innerHTML = `<a id="${anchor}" href="#${anchor}">${heading.innerHTML}</a>`;
    });

    setTocItems(items);
  }, [collections]);

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="floating-toc-button"
        onClick={toggleContent}
        aria-expanded={isExpanded}
      >
        <i className={`fas ${isExpanded ? "fa-times" : "fa-bars"}`} />
      </button>

      {/* Menu flutuante */}
      {isExpanded && (
        <div className="floating-toc-menu">
          <nav className="bd-toc">
            <ul className="list-unstyled">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToTop();
                  }}
                >
                  <i className="fas fa-arrow-up"></i> Voltar ao topo
                </a>
              </li>
              {tocItems.map((item, index) => (
                <li key={index} className={`h${item.level}-toc-item`}>
                  <a
                    href={`#${item.anchor}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSubChapterClick(item.anchor);
                      setIsExpanded(false); // Fecha o menu após clicar
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default SubChapterToc;
