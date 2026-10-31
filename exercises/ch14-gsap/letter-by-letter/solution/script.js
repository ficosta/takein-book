// CAPÍTULO 14 — Letra por letra. Solução.

import { gsap } from './lib/gsap/index.js';
import { SplitText } from './lib/gsap/SplitText.js';

gsap.registerPlugin(SplitText);

await document.fonts.ready;

const split = SplitText.create('.strap-title', {
  type: 'chars', mask: 'chars',
});

function entrance() {
  gsap.fromTo(split.chars,
    { yPercent: 100, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, duration: 0.5,
      ease: 'expo.out', stagger: 0.04 });
}

entrance();

document.querySelector('#replay').onclick = entrance;
