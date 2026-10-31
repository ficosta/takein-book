// Kicker: o tema da matéria e a manchete, numa barra larga.

import { NewsGraphic, gsap } from './base.mjs';

export default class Kicker extends NewsGraphic {
  static css = new URL('./kicker.css', import.meta.url).href;

  html() {
    return `<div class="kck">
      <div class="kck-bar">
        <div class="kck-theme">
          <span class="kck-up"><span class="kck-theme-text"></span></span>
        </div>
        <div class="kck-box"><div class="kck-text"></div></div>
      </div>
      <div class="kck-underline"></div></div>`;
  }

  render(data) {
    this.$('.kck-theme-text').textContent = data.theme ?? '';
    this.$('.kck-text').textContent = data.text ?? '';
  }

  entrance() {
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set(this.$('.kck'), { autoAlpha: 1 })
      .fromTo(this.$('.kck-bar'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6 }, 0.08)
      .fromTo([this.$('.kck-theme-text'), this.$('.kck-text')],
        { yPercent: 115 },
        { yPercent: 0, duration: 0.6, stagger: 0.1 }, 0.2)
      .fromTo(this.$('.kck-underline'), { scaleX: 0 },
        { scaleX: 1, duration: 0.55 }, 0.48);
  }

  exit() {
    return gsap.timeline({ defaults: { ease: 'power3.in' } })
      .to(this.$('.kck-underline'), { scaleX: 0, duration: 0.25 }, 0)
      .to(this.$('.kck-bar'), {
        clipPath: 'inset(0% 100% 0% 0%)', duration: 0.35,
      }, 0.05)
      .set(this.$('.kck'), { autoAlpha: 0 });
  }

  // Manchete nova: a antiga sobe e sai, a nova sobe e entra.
  swap(newData) {
    const text = this.$('.kck-text');
    return gsap.timeline()
      .to(text, { yPercent: -115, duration: 0.25, ease: 'power3.in' })
      .call(() => this.applyData(newData))
      .fromTo(text, { yPercent: 115 }, {
        yPercent: 0, duration: 0.45, ease: 'expo.out',
      });
  }
}
