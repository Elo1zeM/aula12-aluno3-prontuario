
import { useRef, useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./App.css";

export default function ProntuarioMedApp() {
  const [receita, setReceita] = useState("");
  const [nomeReceita, setNomeReceita] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const arquivoRef = useRef(null);

  async function digitalizarReceita() {
    setCarregando(true);
    setMensagem("");

    try {
      const foto = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (!foto.base64String) {
        throw new Error("Não foi possível obter a imagem.");
      }

      setReceita(
        `data:image/${foto.format || "jpeg"};base64,${foto.base64String}`
      );
      setNomeReceita("Receita capturada pela câmera");
      setMensagem("Sua receita foi digitalizada com sucesso.");
    } catch (erro) {
      console.warn("Captura cancelada ou indisponível:", erro);
      setMensagem("A captura foi cancelada ou não pôde ser concluída.");
    } finally {
      setCarregando(false);
    }
  }

  function importarReceita(evento) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setMensagem("Selecione um arquivo de imagem.");
      evento.target.value = "";
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setReceita(leitor.result);
      setNomeReceita(arquivo.name);
      setMensagem("Imagem importada com sucesso.");
    };

    leitor.onerror = () => {
      setMensagem("Não foi possível abrir essa imagem.");
    };

    leitor.readAsDataURL(arquivo);
    evento.target.value = "";
  }

  async function copiarBase64() {
    if (!receita) return;

    try {
      await navigator.clipboard.writeText(receita);
      setMensagem("Dados Base64 copiados para a área de transferência.");
    } catch {
      setMensagem("Não foi possível copiar automaticamente neste navegador.");
    }
  }

  function removerReceita() {
    setReceita("");
    setNomeReceita("");
    setMensagem("");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="ProntuárioMed, início">
          <span className="brand-symbol">p.</span>
          <span>prontuário<span className="brand-light">med</span></span>
        </a>

        <span className="topbar-note">SEU CUIDADO, BEM GUARDADO</span>

        <a className="topbar-link" href="#digitalizar">
          Começar <span>↗</span>
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            PRONTUÁRIO MÉDICO DIGITAL · ALUNO 03
          </span>

          <h1>
            Cuidar da saúde
            <br />
            começa com <em>organização.</em>
          </h1>

          <p className="hero-description">
            Um espaço simples e cuidadoso para digitalizar suas receitas
            médicas e preparar seus registros em formato digital.
          </p>

          <a className="primary-button hero-button" href="#digitalizar">
            Digitalizar uma receita <span>↗</span>
          </a>

          <div className="hero-footnote">
            <span className="mini-check">✓</span>
            Captura em Base64 · Qualidade 85%
          </div>
        </div>

        <div className="hero-art" aria-label="Ilustração de uma receita médica">
          <div className="art-stamp">SAÚDE<br />COM CUIDADO</div>
          <div className="paper-sheet">
            <div className="paper-topline">
              <span className="paper-cross">✳</span>
              <span>REGISTRO DE SAÚDE</span>
            </div>
            <div className="paper-rule" />
            <span className="paper-kicker">DOCUMENTO DIGITAL</span>
            <h2>Receita<br /><em>médica</em></h2>
            <div className="paper-lines">
              <span />
              <span />
              <span className="short-line" />
            </div>
            <div className="paper-seal">p.</div>
            <div className="paper-bottom">
              <span>PRONTUÁRIOMED</span>
              <span>01 / 01</span>
            </div>
          </div>
          <div className="art-caption">CUIDADO EM CADA DETALHE — 01</div>
        </div>
      </section>

      <section className="intro-strip">
        <span>01 — SEU DOCUMENTO</span>
        <p>Do papel para o digital, com simplicidade.</p>
        <span className="strip-mark">✳</span>
      </section>

      <section className="workspace" id="digitalizar">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SEU ESPAÇO DE REGISTRO</span>
            <h2>Vamos guardar sua <em>receita?</em></h2>
          </div>
          <span className="section-number">01 / 02</span>
        </div>

        <div className="workspace-grid">
          <article className="upload-card">
            <div className="card-index">ETAPA 01 <span>CAPTURA</span></div>

            <div className="upload-icon">
              <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="8" y="14" width="32" height="25" rx="4" />
                <path d="M17 14l3-5h8l3 5" />
                <circle cx="24" cy="26" r="7" />
                <path d="M24 22v8M20 26h8" />
              </svg>
            </div>

            <h3>Uma receita de cada vez.</h3>
            <p className="card-description">
              Fotografe sua receita usando a câmera do dispositivo ou escolha
              uma imagem que já esteja salva.
            </p>

            <button
              className="primary-button full-button"
              onClick={digitalizarReceita}
              disabled={carregando}
            >
              <span>{carregando ? "Abrindo câmera..." : "Abrir câmera"}</span>
              <span>↗</span>
            </button>

            <button
              className="secondary-button full-button"
              onClick={() => arquivoRef.current?.click()}
            >
              Importar uma imagem <span>＋</span>
            </button>

            <input
              ref={arquivoRef}
              className="visually-hidden"
              type="file"
              accept="image/*"
              onChange={importarReceita}
            />

            <div className="privacy-note">
              <span>✳</span>
              <p>Use imagens de teste. Evite dados médicos pessoais ao demonstrar o projeto.</p>
            </div>
          </article>

          <article className="preview-card">
            <div className="card-index">ETAPA 02 <span>PRÉVIA DO DOCUMENTO</span></div>

            {receita ? (
              <>
                <div className="receipt-preview">
                  <img src={receita} alt="Prévia da receita digitalizada" />
                </div>
                <div className="file-details">
                  <span className="file-icon">↗</span>
                  <div className="file-name">
                    <strong>{nomeReceita}</strong>
                    <span>Imagem pronta para conversão em Base64</span>
                  </div>
                  <span className="file-status">● PRONTA</span>
                </div>
                <div className="preview-actions">
                  <button className="primary-button" onClick={copiarBase64}>
                    Copiar Base64 <span>↗</span>
                  </button>
                  <button className="text-button" onClick={removerReceita}>
                    Remover imagem
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-preview">
                <div className="empty-document">
                  <span className="empty-plus">＋</span>
                  <div className="empty-line" />
                  <div className="empty-line" />
                  <div className="empty-line short" />
                  <span className="empty-flower">✳</span>
                </div>
                <h3>Sua receita aparecerá aqui.</h3>
                <p>Quando você capturar ou importar uma imagem, poderá visualizar o documento nesta área.</p>
                <span className="empty-caption">AGUARDANDO DOCUMENTO</span>
              </div>
            )}
          </article>
        </div>

        {mensagem && (
          <div className="status-message" role="status">
            <span>✳</span> {mensagem}
          </div>
        )}

        <article className="data-card">
          <div className="data-card-heading">
            <div>
              <span className="eyebrow">BASTIDORES DO PROJETO</span>
              <h3>O documento em <em>Base64.</em></h3>
            </div>
            <span className="code-badge">DATA URL</span>
          </div>

          <p className="data-description">
            A imagem é representada por uma sequência de texto que pode ser
            preparada para compor uma requisição HTTP.
          </p>

          <div className="code-preview">
            <span className="code-dot">●</span>
            <code>
              {receita
                ? `${receita.slice(0, 160)}${receita.length > 160 ? "..." : ""}`
                : "data:image/jpeg;base64,..."}
            </code>
          </div>

          <div className="data-footer">
            <span><span className="mini-check">✓</span> {receita ? "Imagem convertida" : "Aguardando imagem"}</span>
            <span>{receita ? `${Math.round((receita.length * 3) / 4).toLocaleString("pt-BR")} caracteres aprox.` : "Nenhum dado disponível"}</span>
          </div>
        </article>
      </section>

      <section className="closing-note">
        <span className="closing-flower">✳</span>
        <p>Pequenos cuidados fazem parte de uma vida mais organizada.</p>
        <span>PRONTUÁRIOMED · PDM II</span>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-symbol">p.</span>
          <span>prontuário<span className="brand-light">med</span></span>
        </a>
        <span>PROJETO ACADÊMICO · ALUNO 03</span>
        <a href="#inicio">Voltar ao início ↑</a>
      </footer>

      <nav className="mobile-nav" aria-label="Navegação principal">
        <a href="#inicio"><span>⌂</span> Início</a>
        <a href="#digitalizar"><span>＋</span> Digitalizar</a>
        <a href="#digitalizar"><span>▤</span> Receita</a>
      </nav>
    </main>
  );
}
