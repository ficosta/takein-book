// Lower third do pacote. A cor não é campo: ela vem da pele, no
// tokens.css, e é igual em todos os gráficos.

import { NewsGraphic, gsap } from './base.mjs';

const CLOSED = 'inset(0% 100% 0% 0%)';
const OPEN = 'inset(0% 0% 0% 0%)';

export default class LowerThird extends NewsGraphic {
  static css = new URL('./lower-third.css', import.meta.url).href;

  html() {
    return `
      <div class="lt">
        <div class="lt-kicker">
          <span class="lt-up"><span class="lt-role"></span></span>
        </div>
        <div class="lt-bar">
          <span class="lt-up"><span class="lt-name"></span></span>
        </div>
        <div class="lt-sub">
          <span class="lt-up"><span class="lt-detail"></span></span>
        </div>
        <div class="lt-underline"></div>
      </div>`;
  }

  render(data) {
    this.$('.lt-name').textContent = data.name ?? '';
    this.$('.lt-role').textContent = data.role ?? '';
    this.$('.lt-detail').textContent = data.detail ?? '';
  }

  // Placa → nome → faixas → sublinhado, como na referência.
  entrance() {
    const $ = (s) => this.$(s);
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set($('.lt'), { autoAlpha: 1 })
      .fromTo($('.lt-bar'), { clipPath: CLOSED },
        { clipPath: OPEN, duration: 0.55 }, 0.08)
      .fromTo($('.lt-name'), { yPercent: 115 },
        { yPercent: 0, duration: 0.6 }, 0.2)
      .fromTo($('.lt-kicker'), { clipPath: CLOSED },
        { clipPath: OPEN, duration: 0.45 }, 0.32)
      .fromTo($('.lt-sub'), { clipPath: CLOSED },
        { clipPath: OPEN, duration: 0.5 }, 0.4)
      .fromTo($('.lt-underline'), { scaleX: 0 },
        { scaleX: 1, duration: 0.55 }, 0.48);
  }

  // Tudo junto, na ordem inversa, em 0,4 s.
  exit() {
    const $ = (s) => this.$(s);
    return gsap.timeline({ defaults: { ease: 'power3.in' } })
      .to($('.lt-underline'), { scaleX: 0, duration: 0.25 }, 0)
      .to([$('.lt-sub'), $('.lt-kicker')],
        { clipPath: CLOSED, duration: 0.3 }, 0.05)
      .to($('.lt-bar'), { clipPath: CLOSED, duration: 0.3 }, 0.1)
      .set($('.lt'), { autoAlpha: 0 });
  }

  swap(newData) {
    const texts = ['.lt-name', '.lt-role', '.lt-detail'].map((s) => this.$(s));
    return gsap.timeline()
      .to(texts, {
        autoAlpha: 0, yPercent: -40, duration: 0.15, ease: 'power3.in',
      })
      .call(() => this.applyData(newData))
      .fromTo(texts, { yPercent: 40 },
        { autoAlpha: 1, yPercent: 0, duration: 0.3, ease: 'expo.out' });
  }
}
