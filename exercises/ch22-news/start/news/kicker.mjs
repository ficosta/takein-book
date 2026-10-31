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
    // TODO — escreva a timeline de entrada (seção 22.3).
    return gsap.timeline();
  }

  exit() {
    // TODO — escreva a timeline de saída (seção 22.3).
    return gsap.timeline();
  }

  swap(newData) {
    // TODO — escreva a timeline de troca (seção 22.3).
    return gsap.timeline().call(() => this.applyData(newData));
  }
}
