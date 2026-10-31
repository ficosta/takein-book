/**
 * Lower third — CAPÍTULO 16: o ciclo de vida. Complete os TODO.
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
  async load({ data } = {}) {
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

    // TODO 4 (desafio, seção 16.7) — Fora do tempo real. Receba
    //          também o renderType no load e guarde o que o
    //          goToTime vai precisar:
    //   this.renderType = renderType;
    //   this.initialData = data;
    //   if (renderType === 'non-realtime') {
    //     this.master = gsap.timeline({ paused: true });
    //   }
    // Depois escreva o setActionsSchedule e o goToTime (lá embaixo)
    // e ligue "supportsNonRealTime": true no manifest.

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
  async playAction({ skipAnimation } = {}) {
    // TODO 1 — Marque que o gráfico está no ar
    //          (this.onAir = true), rode a entrada ESPERANDO o
    //          fim, e respeite o skipAnimation:
    //   await this.run(this.entrance(), skipAnimation);
    //          Se já estiver no ar, um segundo Play tira do ar
    //          (seção 16.6): rode a saída em vez da entrada e
    //          devolva { statusCode: 200, currentStep: undefined }.
    this.entrance();
    return { statusCode: 200, currentStep: 0 };
  }

  // ── stopAction: o Take Out ─────────────────────────────
  async stopAction({ skipAnimation } = {}) {
    // TODO 2 — A regra de ouro: só responda quando a saída
    //          terminar. Marque this.onAir = false e use
    //          await this.run(...) como no TODO 1.
    this.exit();
    return { statusCode: 200 };
  }

  // ── updateAction: trocar dados com o gráfico no ar ─────
  async updateAction({ data, skipAnimation } = {}) {
    // TODO 3 (desafio) — Se o gráfico estiver no ar e não
    //          houver skipAnimation, faça os textos sumirem,
    //          troque os dados e faça-os voltar, numa timeline
    //          curta. Veja a solução se travar.
    this.applyData(data);
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
    this.innerHTML = '';
    return { statusCode: 200 };
  }

  // TODO 4 (continuação) — Os dois métodos de fora do tempo real,
  //          como na seção 16.7:
  //   async setActionsSchedule({ schedule = [] } = {}) { ... }
  //     limpa a mestra e põe nela, em cada timestamp / 1000,
  //     a timeline que o timelineFor(action) devolve.
  //   async goToTime({ timestamp }) { ... }
  //     aplica os dados do load, seek(0), e depois
  //     seek(timestamp / 1000, false). Responde com statusCode 200.

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
