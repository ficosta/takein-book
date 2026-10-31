// Tarja de urgente — a versão corrigida. Cada correção está
// marcada com o número do erro.

// Erro 1: GSAP de dentro do pacote, e não de um CDN.
import { gsap } from './lib/gsap/index.js';

// Erro 2: o CSS pelo endereço do próprio pacote. O tokens.css
// traz as cores, as medidas e as fontes (ver o erro 5).
const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;

// Espera um <link> de CSS terminar de carregar.
function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

// Erro 3: sem customElements.define, e com export default direto.
export default class UrgentStrap extends HTMLElement {
  async load({ data } = {}) {
    // data-skin="news": a tarja usa a pele de jornalismo dos tokens.
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <link rel="stylesheet" href="${CSS_URL}">
      <div class="strap" data-skin="news">
        <div class="strap-kicker"><span>URGENTE</span></div>
        <div class="strap-bar"><h1 class="strap-headline"></h1></div>
        <div class="strap-underline"></div>
      </div>`;
    this.strap = this.querySelector('.strap');
    this.kicker = this.querySelector('.strap-kicker');
    this.bar = this.querySelector('.strap-bar');
    this.headline = this.querySelector('.strap-headline');
    this.underline = this.querySelector('.strap-underline');
    // Erro 4: texto do operador com textContent, nunca innerHTML.
    this.headline.textContent = data?.headline ?? '';
    // Erro 6: o load espera o CSS e a fonte antes de responder.
    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await document.fonts.ready;
    return { statusCode: 200 };
  }

  // A entrada no vocabulário do sistema: a placa revela da esquerda,
  // a manchete sobe de dentro, o selo e o sublinhado vêm depois.
  entrance() {
    const hidden = 'inset(0 100% 0 0)';
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set(this.strap, { autoAlpha: 1 })
      .fromTo(this.bar, { clipPath: hidden }, { clipPath: 'inset(0 0% 0 0)', duration: 0.55 }, 0.08)
      .fromTo(this.headline, { yPercent: 115 }, { yPercent: 0, duration: 0.6 }, 0.2)
      .fromTo(this.kicker, { clipPath: hidden }, { clipPath: 'inset(0 0% 0 0)', duration: 0.45 }, 0.32)
      .fromTo(this.underline, { scaleX: 0 }, { scaleX: 1, duration: 0.55 }, 0.48);
  }

  // A saída: tudo junto, na ordem inversa, acelerando.
  exit() {
    const hidden = 'inset(0 100% 0 0)';
    return gsap.timeline({ defaults: { ease: 'power3.in', duration: 0.32 } })
      .to(this.underline, { scaleX: 0 }, 0)
      .to(this.kicker, { clipPath: hidden }, 0.03)
      .to(this.bar, { clipPath: hidden }, 0.06)
      .set(this.strap, { autoAlpha: 0 });
  }

  // Erro 7: responde só quando a animação termina (await), e
  // respeita skipAnimation.
  async playAction({ skipAnimation } = {}) {
    const tl = this.entrance();
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    const tl = this.exit();
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    if (data?.headline !== undefined) {
      this.headline.textContent = data.headline;
    }
    return { statusCode: 200 };
  }

  async customAction({ id } = {}) {
    return {
      statusCode: 404,
      statusMessage: `Ação desconhecida: ${id}`,
    };
  }

  async dispose() {
    gsap.killTweensOf([this.strap, this.kicker, this.bar, this.headline, this.underline]);
    this.innerHTML = '';
    return { statusCode: 200 };
  }
}
