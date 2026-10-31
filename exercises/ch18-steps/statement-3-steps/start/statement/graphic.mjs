// Nota oficial em 3 passos (stepCount: 3). Complete os TODO.

import { gsap } from './lib/gsap/index.js';

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;
const FONTS = ['400 1em Anton', '500 1em "Barlow Condensed"', '700 1em "Barlow Condensed"'];
const STEPS = 3;

// Espera um <link> de CSS terminar de carregar.
function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

export default class Statement extends HTMLElement {

  async load({ data } = {}) {
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <link rel="stylesheet" href="${CSS_URL}">
      <div class="st" data-skin="news"><div class="st-stack">
        <div class="st-kicker"><span class="st-up">NOTA OFICIAL</span></div>
        <div class="st-head"><span class="st-up"><h1 class="st-title"></h1></span></div>
        <div class="st-panel"><p class="st-page st-up"></p></div>
        <div class="st-sub"><span class="st-counter st-up"></span></div>
        <div class="st-underline"></div>
      </div></div>`;
    this.root = this.querySelector('.st');
    this.page = this.querySelector('.st-page');
    this.data = data ?? {};
    this.step = -1;                  // -1 = ainda fora do ar
    this.querySelector('.st-title').textContent = this.data.title ?? '';

    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await Promise.all(FONTS.map((font) => document.fonts.load(font)));
    return { statusCode: 200 };
  }

  async playAction({ goto, delta, skipAnimation } = {}) {
    // TODO 1 — Calcule o passo de destino: goto, se veio; se
    //          não, o passo atual (this.step) mais delta (ou 1).
    const target = 0;

    // TODO 2 — Se o alvo for STEPS ou mais, chame
    //          await this.stopAction({ skipAnimation }) e
    //          devolva { statusCode: 200, currentStep: undefined }.

    // Primeira entrada: o painel inteiro. Continue: só o texto troca.
    const tl = this.step < 0 ? this.entrance(target) : this.goToStep(target);
    this.step = target;
    if (skipAnimation) tl.progress(1);
    await tl;

    // TODO 3 — Devolva também em que passo o gráfico está:
    //          { statusCode: 200, currentStep: target }
    return { statusCode: 200 };
  }

  async stopAction({ skipAnimation } = {}) {
    this.step = -1;
    const tl = this.exit();
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200 };
  }

  async updateAction({ data } = {}) {
    this.data = { ...this.data, ...data };
    this.querySelector('.st-title').textContent = this.data.title ?? '';
    if (this.step >= 0) this.showText(this.step);
    return { statusCode: 200 };
  }

  async customAction({ id } = {}) {
    return {
      statusCode: 404,
      statusMessage: `Ação desconhecida: ${id}`,
    };
  }

  async dispose() {
    gsap.killTweensOf(this.querySelectorAll('*'));
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  // Entrada: placas revelam pela esquerda, textos sobem de dentro.
  entrance(step) {
    this.showText(step);
    const q = (s) => this.querySelector(s);
    const reveal = { clipPath: 'inset(0 100% 0 0)' };
    const open = { clipPath: 'inset(0 0% 0 0)', ease: 'expo.out' };
    return gsap.timeline()
      .set(this.root, { autoAlpha: 1 })
      .fromTo(q('.st-head'), reveal, { ...open, duration: 0.55 }, 0.08)
      .fromTo(q('.st-title'), { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, 0.2)
      .fromTo(q('.st-panel'), reveal, { ...open, duration: 0.55 }, 0.24)
      .fromTo(this.page, { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, 0.36)
      .fromTo(q('.st-kicker'), reveal, { ...open, duration: 0.45 }, 0.32)
      .fromTo(q('.st-sub'), reveal, { ...open, duration: 0.5 }, 0.4)
      .fromTo(q('.st-underline'), { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.55, ease: 'expo.out' }, 0.48);
  }

  // Troca de passo: o texto velho sobe e sai, o novo sobe de baixo.
  goToStep(step) {
    return gsap.timeline()
      .to(this.page, { yPercent: -115, duration: 0.25, ease: 'power3.in' })
      .call(() => this.showText(step))
      .fromTo(this.page, { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: 'expo.out' });
  }

  // Saída: tudo junto, rápido.
  exit() {
    return gsap.timeline()
      .to(this.querySelector('.st-stack'), { clipPath: 'inset(0 0 0 100%)', duration: 0.4, ease: 'power3.in' })
      .set(this.root, { autoAlpha: 0 })
      .set(this.querySelector('.st-stack'), { clipPath: 'none' });
  }

  // Põe o trecho do passo na tela e atualiza o contador.
  showText(step) {
    this.page.textContent = this.data[`text${step + 1}`] ?? '';
    this.querySelector('.st-counter').textContent = `${step + 1} / ${STEPS}`;
  }
}
