// Hashtag: a tag da cobertura. Na troca, a nova entra letra
// por letra, com o SplitText (capítulo 14).

import { NewsGraphic, gsap } from './base.mjs';
import { SplitText } from './lib/gsap/SplitText.js';

gsap.registerPlugin(SplitText);

export default class Hashtag extends NewsGraphic {
  static css = new URL('./hashtag.css', import.meta.url).href;

  html() {
    return `<div class="tag"><div class="tag-plate"><span class="tag-up">
      <span class="tag-hash">#</span><span class="tag-text"></span>
      </span></div></div>`;
  }

  // O operador pode digitar com ou sem "#": o gráfico tira.
  render(data) {
    const tag = String(data.tag ?? '').replace(/^#+/, '');
    this.$('.tag-text').textContent = tag;
  }

  entrance() {
    return gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set(this.$('.tag'), { autoAlpha: 1 })
      .fromTo(this.$('.tag-plate'),
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55 }, 0.08)
      .fromTo(this.$('.tag-up'), { yPercent: 160 },
        { yPercent: 0, duration: 0.6 }, 0.2);
  }

  exit() {
    return gsap.timeline()
      .to(this.$('.tag-plate'), {
        clipPath: 'inset(0% 100% 0% 0%)', duration: 0.35,
        ease: 'power3.in',
      })
      .set(this.$('.tag'), { autoAlpha: 0 });
  }

  // Troca no ar. As letras só existem depois que o texto novo
  // entra, então a timeline reserva o tempo delas com um
  // intervalo vazio: assim ela só termina quando as letras
  // terminam, e a resposta sai na hora certa (capítulo 16).
  swap(newData) {
    // TODO 2 — A troca letra por letra (seção 23.2). Por enquanto,
    //          só um corte seco.
    return gsap.timeline().call(() => this.applyData(newData));
  }

  lettersIn(newData) {
    const text = this.$('.tag-text');
    this.applyData(newData);
    gsap.set(text, { autoAlpha: 1 });
    const split = SplitText.create(text, { type: 'chars' });
    gsap.from(split.chars, {
      autoAlpha: 0, yPercent: 60, duration: 0.3,
      ease: 'power2.out', stagger: 0.03,
      onComplete: () => split.revert(),
    });
  }
}
