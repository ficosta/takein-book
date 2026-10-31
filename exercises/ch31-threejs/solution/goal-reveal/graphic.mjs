/**
 * Gol em 3D — capítulo 31.
 *
 * As placas do sistema, extrudadas com o three.js, entram girando
 * como portas; o texto continua sendo HTML e sobe de dentro delas
 * quando elas assentam. Parado, o gráfico é idêntico à versão 2D.
 *
 * O GSAP anima os objetos 3D (rotação de cada grupo) e o three.js
 * desenha. Em tempo real, desenha a cada quadro só enquanto uma
 * animação roda; fora do tempo real, desenha o quadro que o
 * goToTime pede.
 */

import { gsap } from './lib/gsap/index.js';
import { createStage, buildPlate, disposePlate } from './scene.mjs';

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;
const FONTS = ['400 1em Anton', '600 1em "Barlow Condensed"'];

const SWING = Math.PI * 0.53;   // ~95°: a placa começa de perfil, virada para dentro
const CLOSED = 'inset(0% 100% 0% 0%)';
const OPEN = 'inset(0% 0% 0% 0%)';
const GONE = 'inset(0% 0% 0% 100%)';

const HTML = `
  <link rel="stylesheet" href="${TOKENS_URL}">
  <link rel="stylesheet" href="${CSS_URL}">
  <div class="goal">
    <div class="goal-ghost"></div>
    <canvas class="goal-canvas" width="1920" height="1080"></canvas>
    <div class="goal-plates">
      <div class="plate goal-word"><span class="goal-up"></span></div>
      <div class="plate goal-bar"><span class="goal-up"></span></div>
      <div class="plate goal-sub"><span class="goal-up"></span></div>
      <div class="goal-underline"></div>
    </div>
  </div>`;

// Espera um <link> de CSS terminar de carregar.
function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

export default class GoalReveal extends HTMLElement {

  // Desenha um quadro da cena. Uma arrow function, para poder ir e
  // voltar do gsap.ticker sempre como a mesma função.
  draw = () => {
    if (!this.stage) return;
    const { renderer, scene, camera } = this.stage;
    renderer.render(scene, camera);
  };

  // ── load: montar a cena 2D e a 3D ───────────────────────
  async load({ data, renderType } = {}) {
    this.innerHTML = HTML;
    this.root = this.querySelector('.goal');
    this.el = {
      canvas: this.querySelector('.goal-canvas'),
      ghost: this.querySelector('.goal-ghost'),
      plates: [...this.querySelectorAll('.plate')],
      texts: [...this.querySelectorAll('.goal-up')],
      underline: this.querySelector('.goal-underline'),
    };
    this.onAir = false;

    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await Promise.all(FONTS.map((font) => document.fonts.load(font)));

    // O texto primeiro: a largura das placas depende dele.
    this.applyData(data);
    this.setupThree();
    this.buildPlates();

    this.initialData = data;
    if (renderType === 'non-realtime') {
      this.master = gsap.timeline({ paused: true });
    }
    this.draw();
    return { statusCode: 200 };
  }

  // ── playAction: o Take ──────────────────────────────────
  async playAction({ goto, delta, skipAnimation } = {}) {
    const step = goto ?? (this.onAir ? 0 : -1) + (delta ?? 1);
    if (step >= 1) {
      await this.stopAction({ skipAnimation });
      return { statusCode: 200, currentStep: undefined };
    }
    this.onAir = true;
    await this.run(this.entrance(), skipAnimation);
    return { statusCode: 200, currentStep: 0 };
  }

  // ── stopAction: o Take Out ──────────────────────────────
  async stopAction({ skipAnimation } = {}) {
    this.onAir = false;
    await this.run(this.exit(), skipAnimation);
    return { statusCode: 200 };
  }

