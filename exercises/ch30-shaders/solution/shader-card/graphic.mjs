/**
 * Cartela com shader — capítulo 30.
 *
 * O fundo é um shader de fragmento (background.glsl) pintado num
 * <canvas> WebGL. O texto é HTML por cima, como em todo o livro.
 * A timeline do GSAP anima dois números, reveal e exit, e o shader
 * desenha a varredura a partir deles.
 *
 * Funciona nos dois modos do capítulo 16: em tempo real, um laço de
 * requestAnimationFrame desenha cada quadro; fora do tempo real,
 * goToTime desenha só o quadro pedido. Nos dois casos, o shader
 * recebe o tempo de quem manda no relógio.
 */

import { gsap } from './lib/gsap/index.js';
import { FULL_SCREEN_VERTEX, createProgram, tokenColor } from './webgl.mjs';

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;
const SHADER_URL = new URL('./background.glsl', import.meta.url).href;
const FONTS = ['400 1em Anton', '600 1em "Barlow Condensed"', '700 1em "Barlow Condensed"'];

// Cada cor do shader e o token de onde ela vem.
const COLORS = { u_ink: '--ink', u_ink2: '--ink-2', u_primary: '--primary', u_accent: '--accent' };
const UNIFORMS = ['u_resolution', 'u_time', 'u_reveal', 'u_exit', ...Object.keys(COLORS)];

const CLOSED = 'inset(0% 100% 0% 0%)';
const OPEN = 'inset(0% 0% 0% 0%)';
const GONE = 'inset(0% 0% 0% 100%)';

