// Bug: o selo AO VIVO e a hora de Brasília. O aro do ícone se
// desenha (capítulo 8), o ponto aparece e a hora entra. O relógio
// é do próprio gráfico: liga no setup e desliga no onDispose.

import { NewsGraphic, gsap } from './base.mjs';

const TIME = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
});

export default class Bug extends NewsGraphic {
  static css = new URL('./bug.css', import.meta.url).href;

  html() {
    return `<div class="bug"><div class="bug-plates">
      <div class="bug-live"><span class="bug-up">
        <svg class="bug-icon" viewBox="0 0 24 24">
          <circle class="bug-ring" cx="12" cy="12" r="10" pathLength="1"/>
          <circle class="bug-dot" cx="12" cy="12" r="5"/>
        </svg>
        <span class="bug-label"></span></span></div>
      <div class="bug-clock"><span class="bug-up">
        <span class="bug-time"></span></span></div>
    </div></div>`;
  }

  // Chamado uma vez, no load: o relógio começa a andar.
  setup() {
    const time = this.$('.bug-time');
    const tick = () => { time.textContent = TIME.format(new Date()); };
    tick();
    this.clock = setInterval(tick, 1000);
  }

  onDispose() {
    clearInterval(this.clock);
  }

  render(data) {
    this.$('.bug-label').textContent = data.label ?? '';
    this.$('.bug-clock').hidden = data.showClock === false;
  }

  entrance() {
    const $ = (s) => this.$(s);
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set($('.bug'), { autoAlpha: 1 })
      .fromTo([$('.bug-live'), $('.bug-clock')],
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, stagger: 0.12 }, 0)
      // TODO 1 — O aro se desenha (capítulo 8): de
      //   { strokeDasharray: 1, strokeDashoffset: 1 } para
      //   { strokeDashoffset: 0 }, 0,8 s, 'power2.inOut', aos 0,1 s.
      .fromTo($('.bug-dot'), { scale: 0 }, {
        scale: 1, duration: 0.4, ease: 'back.out(2)',
      }, 0.65)
      .fromTo([$('.bug-label'), $('.bug-time')], { yPercent: 160 },
        { yPercent: 0, duration: 0.6, stagger: 0.1 }, 0.2);
  }

  exit() {
    return gsap.timeline({ defaults: { ease: 'power3.in' } })
      .to([this.$('.bug-clock'), this.$('.bug-live')], {
        clipPath: 'inset(0% 100% 0% 0%)', duration: 0.3, stagger: 0.06,
      })
      .set(this.$('.bug'), { autoAlpha: 0 });
  }
}
