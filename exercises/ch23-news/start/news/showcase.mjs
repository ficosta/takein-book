// A vitrine do pacote: as cores e as fontes dos tokens na tela.
// Ela mostra também qual pele está vestida: sem o data-skin,
// a mesma vitrine sai com as cores da pele liga.

import { NewsGraphic, gsap } from './base.mjs';

const COLORS = ['ink', 'ink-2', 'primary', 'accent', 'paper', 'dim',
  'live'];

export default class Showcase extends NewsGraphic {
  static css = new URL('./showcase.css', import.meta.url).href;

  html() {
    const swatches = COLORS.map((c) => `
      <div class="sc-swatch"><div class="sc-plate">
        <div class="sc-chip" style="background: var(--${c})"></div>
        <div class="sc-name"><span class="sc-up">--${c}</span></div>
      </div></div>`).join('');
    return `<div class="sc">
      <div class="sc-kicker"><span class="sc-up">TOKENS.CSS</span></div>
      <div class="sc-bar">
        <span class="sc-up"><span class="sc-title"></span></span>
      </div>
      <div class="sc-sub"><span class="sc-up sc-skin"></span></div>
      <div class="sc-swatches">${swatches}</div>
      <div class="sc-type">
        <span class="sc-up sc-display">Anton 0123</span>
        <span class="sc-up sc-data">Barlow Condensed · rótulos e dados</span>
      </div></div>`;
  }

  render(data) {
    this.$('.sc-title').textContent = data.title ?? '';
    const skin = this.root.dataset.skin ?? 'liga';
    this.$('.sc-skin').textContent = `Pele ${skin}`;
  }

  entrance() {
    const $ = (s) => this.$(s);
    const reveal = { clipPath: 'inset(0 100% 0 0)' };
    const open = { clipPath: 'inset(0 0% 0 0)' };
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set($('.sc'), { autoAlpha: 1 })
      .fromTo($('.sc-bar'), reveal, { ...open, duration: 0.55 }, 0.08)
      .fromTo($('.sc-title'), { yPercent: 115 },
        { yPercent: 0, duration: 0.6 }, 0.2)
      .fromTo($('.sc-kicker'), reveal, { ...open, duration: 0.45 }, 0.32)
      .fromTo($('.sc-sub'), reveal, { ...open, duration: 0.5 }, 0.4)
      .fromTo(this.root.querySelectorAll('.sc-swatch'),
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.45)
      .fromTo($('.sc-type'), reveal, { ...open, duration: 0.55 }, 0.7);
  }

  exit() {
    return gsap.timeline()
      .to(this.$('.sc'), {
        autoAlpha: 0, y: 20, duration: 0.35, ease: 'power3.in',
      })
      .set(this.$('.sc'), { y: 0 });
  }
}
