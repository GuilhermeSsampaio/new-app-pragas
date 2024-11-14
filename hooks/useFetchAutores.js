import { useState, useEffect } from "react";

const useFetchAutores = () => {
  const [data, setData] = useState([]);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api-cartilha.squareweb.app";
  const CarregaAutores = async () => {
    // const url = "https://api-cartilha.squareweb.app/api/autors?populate=*";
    const url = `${baseUrl}/api/autors?populate=*`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const data = json.data;
        setData(data);
      } else {
        throw new Error(
          "Falha na requisição. Código de status: " + response.status,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    CarregaAutores();
  }, []);

  return { data };
};

export default useFetchAutores;
