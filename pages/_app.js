// Importação dos CSS
import "../styles/globals.css";
import "../styles/custom.css";
import "../styles/capitulos.css";

// Impotação do Framework Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-ui-kit/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Layout } from "@/components/Layout/Layout";

//importando matomo
import { init } from "@socialgouv/matomo-next";
import dotenv from "dotenv";

dotenv.config();
const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

if (typeof window !== "undefined") {
  init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
}

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
