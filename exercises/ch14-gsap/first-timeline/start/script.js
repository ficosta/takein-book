// CAPÍTULO 14 — A primeira timeline. Complete os TODO.

import { gsap } from './lib/gsap/index.js';

// paused: true → a timeline espera alguém mandar tocar.
const tl = gsap.timeline({ paused: true })

  // 1. O título vem da esquerda e aparece.
  .from('.res-title', {
    x: -60, autoAlpha: 0, duration: 0.5, ease: 'expo.out',
  })

  // TODO 1 — O sublinhado cresce da esquerda para a direita,
  //          começando 0,2 s antes de o título acabar:
  //   .from('.res-underline', { scaleX: 0, transformOrigin: 'left',
  //     duration: 0.4, ease: 'expo.out' }, '-=0.2')

  // TODO 2 — Um marcador com nome nesta posição:
  //   .addLabel('cards')

  // TODO 3 — Os três cartões sobem, um depois do outro, com
  //          0,12 s entre eles, a partir do marcador:
  //   .from('.res-card', { y: 30, autoAlpha: 0, duration: 0.4,
  //     ease: 'expo.out', stagger: 0.12 }, 'cards')
  ;

document.querySelector('#play').onclick =
  () => tl.timeScale(1).play(0);

// TODO 4 — "Voltar" toca a timeline de trás para frente:
//   tl.reverse()

// TODO 5 — "Câmera lenta" toca do começo a um quarto da
//          velocidade:  tl.timeScale(0.25).play(0)
