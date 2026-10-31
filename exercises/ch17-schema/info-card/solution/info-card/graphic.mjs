// Cartela de campos — mostra cada valor do schema na tela.
// Não precisa mexer aqui: o exercício é no manifest.

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;

// Tela cheia: a cartela fica no centro do quadro. Cores, fontes e
// medidas vêm do tokens.css.
const CSS = `
  .card { position: absolute; left: 50%; top: 50%; width: 1100px;
    transform: translate(-50%, -50%); filter: var(--shadow); }
  .card[hidden] { display: block; visibility: hidden; }

  /* Uma inclinação só para o bloco inteiro; o texto volta a ficar reto. */
  .card-stack { position: relative; z-index: 1;
    transform: skewX(var(--skew)); transform-origin: left bottom; }
  .card-up { display: flex; align-items: center; gap: 12px;
    transform: skewX(var(--unskew)); }

  /* O número vazado atrás: a ordem no bloco. */
  .card-ghost { position: absolute; right: 70px; top: -150px; z-index: 0;
    font: var(--size-ghost)/1 var(--font-display); color: transparent;
    -webkit-text-stroke: 3px var(--accent); opacity: 0.28;
    transform: skewX(var(--skew)); }

  .card-top { display: flex; gap: 12px; margin-left: 26px; }
  .card-kicker, .card-live { display: flex; align-items: center;
    height: var(--h-strip); padding: 0 26px 0 20px;
    font: 700 var(--size-label) var(--font-data);
    letter-spacing: var(--track-label); white-space: nowrap; }
  .card-kicker { background: var(--accent);
    color: var(--on-accent); }
  .card-live { background: var(--live); color: var(--paper); }
  .card-kicker[hidden], .card-live[hidden] { visibility: hidden; }
  .card-dot { width: 12px; height: 12px; border-radius: 50%;
    background: var(--paper); }

  .card-bar { position: relative; display: flex; align-items: center;
    height: var(--h-bar); padding: 0 120px 0 34px;
    background: linear-gradient(105deg, var(--ink) 78%, var(--ink-2) 78%); }
  .card-bar::before { content: ""; position: absolute; left: 0; top: 0;
    bottom: 0; width: var(--blade); background: var(--accent); }
  .card-title { margin: 0; font: var(--size-display)/1.15 var(--font-display);
    letter-spacing: 0.015em; color: var(--paper); text-transform: uppercase;
    white-space: nowrap; }

  .card-body { margin-left: 10px; padding: 12px 0; background: var(--primary); }
  .card-line { display: flex; align-items: center; height: var(--h-plate);
    padding: 0 34px; font: 600 var(--size-data-l) var(--font-data);
    letter-spacing: var(--track-data); color: var(--paper); }

  .card-underline { width: 520px; height: var(--rule); margin: 8px 0 0 10px;
    background: var(--accent); }
`;

export default class InfoCard extends HTMLElement {

  async load({ data } = {}) {
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <style>${CSS}</style>
      <div class="card" hidden>
        <div class="card-ghost"></div>
        <div class="card-stack">
          <div class="card-top">
            <div class="card-kicker"><span class="card-up"></span></div>
            <div class="card-live"><span class="card-up">
              <i class="card-dot"></i>AO VIVO</span></div>
          </div>
          <div class="card-bar"><span class="card-up">
            <h1 class="card-title"></h1></span></div>
          <div class="card-body"></div>
          <div class="card-underline"></div>
        </div>
      </div>`;
    this.card = this.querySelector('.card');
    this.data = {};
    await new Promise((ok) => {
      const link = this.querySelector('link');
      if (link.sheet) return ok();
      link.addEventListener('load', ok, { once: true });
      link.addEventListener('error', ok, { once: true });
    });
    await document.fonts.load(`58px Anton`);
    await document.fonts.load(`600 30px "Barlow Condensed"`);
    this.applyData(data);
    return { statusCode: 200 };
  }

  // Sem animação: aparece e some na hora.
  async playAction() {
    this.card.hidden = false;
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction() {
    this.card.hidden = true;
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this.applyData(data);
    return { statusCode: 200 };
  }

  async customAction() { return { statusCode: 404 }; }
  async dispose() { this.innerHTML = ''; return { statusCode: 200 }; }

  // Só troca o que veio (capítulo 10).
  applyData(incoming = {}) {
    const d = { ...this.data, ...incoming };
    this.data = d;
    const $ = (sel) => this.querySelector(sel);
    $('.card-title').textContent = d.title ?? '';
    // Texto de várias linhas: uma faixa por linha.
    const lines = (d.text ?? '').split('\n').filter((l) => l.trim());
    $('.card-body').hidden = lines.length === 0;
    $('.card-body').innerHTML = '';
    for (const line of lines) {
      const row = document.createElement('div');
      row.className = 'card-line';
      row.innerHTML = '<span class="card-up"></span>';
      row.firstChild.textContent = line;
      $('.card-body').append(row);
    }
    this.card.dataset.skin = d.theme ?? 'liga';
    $('.card-live').hidden = !d.showLiveBadge;
    if (d.color) this.card.style.setProperty('--accent', d.color);
    $('.card-kicker').hidden = !d.order;
    $('.card-kicker .card-up').textContent =
      d.order ? `ITEM ${d.order} DO BLOCO` : '';
    $('.card-ghost').textContent = d.order ?? '';
  }
}
