// Locator: a situação (ao vivo, gravado, reprise), a cidade e a
// sigla do estado, vazada atrás da placa.

import { NewsGraphic, gsap } from './base.mjs';

const LABELS = { live: 'Ao vivo', recorded: 'Gravado', rerun: 'Reprise' };

export default class Locator extends NewsGraphic {
  static css = new URL('./locator.css', import.meta.url).href;

  html() {
    return `<div class="loc">
      <div class="loc-ghost"></div>
      <div class="loc-box">
        <span class="loc-status"><i class="loc-dot"></i>
          <span class="loc-label"></span></span>
        <span class="loc-city"></span>
      </div></div>`;
  }

  render(data) {
    const status = data.status ?? 'live';
    this.$('.loc-status').className = `loc-status ${status}`;
    this.$('.loc-label').textContent = LABELS[status] ?? '';
    this.$('.loc-city').textContent = data.city ?? '';
    // Sem sigla, sem fantasma.
    this.$('.loc-ghost').textContent = data.state ?? '';
  }

  entrance() {
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set(this.$('.loc'), { autoAlpha: 1 })
      .fromTo(this.$('.loc-box'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55 }, 0.08)
      .fromTo([this.$('.loc-status'), this.$('.loc-city')],
        { yPercent: 160 },
        { yPercent: 0, duration: 0.6, stagger: 0.08 }, 0.2)
      .fromTo(this.$('.loc-ghost'), { autoAlpha: 0, y: 60 },
        { autoAlpha: 0.28, y: 0, duration: 0.6 }, 0.3);
  }

  exit() {
    return gsap.timeline({ defaults: { ease: 'power3.in' } })
      .to(this.$('.loc-ghost'), { autoAlpha: 0, duration: 0.25 }, 0)
      .to(this.$('.loc-box'), {
        clipPath: 'inset(0% 100% 0% 0%)', duration: 0.35,
      }, 0.05)
      .set(this.$('.loc'), { autoAlpha: 0 });
  }

  swap(newData) {
    const parts = ['.loc-status', '.loc-city', '.loc-ghost'].map((s) => this.$(s));
    return gsap.timeline()
      .to(parts, { autoAlpha: 0, duration: 0.15, ease: 'power3.in' })
      .call(() => this.applyData(newData))
      .to(parts.slice(0, 2), { autoAlpha: 1, duration: 0.25 })
      .to(parts[2], { autoAlpha: 0.28, duration: 0.25 }, '<');
  }
}
