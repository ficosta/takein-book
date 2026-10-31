// Cotação ao vivo: busca o JSON de tempos em tempos e mantém
// o último valor bom se a busca falhar.

import { gsap } from './lib/gsap/index.js';

const DATA_URL = new URL('./data/exchange-rate.json', import.meta.url);
const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;
const FONTS = ['400 1em Anton', '600 1em "Barlow Condensed"', '700 1em "Barlow Condensed"'];

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
});
const percent = new Intl.NumberFormat('pt-BR', {
  style: 'percent', minimumFractionDigits: 1,
  maximumFractionDigits: 1, signDisplay: 'exceptZero',
});
const clock = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'medium' });

// Espera um <link> de CSS terminar de carregar.
function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

export default class ExchangeRate extends HTMLElement {

  async load({ data } = {}) {
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <link rel="stylesheet" href="${CSS_URL}">
      <div class="fx" data-skin="news">
        <div class="fx-ghost"></div>
        <div class="fx-stack">
          <div class="fx-kicker"><span class="fx-up"><span class="fx-currency">—</span></span></div>
          <div class="fx-bar"><span class="fx-up">
            <span class="fx-value">—</span><span class="fx-change"></span>
          </span></div>
          <div class="fx-sub"><span class="fx-up"><span class="fx-time"></span></span></div>
        </div>
      </div>`;
    this.root = this.querySelector('.fx');
    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await Promise.all(FONTS.map((font) => document.fonts.load(font)));

    await this.fetchData();               // o primeiro valor
    this.startTimer(data?.interval ?? 5);
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    const q = (s) => this.querySelector(s);
    const reveal = { clipPath: 'inset(0 0 0 100%)' };
    const open = { clipPath: 'inset(0 0 0 0%)', ease: 'expo.out' };
    // Ancorada à direita: as placas revelam da direita para a esquerda.
    const tl = gsap.timeline()
      .set(this.root, { autoAlpha: 1 })
      .fromTo(q('.fx-bar'), reveal, { ...open, duration: 0.55 }, 0.08)
      .fromTo(q('.fx-bar .fx-up'), { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, 0.2)
      .fromTo(q('.fx-ghost'), { autoAlpha: 0, y: 60 }, { autoAlpha: 0.28, y: 0, duration: 0.6, ease: 'expo.out' }, 0.3)
      .fromTo(q('.fx-kicker'), reveal, { ...open, duration: 0.45 }, 0.32)
      .fromTo(q('.fx-sub'), reveal, { ...open, duration: 0.5 }, 0.4);
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    const tl = gsap.timeline()
      .to(this.root, { autoAlpha: 0, x: 40, duration: 0.4, ease: 'power3.in' })
      .set(this.root, { x: 0 });
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200 };
  }

  // O operador pode mudar o intervalo com o gráfico no ar.
  async updateAction({ data } = {}) {
    if (data?.interval !== undefined) this.startTimer(data.interval);
    return { statusCode: 200 };
  }

  startTimer(seconds) {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.fetchData(), seconds * 1000);
  }
  async customAction() { return { statusCode: 404 }; }

  async dispose() {
    clearInterval(this.timer);
    gsap.killTweensOf(this.querySelectorAll('*'));
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  async fetchData() {
    try {
      // no-store: sempre o arquivo novo, nunca o guardado.
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.render(data);
    } catch (error) {
      // Plano B: fica o último valor bom. No ar, nada de
      // mensagem de erro; só no Console, para quem opera.
      console.warn('Cotação não atualizou:', error.message);
    }
  }

  render(data) {
    const q = (s) => this.querySelector(s);
    q('.fx-ghost').textContent = data.code;
    q('.fx-currency').textContent = data.currency;
    q('.fx-value').textContent = brl.format(data.value);
    const change = q('.fx-change');
    // ▲ alta, ▼ queda: a seta não depende só da cor.
    change.textContent = `${data.change < 0 ? '▼' : '▲'} ${percent.format(data.change)}`;
    change.className = `fx-change ${data.change < 0 ? 'down' : 'up'}`;
    q('.fx-time').textContent =
      `ATUALIZADO ÀS ${clock.format(new Date())}`;
  }
}
