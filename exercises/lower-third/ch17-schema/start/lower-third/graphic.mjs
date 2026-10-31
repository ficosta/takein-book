/**
 * Lower third — o Web Component OGraf.
 *
 * Atende aos dois modos do manifest: tempo real (o playout manda
 * cada ação na hora) e fora do tempo real (o renderizador manda a
 * agenda e pede um quadro de cada vez). Seção 16.7.
 *
 * O renderizador (edge.playout, CasparCG, SPX…) importa este
 * arquivo, cria o elemento e chama, nesta ordem:
 *
 *   load → playAction → updateAction (0 ou mais) → stopAction
 *        → dispose
 *
 * Numa plataforma gráfica: carregar a cena → Take → Update → Take Out →
 * descarregar.
 *
 * Não chame customElements.define() aqui: quem escolhe o nome
 * da tag é o renderizador.
 */

import { gsap } from './lib/gsap/index.js';

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;

// A árvore de cena do capítulo 4, agora dentro do componente.
const HTML = `
  <link rel="stylesheet" href="${TOKENS_URL}">
  <link rel="stylesheet" href="${CSS_URL}">
  <div class="lt">
    <div class="lt-ghost"></div>
    <div class="lt-kicker"><span class="lt-role"></span></div>
    <div class="lt-bar"><div class="lt-name"></div></div>
    <div class="lt-sub">
      <span class="lt-team"></span>
      <span class="lt-dot"></span>
      <span class="lt-shirt"></span>
    </div>
    <div class="lt-underline"></div>
  </div>
`;

// Espera o arquivo CSS terminar de carregar.
function waitForCss(link) {
  return new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });
}

export default class LowerThird extends HTMLElement {

  // ── load: montar a cena e receber os dados ──────────────
  async load({ data, renderType } = {}) {
    this.innerHTML = HTML;
    this.el = {
      lt:        this.querySelector('.lt'),
      ghost:     this.querySelector('.lt-ghost'),
      kicker:    this.querySelector('.lt-kicker'),
      role:      this.querySelector('.lt-role'),
      bar:       this.querySelector('.lt-bar'),
      name:      this.querySelector('.lt-name'),
      sub:       this.querySelector('.lt-sub'),
      team:      this.querySelector('.lt-team'),
      shirt:     this.querySelector('.lt-shirt'),
      underline: this.querySelector('.lt-underline'),
    };
    this.onAir = false;

    // Fora do tempo real, o relógio é do renderizador: uma
    // timeline-mestra parada, que só anda com seek (seção 16.7).
    this.renderType = renderType;
    this.initialData = data;
    if (renderType === 'non-realtime') {
      this.master = gsap.timeline({ paused: true });
    }

    // Os dois CSS (tokens e estilo) e as fontes, antes de responder.
    const links = [...this.querySelectorAll('link')];
    await Promise.all(links.map(waitForCss));
    await Promise.all([
      document.fonts.load('58px Anton'),
      document.fonts.load('600 22px "Barlow Condensed"'),
      document.fonts.load('700 20px "Barlow Condensed"'),
    ]);

    this.applyData(data);
    return { statusCode: 200 };
  }

  // ── playAction: o Take ─────────────────────────────────
  async playAction({ goto, delta, skipAnimation } = {}) {
    // Um passo só (stepCount: 1). Pela spec, um Play que passa
    // do último passo leva o gráfico ao fim: sai do ar.
    const step = goto ?? (this.onAir ? 0 : -1) + (delta ?? 1);
    if (step >= 1) {
      await this.stopAction({ skipAnimation });
      return { statusCode: 200, currentStep: undefined };
    }

    this.onAir = true;
    await this.run(this.entrance(), skipAnimation);
    return { statusCode: 200, currentStep: 0 };
  }

  // ── stopAction: o Take Out ─────────────────────────────
  async stopAction({ skipAnimation } = {}) {
    this.onAir = false;
    // Só responde quando a saída terminou. Se respondesse
    // antes, o playout limparia a camada no meio da animação.
    await this.run(this.exit(), skipAnimation);
    return { statusCode: 200 };
  }

  // ── updateAction: trocar dados com o gráfico no ar ─────
  async updateAction({ data, skipAnimation } = {}) {
    if (skipAnimation || !this.onAir) {
      this.applyData(data);
      return { statusCode: 200 };
    }

    const { name, role, team, shirt, ghost } = this.el;
    const texts = [name, role, team, shirt];
    await this.run(gsap.timeline()
      .to(texts, {
        autoAlpha: 0, y: -10, duration: 0.15, ease: 'power2.in',
      })
      .to(ghost, { opacity: 0, duration: 0.15 }, '<')
      .call(() => this.applyData(data))
      .fromTo(texts, { y: 10 }, {
        autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out',
      })
      .to(ghost, { opacity: 0.28, duration: 0.25 }, '<'));
    return { statusCode: 200 };
  }