  // ── updateAction: trocar o texto com o gráfico no ar ────
  async updateAction({ data, skipAnimation } = {}) {
    if (skipAnimation || !this.onAir) {
      this.swap(data);
      return { statusCode: 200 };
    }
    const { texts } = this.el;
    await this.run(gsap.timeline()
      .to(texts, { autoAlpha: 0, y: -10, duration: 0.15, ease: 'power2.in' })
      .call(() => this.swap(data))
      .fromTo(texts, { y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out' }));
    return { statusCode: 200 };
  }

  async customAction({ id } = {}) {
    return { statusCode: 404, statusMessage: `Ação desconhecida: ${id}` };
  }

  // ── Fora do tempo real (seção 16.7) ─────────────────────
  async setActionsSchedule({ schedule = [] } = {}) {
    this.master.clear();
    for (const { timestamp, action } of schedule) {
      const timeline = this.timelineFor(action);
      if (timeline) this.master.add(timeline, timestamp / 1000);
    }
  }

  async goToTime({ timestamp }) {
    this.swap(this.initialData);
    this.master.seek(0);
    this.master.seek(timestamp / 1000, false);
    // O GSAP pôs cada objeto 3D no lugar; falta desenhar o quadro.
    this.draw();
    return { statusCode: 200 };
  }

  timelineFor({ type, params = {} }) {
    if (type === 'playAction') return this.entrance();
    if (type === 'stopAction') return this.exit();
    if (type === 'updateAction') {
      return gsap.timeline().call(() => this.swap(params.data));
    }
    return null;
  }

  // ── dispose: devolver a placa de vídeo ──────────────────
  async dispose() {
    gsap.ticker.remove(this.draw);
    this.animation?.kill();
    this.master?.kill();
    if (this.stage) {
      this.plates.forEach(disposePlate);
      this.stage.renderer.dispose();
      this.stage.renderer.forceContextLoss();
      this.stage = null;
    }
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  // ───────────────────────────────────────────────────────
  // Daqui para baixo, funções nossas: não são da spec.
  // ───────────────────────────────────────────────────────

  applyData(data = {}) {
    const [headline, name, detail] = this.el.texts;
    if (data.headline !== undefined) headline.textContent = data.headline;
    if (data.name !== undefined) name.textContent = data.name;
    if (data.detail !== undefined) detail.textContent = data.detail;
    if (data.number !== undefined) this.el.ghost.textContent = data.number;
  }

  // Troca o texto e refaz as placas 3D, que dependem da largura dele.
  swap(data) {
    this.applyData(data);
    this.buildPlates();
    this.draw();
  }

  // Cria o renderizador. Sem WebGL, o gráfico fica em 2D.
  setupThree() {
    try {
      this.stage = createStage(this.el.canvas);
    } catch (error) {
      console.error('Sem WebGL: o gol vai ao ar em 2D.', error);
      this.stage = null;
      this.el.canvas.hidden = true;
      return;
    }
    // O three.js refaz os recursos quando o contexto volta.
    // Falta só desenhar o quadro de novo.
    this.el.canvas.addEventListener('webglcontextrestored', this.draw);
  }

  // Uma placa 3D para cada .plate do CSS. Na primeira vez, cria os
  // grupos; depois, reconstrói dentro dos mesmos grupos, para as
  // timelines que já apontam para eles continuarem valendo.
  buildPlates() {
    if (!this.stage) return;
    // Mesmas larguras de antes? Não há o que refazer.
    const sizes = this.el.plates.map((element) => element.offsetWidth).join();
    if (sizes === this.sizes) return;
    this.sizes = sizes;
    // A cor vem do CSS: mede com as placas ainda pintadas.
    this.root.classList.remove('has-3d');
    if (!this.plates) {
      this.plates = this.el.plates.map((element) => buildPlate(element, this.root));
      for (const group of this.plates) group.visible = false;   // fora do ar
      this.stage.scene.add(...this.plates);
    } else {
      this.el.plates.forEach((element, i) => buildPlate(element, this.root, this.plates[i]));
    }
    this.root.classList.add('has-3d');
  }

  // Roda uma timeline e espera o fim (capítulo 16). Enquanto ela roda,
  // o gsap.ticker chama draw a cada quadro; parado, ninguém desenha.
  async run(timeline, skipAnimation = false) {
    this.animation?.progress(1);
    this.animation = timeline;
    if (skipAnimation) timeline.progress(1);
    gsap.ticker.add(this.draw);
    await timeline;
    // Outra animação pode ter começado enquanto esta terminava.
    if (this.animation === timeline) gsap.ticker.remove(this.draw);
    this.draw();
  }

  entrance() {
    const { ghost, texts, underline, plates } = this.el;
    const tl = gsap.timeline().set(this.root, { autoAlpha: 1 });
    if (this.stage) {
      // As placas 3D: cada uma gira na dobradiça até ficar de frente.
      tl.set(this.plates, { visible: true }, 0)
        .fromTo(this.plates.map((group) => group.rotation), { y: SWING }, {
          y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        }, 0.05);
    } else {
      // Plano B: as mesmas placas, em 2D, reveladas pela esquerda.
      tl.fromTo(plates, { clipPath: CLOSED }, {
        clipPath: OPEN, duration: 0.55, ease: 'expo.out', stagger: 0.08,
      }, 0.05);
    }
    return tl
      .fromTo(texts, { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08 }, 0.45)
      .fromTo(ghost, { autoAlpha: 0, y: 60 }, { autoAlpha: 0.28, y: 0, duration: 0.6, ease: 'expo.out' }, 0.55)
      .fromTo(underline, { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 0.55, ease: 'expo.out' }, 0.65);
  }

  exit() {
    const { ghost, texts, underline, plates } = this.el;
    const tl = gsap.timeline()
      .to(texts, { yPercent: 115, duration: 0.2, ease: 'power3.in' }, 0)
      .to([ghost, underline], { autoAlpha: 0, duration: 0.2, ease: 'power3.in' }, 0);
    if (this.stage) {
      tl.to(this.plates.map((group) => group.rotation), {
        y: -SWING, duration: 0.4, ease: 'power3.in', stagger: { each: 0.05, from: 'end' },
      }, 0.1)
        .set(this.plates, { visible: false });
    } else {
      tl.to(plates, {
        clipPath: GONE, duration: 0.35, ease: 'power3.in', stagger: { each: 0.05, from: 'end' },
      }, 0.1);
    }
    return tl.set(this.root, { autoAlpha: 0 });
  }
}
