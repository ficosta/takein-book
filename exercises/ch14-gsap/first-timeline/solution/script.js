// CAPÍTULO 14 — A primeira timeline. Solução.

import { gsap } from './lib/gsap/index.js';

const tl = gsap.timeline({ paused: true })
  .from('.res-title', {
    x: -60, autoAlpha: 0, duration: 0.5, ease: 'expo.out',
  })
  .from('.res-underline', {
    scaleX: 0, transformOrigin: 'left',
    duration: 0.4, ease: 'expo.out',
  }, '-=0.2')
  .addLabel('cards')
  .from('.res-card', {
    y: 30, autoAlpha: 0, duration: 0.4,
    ease: 'expo.out', stagger: 0.12,
  }, 'cards');

document.querySelector('#play').onclick =
  () => tl.timeScale(1).play(0);
document.querySelector('#reverse').onclick =
  () => tl.reverse();
document.querySelector('#slow').onclick =
  () => tl.timeScale(0.25).play(0);