  // ── customAction: esta lower third não tem nenhuma ─────
  async customAction({ id } = {}) {
    return {
      statusCode: 404,
      statusMessage: `Ação desconhecida: ${id}`,
    };
  }

  // ── dispose: descarregar a cena ────────────────────────
  async dispose() {
    this.animation?.kill();
    this.master?.kill();
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  // ── setActionsSchedule: a agenda, fora do tempo real ───
  async setActionsSchedule({ schedule = [] } = {}) {
    this.master.clear();
    for (const { timestamp, action } of schedule) {
      const timeline = this.timelineFor(action);
      if (timeline) this.master.add(timeline, timestamp / 1000);
    }
  }

  // ── goToTime: desenhar o quadro de um instante ─────────
  async goToTime({ timestamp }) {
    // Volta ao começo, com os dados do load, sem disparar nada...
    this.applyData(this.initialData);
    this.master.seek(0);
    // ...e anda até o instante, disparando cada .call() no caminho.
    this.master.seek(timestamp / 1000, false);
    return { statusCode: 200 };
  }

  // ───────────────────────────────────────────────────────
  // Daqui para baixo, funções nossas: não são da spec.
  // ───────────────────────────────────────────────────────

  // Põe os dados na tela. Campo ausente = não mexe.
  applyData(data = {}) {
    const { lt, name, role, team, shirt, ghost } = this.el;
    if (data.name !== undefined) name.textContent = data.name;
    if (data.role !== undefined) role.textContent = data.role;
    if (data.team !== undefined) team.textContent = data.team;
    if (data.number !== undefined) {
      ghost.textContent = data.number;
      shirt.textContent = `CAMISA ${data.number}`;
    }
    if (data.color !== undefined) {
      lt.style.setProperty('--accent', data.color);
    }
  }

  // Roda uma timeline e espera o fim. Com skipAnimation, pula
  // direto para o último quadro.
  async run(timeline, skipAnimation = false) {
    // Uma animação anterior ainda rodando vai para o fim, e
    // quem esperava por ela também recebe a resposta.
    this.animation?.progress(1);
    this.animation = timeline;
    if (skipAnimation) timeline.progress(1);
    await timeline;
  }

  // A timeline de cada ação da agenda (fora do tempo real).
  timelineFor({ type, params = {} }) {
    if (type === 'playAction') return this.entrance();
    if (type === 'stopAction') return this.exit();
    if (type === 'updateAction') {
      return gsap.timeline().call(() => this.applyData(params.data));
    }
    return null; // esta lower third não tem customActions
  }

  // A entrada do capítulo 14.
  entrance() {
    const { lt, bar, name, ghost } = this.el;
    const { kicker, sub, underline } = this.el;
    const closed = 'inset(0% 100% 0% 0%)';
    const open = 'inset(0% 0% 0% 0%)';

    return gsap.timeline()
      .set(lt, { autoAlpha: 1 })
      .fromTo(bar, { clipPath: closed }, {
        clipPath: open, duration: 0.55, ease: 'expo.out',
      }, 0.08)
      .fromTo(name, { yPercent: 115 }, {
        yPercent: 0, duration: 0.6, ease: 'expo.out',
      }, 0.2)
      .fromTo(ghost, { opacity: 0, y: 60 }, {
        opacity: 0.28, y: 0, duration: 0.6, ease: 'expo.out',
      }, 0.3)
      .fromTo(kicker, { clipPath: closed }, {
        clipPath: open, duration: 0.45, ease: 'expo.out',
      }, 0.32)
      .fromTo(sub, { clipPath: closed }, {
        clipPath: open, duration: 0.5, ease: 'expo.out',
      }, 0.4)
      .fromTo(underline, { scaleX: 0 }, {
        scaleX: 1, duration: 0.55, ease: 'expo.out',
      }, 0.48);
  }

  // A saída do capítulo 14.
  exit() {
    const { lt, bar, ghost, kicker, sub, underline } = this.el;
    const gone = 'inset(0% 0% 0% 100%)';

    return gsap.timeline()
      .to(underline, {
        scaleX: 0, duration: 0.25, ease: 'power3.in',
      }, 0)
      .to(sub, {
        clipPath: gone, duration: 0.3, ease: 'power3.in',
      }, 0.03)
      .to(kicker, {
        clipPath: gone, duration: 0.3, ease: 'power3.in',
      }, 0.06)
      .to(ghost, {
        opacity: 0, duration: 0.3, ease: 'power3.in',
      }, 0.06)
      .to(bar, {
        clipPath: gone, duration: 0.3, ease: 'power3.in',
      }, 0.1)
      .set(lt, { autoAlpha: 0 });
  }
}
