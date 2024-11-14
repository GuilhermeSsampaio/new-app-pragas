import Image from "next/image";
import Link from "next/link";
import InstallButton from "./InstallButton/InstallButton";
import InstallButtonIos from "./InstallButton/InstallButtonIos";
import { isDesktop, isAndroid, isIOS } from "react-device-detect";

export const HomePage = () => {
  //Importação das Imagens
  var LogoIF = require("../public/ifms-dr-marca-2015.png");
  var LogoEmbrapa = require("../public/logo-embrapa-400.png");
  var LogoBasf = require("../public/BASF-Logo.png");
  var LogoCartilha = require("../public/logo-cartilha.svg");
  var Manual = require("../public/image-manual.png");

  return (
    <>
      {/* Conteúdos da Página Principal */}
      <div className="px-4 py-5 text-center hero content-after-navbar">
        <div className="hero-text">
          <div className="messagem">
            <Image
              className="d-block mx-auto mb-2 logo-cartilha-mobile"
              src={LogoCartilha}
              alt="Logo da cartilha"
              width="100%"
              height="128"
            />
            <h1 className="display-5 fw-bold">
              BOAS PRÁTICAS PARA INTEGRAÇÃO HARMÔNICA ENTRE APICULTURA E
              SOJICULTURA
            </h1>
          </div>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">
              {/* 1<sup>a</sup> versão revista e atualizada */}
              Versão 1.0
            </p>
            <div className="d-grid container-botoes">
              <Link href="/edicao-completa" type="button" className="btn">
                Acessar o Manual
              </Link>

              {isDesktop && <InstallButton />}
              {isAndroid && <InstallButton />}
              {isIOS && <InstallButtonIos />}
            </div>
          </div>
        </div>
      </div>

      <div className="apresentacao">
        <div className="titulo">
          <h2>Realizadores</h2>
          <p className="mb-5">
            Este app foi desenvolvido no âmbito do contrato Embrapa/BASF
            20900.22/0253-8 (DOU 17/09/2021)
          </p>
          <div className="spacing-images-realizadores">
            <div
              className="col-12 col-md-4 d-flex justify-content-center"
              style={{ alignItems: "center" }}
            >
              <div
                className="d-flex justify-content-center"
                style={{ flexDirection: "column" }}
              >
                <Image
                  src={LogoBasf}
                  style={{
                    width: "125px",
                    height: "auto",
                    textAlign: "center",
                  }}
                  alt="logo Basf"
                />
              </div>
            </div>
            <div
              className="col-12 col-md-4 d-flex justify-content-center"
              style={{ alignItems: "center" }}
            >
              <div
                className="d-flex justify-content-center spacing-mobile-if"
                style={{ flexDirection: "column" }}
              >
                <Image
                  src={LogoIF}
                  style={{
                    width: "175px",
                    height: "auto",
                    textAlign: "center",
                  }}
                  alt="Logotipo do IFMS Campus Dourados"
                  priority
                />
              </div>
            </div>
            <div
              className="col-12 col-md-4 d-flex justify-content-center"
              style={{ alignItems: "center" }}
            >
              <div
                className="d-flex justify-content-center"
                style={{ flexDirection: "column" }}
              >
                <Image
                  src={LogoEmbrapa}
                  style={{
                    width: "135px",
                    height: "auto",
                    textAlign: "center",
                  }}
                  alt="Logotipo da Embrapa"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        <div className="margin-manual" style={{ backgroundColor: "#00264ce6" }}>
          <div className="custom-card d-flex flex-wrap rounded">
            <div className="text-section p-4 d-flex flex-column position-static">
              <strong
                className="d-inline-block mb-2"
                style={{ color: "#cfcfcf" }}
              >
                Documento
              </strong>
              <h3 className="mb-0">Apresentação</h3>
              <p className="card-text fw-light mb-auto">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry s standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <a
                href="https://www.embrapa.br/busca-de-publicacoes/-/publicacao/991685/manual-de-identificacao-de-insetos-e-outros-invertebrados-da-cultura-da-soja"
                className="btn custom-button-manual"
                target="_blank"
              >
                Leia mais
              </a>
            </div>
            <div className="image-section d-flex justify-content-center align-items-center">
              <Image
                src={Manual}
                className="img-fluid responsive-image"
                alt="Manual Image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
