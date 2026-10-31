// Placar com ações extras: os gols entram com o placar no ar.

import { gsap } from './lib/gsap/index.js';

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;
const FONTS = ['400 1em Anton', '700 1em "Barlow Condensed"'];

// Espera um <link> de CSS terminar de carregar.
function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

export default class Scoreboard extends HTMLElement {

  async load({ data } = {}) {
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <link rel="stylesheet" href="${CSS_URL}">
      <div class="sb"><div class="sb-row">
        <div class="sb-league"><span class="sb-up">VL</span></div>
        <div class="sb-team sb-home"><span class="sb-up"></span></div>
        <div class="sb-score"><span class="sb-up">
          <b class="sb-goals sb-home">0</b><b class="sb-colon">:</b><b class="sb-goals sb-away">0</b>
        </span></div>
        <div class="sb-team sb-away"><span class="sb-up"></span></div>
      </div></div>`;
    this.root = this.querySelector('.sb');
    this.goals = { home: 0, away: 0 };
    this.applyData(data);
    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await Promise.all(FONTS.map((font) => document.fonts.load(font)));
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    // A fileira revela pela esquerda; siglas e números sobem de dentro.
    const tl = gsap.timeline()
      .set(this.root, { autoAlpha: 1 })
      .fromTo(this.querySelector('.sb-row'),
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'expo.out' }, 0.08)
      .fromTo(this.querySelectorAll('.sb-row .sb-up'),
        { yPercent: 115 },
        { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, 0.2);
    if (skipAnimation) tl.progress(1);
    await tl;
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    const tl = gsap.timeline()
      .to(this.querySelector('.sb-row'), {
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

  // As ações extras declaradas no manifest, em "customActions".
  async customAction({ id } = {}) {
    // TODO 1 — Se id for 'home-goal': some 1 em this.goals.home,
    //          chame await this.showGoal('home') e devolva
    //          { statusCode: 200 }.

    // TODO 2 — Faça o mesmo para 'away-goal'.

    // TODO 3 — 'reset': os dois gols voltam a 0 e os dois
    //          números sobem de novo (dois this.showGoal).

    // Qualquer outro id: a ação não existe.
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

  applyData(data = {}) {
    const q = (s) => this.querySelector(s);
    if (data.home !== undefined) q('.sb-team.sb-home .sb-up').textContent = data.home;
    if (data.away !== undefined) q('.sb-team.sb-away .sb-up').textContent = data.away;
  }

  // Escreve o número novo, que sobe de baixo na cor de destaque
  // e assenta na cor do texto. Rápido (0,6 s): o playout espera
  // a resposta de uma ação por poucos segundos.
  async showGoal(side) {
    const el = this.querySelector(`.sb-goals.sb-${side}`);
    const colors = getComputedStyle(this.root);
    el.textContent = this.goals[side];
    await gsap.timeline()
      .fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: 0.45, ease: 'expo.out' })
      .fromTo(el,
        { color: colors.getPropertyValue('--accent').trim() },
        { color: colors.getPropertyValue('--paper').trim(), duration: 0.6, ease: 'power2.in' }, 0);
  }
}
