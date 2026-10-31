// CAPÍTULO 14 — Letra por letra. Complete os TODO.

import { gsap } from './lib/gsap/index.js';
import { SplitText } from './lib/gsap/SplitText.js';

gsap.registerPlugin(SplitText);

// Antes de cortar o texto em letras, espere a fonte carregar:
// cada letra é medida no corte.
await document.fonts.ready;

// Corta a manchete em letras. Cada letra vira um elemento, e
// split.chars é a lista delas. mask: 'chars' põe cada letra
// dentro de uma máscara: ela entra "de dentro", sem aparecer
// fora da linha.
const split = SplitText.create('.strap-title', {
  type: 'chars', mask: 'chars',
});

function entrance() {
  // TODO 1 — Anime split.chars de { yPercent: 100,
  //          autoAlpha: 0 } até o normal, com duration 0.5,
  //          ease 'expo.out' e stagger 0.04.
}

entrance();

// TODO 2 — O botão "Repetir" chama entrance() de novo.
