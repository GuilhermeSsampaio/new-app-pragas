import React from "react";
//convertendo o conteúdo do bloco de texto em HTML
export const RefConversorHtml = ({ data }) => {
  function convertToHTML(data) {
    let htmlContent = "";
    htmlContent += `<div class='instituicao'>`;
    data.blocks.forEach((block) => {
      switch (block.type) {
        case "header":
          const anchor = block.data.text.replace(/ /g, "_");
          htmlContent += `<h4 class="nome-instituicao" id='${anchor}'>${block.data.text}</h4>`;
          break;
        case "paragraph":
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
          break;
        case "LinkTool":
          htmlContent += `<a id='links-sites' href="${block.data.link}" target="_blank" title="Acessar site" class="paragrafo">${block.data.link}</a>`;
          break;
        default:
          break;
      }
    });
    htmlContent += `</div>`;
    return htmlContent;
  }

  return (
    <div
      className="reference-content"
      dangerouslySetInnerHTML={{ __html: convertToHTML(data) }}
    />
  );
};

export default RefConversorHtml;
