// Bug AO VIVO + relógio — um gráfico OGraf completo, sem biblioteca:
// a animação é uma transição de CSS (capítulo 13).

const TOKENS_URL = new URL('./tokens.css', import.meta.url).href;
const CSS_URL = new URL('./style.css', import.meta.url).href;

// Espera "ms" milissegundos (capítulo 11).
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Espera um <link> de CSS terminar de carregar.
const waitForCss = (link) => new Promise((resolve) => {
  if (link.sheet) return resolve();
  link.addEventListener('load', resolve, { once: true });
  link.addEventListener('error', resolve, { once: true });
});

// A hora do computador, no formato 19:42.
const now = () => new Date().toLocaleTimeString('pt-BR',
  { hour: '2-digit', minute: '2-digit' });

export default class LiveBug extends HTMLElement {

  async load({ data } = {}) {
    this.innerHTML = `
      <link rel="stylesheet" href="${TOKENS_URL}">
      <link rel="stylesheet" href="${CSS_URL}">
      <div class="bug" data-skin="news">
        <div class="bug-plates">
          <div class="bug-live"><span class="bug-up">
            <i class="bug-dot"></i><span class="bug-label"></span></span></div>
          <div class="bug-clock"><span class="bug-up bug-time"></span></div>
        </div>
      </div>`;
    this.bug = this.querySelector('.bug');
    this.label = this.querySelector('.bug-label');
    this.time = this.querySelector('.bug-time');
    this.label.textContent = data?.text ?? 'AO VIVO';

    // O relógio acerta a hora a cada segundo, até o dispose.
    this.time.textContent = now();
    this.timer = setInterval(() => {
      this.time.textContent = now();
    }, 1000);

    // Só responde com o CSS e as fontes prontos (seção 15.4).
    await Promise.all([...this.querySelectorAll('link')].map(waitForCss));
    await document.fonts.load(`38px Anton`);
    await document.fonts.load(`700 22px "Barlow Condensed"`);
    return { statusCode: 200 };
  }

  async playAction({ skipAnimation } = {}) {
    this.instant(skipAnimation);
    this.bug.classList.add('on-air');
    if (!skipAnimation) await wait(400);   // a duração da entrada
    return { statusCode: 200, currentStep: 0 };
  }

  async stopAction({ skipAnimation } = {}) {
    this.instant(skipAnimation);
    this.bug.classList.remove('on-air');
    if (!skipAnimation) await wait(250);   // a duração da saída
    return { statusCode: 200 };
  }

  // Sem animação (capítulo 16): desliga a transição só desta vez.
  instant(skipAnimation) {
    this.querySelector('.bug-plates').style.transition = skipAnimation ? 'none' : '';
  }

  async updateAction({ data } = {}) {
    if (data?.text !== undefined) this.label.textContent = data.text;
    return { statusCode: 200 };
  }

  async customAction({ id } = {}) {
    return {
      statusCode: 404,
      statusMessage: `Ação desconhecida: ${id}`,
    };
  }

  async dispose() {
    clearInterval(this.timer);      // um relógio esquecido continua rodando
    this.innerHTML = '';
    return { statusCode: 200 };
  }
}
