/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import Head from "next/head";
import useFetchAutores from "../../hooks/useFetchAutores";

export const Autores = () => {
  const { data } = useFetchAutores();

  useEffect(() => {
    document.title = "Embrapa Autores";
  }, []);

  return (
    <>
      <Head>
        <title>Autores</title>
      </Head>

      {/* Conteúdos dos Autores */}
      <div className="showcaseSection">
        <div className="headerTitle">
          <h1>Autores</h1>
        </div>
        {/* Código dos Card dos Autores */}
        <div className="main-container-cards container-cards">
          {/* Puxando os Dados do Fetch */}
          {data.length > 0 ? (
            data.map((item) => {
              // Parse da string de descrição para objeto JSON
              const descriptionData = JSON.parse(item.attributes.description);

              return (
                <div key={item.id} className="card">
                  <div className="containerAutor_v1t1">
                    {/* Imagem dos Autores */}
                    <div className="containerFoto_oz_I">
                      <img
                        src={`${descriptionData.blocks[0].data.file.url}`}
                        alt="Foto dos Autores"
                        width="100%"
                      />
                    </div>
                    {/* Nome dos Autores */}
                    <p className="bold nome-autor">{item.attributes.name}</p>
                    {/* Função dos Autores */}
                    <p className="funcao-autor">{item.attributes.funcao}</p>
                  </div>
                  {/* Descrição dos Autores */}
                  <div className="cardContainer_HEVx">
                    <p className="descricao-autor">
                      {descriptionData.blocks[1].data.text}
                    </p>
                  </div>
                  {/* Link para o Currículo dos Autores */}
                  <div className="action-card">
                    {/* Extrai a tag <a> da string JSON e renderiza como HTML */}
                    {descriptionData.blocks.map((block) => {
                      if (block.type === "paragraph") {
                        // Verifica se há uma tag <a> dentro do bloco de parágrafo
                        const match = block.data.text.match(/<a[^>]*>.*?<\/a>/);
                        if (match) {
                          return (
                            <div
                              key={block.id}
                              dangerouslySetInnerHTML={{ __html: match[0] }}
                            />
                          );
                        } else {
                          return null;
                        }
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <p>Carregando dados...</p>
          )}
        </div>
      </div>
    </>
  );
};
