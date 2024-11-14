import { useState, useEffect, useRef } from "react";
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://api-cartilha.squareweb.app";

const endpoints = [
  {
    id: 1,
    title: "Pesticidas e abelhas",
    path: "/api/pesticida-abelhas?populate=*",
  },
  {
    id: 2,
    title: "Boas práticas agrícolas",
    path: "/api/boa-pratica-agroes?populate=*",
  },
  {
    id: 3,
    title: "Boas práticas apícolas",
    path: "/api/boa-pratica-apicolas?populate=*",
  },
  {
    id: 4,
    title: "Boas práticas de comunicação",
    path: "/api/boa-pratica-comunicacaos?populate=*",
  },
];

const useFetchCollections = () => {
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const fetchCollectionsRef = useRef(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        fetchCollectionsRef.current = new AbortController();

        const urls = endpoints.map((endpoint) => `${baseUrl}${endpoint.path}`);

        const responses = await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await fetch(url, {
                signal: fetchCollectionsRef.current.signal,
              });
              if (!response.ok) throw new Error("Network response was not ok");
              return response.json();
            } catch (error) {
              // Tentar buscar do cache se a requisição falhar
              if ("caches" in window) {
                const cache = await caches.match(url);
                if (cache) return cache.json();
              }
              throw error;
            }
          }),
        );

        const collectionsData = endpoints.map((endpoint, index) => ({
          id: endpoint.id,
          title: endpoint.title,
          data: responses[index],
        }));

        setCollections(collectionsData);

        if (collectionsData.length > 0 && !activeCollection) {
          setActiveCollection(collectionsData[0].id);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erro ao buscar as coleções", error);
        }
      }
    };

    fetchCollections();

    return () => {
      if (fetchCollectionsRef.current) {
        fetchCollectionsRef.current.abort();
      }
    };
  }, []);

  return { collections, activeCollection, setActiveCollection };
};

export default useFetchCollections;