const HTML = `
  <link rel="stylesheet" href="${TOKENS_URL}">
  <link rel="stylesheet" href="${CSS_URL}">
  <div class="card">
    <canvas class="card-canvas" width="1920" height="1080"></canvas>
    <div class="card-backdrop"></div>
    <div class="card-content">
      <div class="card-ghost">VL</div>
      <div class="card-kicker"><span class="card-up"></span></div>
      <div class="card-title"><h1 class="card-name"></h1></div>
      <div class="card-sub"><span class="card-up"></span></div>
      <div class="card-underline"></div>
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

export default class ShaderCard extends HTMLElement {

  // ── load: montar a cena, preparar o WebGL ────────────────
  async load({ data, renderType } = {}) {
    this.innerHTML = HTML;
    this.root = this.querySelector('.card');
    this.el = {
      canvas: this.querySelector('.card-canvas'),
      backdrop: this.querySelector('.card-backdrop'),
      ghost: this.querySelector('.card-ghost'),
      kicker: this.querySelector('.card-kicker'),
      name: this.querySelector('.card-name'),
      sub: this.querySelector('.card-sub'),
      underline: this.querySelector('.card-underline'),
    };
    this.onAir = false;
    // O que a timeline anima e o shader lê.
    this.state = { reveal: 0, exit: 0 };

    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await Promise.all(FONTS.map((font) => document.fonts.load(font)));
    await this.setupGl();

    this.renderType = renderType;
    this.initialData = data;
    if (renderType === 'non-realtime') {
      this.master = gsap.timeline({ paused: true });
    }
    this.applyData(data);
    this.render(0);
    return { statusCode: 200 };
  }

  // ── playAction: o Take ──────────────────────────────────
  async playAction({ goto, delta, skipAnimation } = {}) {
    // Um passo só. Um Play depois do último passo tira do ar.
    const step = goto ?? (this.onAir ? 0 : -1) + (delta ?? 1);
    if (step >= 1) {
      await this.stopAction({ skipAnimation });
      return { statusCode: 200, currentStep: undefined };
    }
    this.onAir = true;
    this.startLoop();
    await this.run(this.entrance(), skipAnimation);
    return { statusCode: 200, currentStep: 0 };
  }

  // ── stopAction: o Take Out ──────────────────────────────
  async stopAction({ skipAnimation } = {}) {
    this.onAir = false;
    await this.run(this.exit(), skipAnimation);
    // Fora do ar, o laço para: nada de gastar a placa de vídeo
    // desenhando uma tela vazia. Um Play no meio da saída religa.
    if (!this.onAir) {
      this.stopLoop();
      this.render(0);
    }
    return { statusCode: 200 };
  }

  // ── updateAction: trocar o texto com o gráfico no ar ────
  async updateAction({ data, skipAnimation } = {}) {
    if (skipAnimation || !this.onAir) {
      this.applyData(data);
      return { statusCode: 200 };
    }
    const texts = this.querySelectorAll('.card-up, .card-name');
    await this.run(gsap.timeline()
      .to(texts, { autoAlpha: 0, y: -10, duration: 0.15, ease: 'power2.in' })
      .call(() => this.applyData(data))
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
    this.applyData(this.initialData);
    this.master.seek(0);
    this.master.seek(timestamp / 1000, false);
    // O mesmo instante vai para o shader: o quadro sai igual,
    // não importa quanto tempo o renderizador leve entre um e outro.
    this.render(timestamp / 1000);
    return { statusCode: 200 };
  }

  timelineFor({ type, params = {} }) {
    if (type === 'playAction') return this.entrance();
    if (type === 'stopAction') return this.exit();
    if (type === 'updateAction') {
      return gsap.timeline().call(() => this.applyData(params.data));
    }
    return null;
  }

  // ── dispose: devolver a placa de vídeo ──────────────────
  async dispose() {
    this.stopLoop();
    this.animation?.kill();
    this.master?.kill();
    if (this.gl) {
      this.gl.deleteProgram(this.program);
      // Libera o contexto na hora, sem esperar o navegador.
      this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  // ───────────────────────────────────────────────────────
  // Daqui para baixo, funções nossas: não são da spec.
  // ───────────────────────────────────────────────────────

  applyData(data = {}) {
    const [kicker, sub] = this.querySelectorAll('.card-up');
    if (data.kicker !== undefined) kicker.textContent = data.kicker;
    if (data.title !== undefined) this.el.name.textContent = data.title;
    if (data.subtitle !== undefined) sub.textContent = data.subtitle;
  }

  // Pede o contexto WebGL e monta o programa. Se algo falhar, o
  // gráfico vai ao ar com o plano B do CSS em vez de uma tela vazia.
  async setupGl() {
    const { canvas } = this.el;
    this.gl = canvas.getContext('webgl2', {
      alpha: true,               // fundo transparente: o vídeo aparece
      premultipliedAlpha: true,  // a cor sai multiplicada pelo alfa
      antialias: false,          // o shader já suaviza as bordas
    });
    if (!this.gl) {
      console.error('Sem WebGL 2: a cartela usa o plano B do CSS.');
      return;
    }
    try {
      const response = await fetch(SHADER_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status} em ${SHADER_URL}`);
      this.fragmentSource = await response.text();
      this.setupProgram();
    } catch (error) {
      console.error('Shader com problema: a cartela usa o plano B do CSS.', error);
      this.program = null;
      return;
    }
    // A placa de vídeo pode tirar o contexto (driver, falta de
    // memória). preventDefault avisa que queremos ele de volta.
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.program = null;
    });
    canvas.addEventListener('webglcontextrestored', () => this.setupProgram());
  }

  // Compila o shader e manda o que não muda: o tamanho e as cores.
  setupProgram() {
    const gl = this.gl;
    this.program = createProgram(gl, FULL_SCREEN_VERTEX, this.fragmentSource);
    gl.useProgram(this.program);
    this.uniforms = {};
    for (const name of UNIFORMS) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }
    gl.uniform2f(this.uniforms.u_resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
    for (const [uniform, token] of Object.entries(COLORS)) {
      gl.uniform3fv(this.uniforms[uniform], tokenColor(this.root, token));
    }
  }

  // Desenha um quadro no instante `time`, em segundos.
  render(time) {
    const { reveal, exit } = this.state;
    this.root.classList.toggle('no-webgl', !this.program);
    if (!this.program) {
      // Plano B: sem placa de vídeo, nada de varredura. O fundo
      // só aparece e some, com a opacidade, que custa pouco.
      this.el.backdrop.style.opacity = reveal * (1 - exit);
      return;
    }
    const gl = this.gl;
    gl.uniform1f(this.uniforms.u_time, time);
    gl.uniform1f(this.uniforms.u_reveal, reveal);
    gl.uniform1f(this.uniforms.u_exit, exit);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // O laço de tempo real: um quadro a cada atualização da tela.
  startLoop() {
    if (this.frame) return;
    const start = performance.now();
    const tick = (now) => {
      this.render((now - start) / 1000);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  stopLoop() {
    cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  // Roda uma timeline e espera o fim (capítulo 16).
  async run(timeline, skipAnimation = false) {
    this.animation?.progress(1);
    this.animation = timeline;
    if (skipAnimation) timeline.progress(1);
    await timeline;
  }

  entrance() {
    const { ghost, kicker, name, sub, underline } = this.el;
    return gsap.timeline()
      .set(this.root, { autoAlpha: 1 })
      // O fundo: o shader varre a tela com as lâminas.
      .set(this.state, { exit: 0 }, 0)
      .fromTo(this.state, { reveal: 0 }, { reveal: 1, duration: 1.0, ease: 'none' }, 0)
      // O texto: o mesmo vocabulário da lower third.
      .fromTo(kicker, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.45, ease: 'expo.out' }, 0.45)
      .fromTo(name, { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, 0.5)
      .fromTo(ghost, { autoAlpha: 0, y: 60 }, { autoAlpha: 0.28, y: 0, duration: 0.6, ease: 'expo.out' }, 0.6)
      .fromTo(sub, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.5, ease: 'expo.out' }, 0.65)
      .fromTo(underline, { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, duration: 0.55, ease: 'expo.out' }, 0.75);
  }

  exit() {
    const { ghost, kicker, name, sub, underline } = this.el;
    return gsap.timeline()
      .to([kicker, sub], { clipPath: GONE, duration: 0.25, ease: 'power3.in' }, 0)
      .to(name, { yPercent: 115, duration: 0.25, ease: 'power3.in' }, 0)
      .to([ghost, underline], { autoAlpha: 0, duration: 0.2, ease: 'power3.in' }, 0)
      .fromTo(this.state, { exit: 0 }, { exit: 1, duration: 0.5, ease: 'none' }, 0.1)
      .set(this.root, { autoAlpha: 0 });
  }
}
