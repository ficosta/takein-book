// Relógio no ar: o gráfico atualiza a própria hora.

import { gsap } from './lib/gsap/index.js';

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;
const FONTS = ['400 1em Anton', '600 1em "Barlow Condensed"'];

// O nome que vai ao ar para cada fuso do schema.
const ZONE_NAMES = {
  'America/Sao_Paulo': 'BRASÍLIA',
  'America/Manaus': 'MANAUS',
  'America/Noronha': 'NORONHA',
};

// Espera um <link> de CSS terminar de carregar.
function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

export default class Clock extends HTMLElement {

  async load({ data } = {}) {
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <link rel="stylesheet" href="${CSS_URL}">
      <div class="clk" data-skin="news"><div class="clk-row">
        <div class="clk-zone"><span class="clk-up"></span></div>
        <div class="clk-time"><span class="clk-up"></span></div>
      </div></div>`;
    this.root = this.querySelector('.clk');
    this.applyData(data);
    // O relógio começa a andar já no load, para aparecer
    // certo no preview, antes de ir ao ar.
    this.timer = setInterval(() => this.tick(), 1000);
    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await Promise.all(FONTS.map((font) => document.fonts.load(font)));
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    // Ancorado à direita: a fileira revela da direita para a esquerda.
    const tl = gsap.timeline()
      .set(this.root, { autoAlpha: 1 })
      .fromTo(this.querySelector('.clk-row'),
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.55, ease: 'expo.out' }, 0.08)
      .fromTo(this.querySelectorAll('.clk-up'),
        { yPercent: 115 },
        { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08 }, 0.2);
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    const tl = gsap.timeline()
      .to(this.querySelector('.clk-row'), {
        clipPath: 'inset(0 0 0 100%)', duration: 0.4, ease: 'power3.in',
      })
      .set(this.root, { autoAlpha: 0 });
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this.applyData(data);
    return { statusCode: 200 };
  }

  async customAction() { return { statusCode: 404 }; }

  async dispose() {
    // Sem isto, o setInterval continua rodando depois que o
    // gráfico sai da página, e cada segundo dá um erro.
    clearInterval(this.timer);
    gsap.killTweensOf(this.querySelectorAll('*'));
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  // Um formatador por fuso: "19:42:07".
  applyData(data = {}) {
    if (data.timeZone === undefined) return;
    this.format = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: data.timeZone,
    });
    this.querySelector('.clk-zone span').textContent =
      ZONE_NAMES[data.timeZone] ?? data.timeZone;
    this.tick();
  }

  // Procura a hora na cena a cada segundo. Depois do dispose,
  // a cena está vazia e o querySelector devolve null.
  tick() {
    this.querySelector('.clk-time span').textContent =
      this.format.format(new Date());
  }
}
