/**
 * base.mjs — a classe-base de todos os gráficos do pacote.
 *
 * Ela faz, uma vez só, o que a Parte V ensinou: carregar CSS e
 * fonte, responder só no fim da animação, skipAnimation, passos,
 * ações extras e limpeza. Cada gráfico estende esta classe e
 * escreve só o que é dele:
 *
 *   static css        o arquivo CSS do gráfico
 *   html()            a árvore de cena
 *   render(data)      põe os dados na tela
 *   entrance(step)    a timeline de entrada
 *   exit()            a timeline de saída
 *
 * E, se precisar:
 *   swap(data)        timeline de troca com o gráfico no ar
 *   stepCount()       quantos passos (padrão: 1)
 *   goToStep(step)    timeline de um passo para outro
 *   actions           { id: função } das ações extras
 *   setup()           o que ligar no load (relógios, buscas)
 *   onDispose()       o que parar no dispose
 */

import { gsap } from './lib/gsap/index.js';

export { gsap };

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;

// Espera um <link> de CSS terminar de carregar.
export function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

export class NewsGraphic extends HTMLElement {

  // ── load ───────────────────────────────────────────────
  async load({ data } = {}) {
    // TODO — Vista a pele news (seção 21.3): acrescente o atributo
    //        data-skin="news" na <div class="news"> abaixo. Sem ele,
    //        valem as cores do :root, as da pele liga.
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <link rel="stylesheet" href="${this.constructor.css}">
      <div class="news">${this.html()}</div>`;
    this.root = this.querySelector('.news');
    this.data = {};
    this.onAir = false;
    this.step = -1;

    const links = [...this.querySelectorAll('link')];
    await Promise.all(links.map(waitForCss));
    await document.fonts.ready;

    this.setup?.();
    this.applyData(data);
    return { statusCode: 200 };
  }

  // ── playAction: entra ou avança um passo ───────────────
  async playAction({ goto, delta, skipAnimation } = {}) {
    const target = goto ?? this.step + (delta ?? 1);

    if (target >= this.stepCount()) {
      await this.stopAction({ skipAnimation });
      return { statusCode: 200, currentStep: undefined };
    }

    const tl = this.onAir ? this.goToStep(target) : this.entrance(target);
    this.onAir = true;
    this.step = target;
    await this.run(tl, skipAnimation);
    return { statusCode: 200, currentStep: target };
  }

  // ── stopAction: sai, e só responde no fim ──────────────
  async stopAction({ skipAnimation } = {}) {
    this.onAir = false;
    this.step = -1;
    await this.run(this.exit(), skipAnimation);
    return { statusCode: 200 };
  }

  // ── updateAction: troca dados, animando se estiver no ar ─
  async updateAction({ data, skipAnimation } = {}) {
    if (this.onAir && !skipAnimation && this.swap) {
      await this.run(this.swap(data));
    } else {
      this.applyData(data);
    }
    return { statusCode: 200 };
  }

  // ── customAction: procura a ação na lista do gráfico ───
  async customAction({ id, payload, skipAnimation } = {}) {
    const action = this.actions?.[id];
    if (!action) {
      return {
        statusCode: 404,
        statusMessage: `Ação desconhecida: ${id}`,
      };
    }
    await action.call(this, payload ?? {}, skipAnimation);
    return { statusCode: 200 };
  }

  // ── dispose ────────────────────────────────────────────
  async dispose() {
    this.animation?.kill();
    this.onDispose?.();
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  // ───────────────────────────────────────────────────────
  // Ajudantes para os gráficos.
  // ───────────────────────────────────────────────────────

  // Junta os dados novos aos que já estavam e redesenha.
  applyData(newData = {}) {
    this.data = { ...this.data, ...newData };
    this.render(this.data);
  }

  // Roda uma timeline e espera o fim; skipAnimation vai direto
  // ao último quadro.
  async run(timeline, skipAnimation = false) {
    this.animation?.progress(1);
    this.animation = timeline;
    if (skipAnimation) timeline.progress(1);
    await timeline;
  }

  // Atalho: this.$('.lt-name') em vez de this.querySelector.
  $(selector) {
    return this.querySelector(selector);
  }

  // Padrões que cada gráfico pode trocar.
  stepCount() { return 1; }
  goToStep(step) { return this.entrance(step); }
}
