// CAPÍTULO 14 — solução.
// Módulo (type="module" no index.html): abra pelo Live Server.

import { gsap } from './lib/gsap/index.js';

// Os elementos da cena, encontrados uma vez só.
const lt        = document.querySelector('.lt');
const ghost     = document.querySelector('.lt-ghost');
const kicker    = document.querySelector('.lt-kicker');
const role      = document.querySelector('.lt-role');
const bar       = document.querySelector('.lt-bar');
const name      = document.querySelector('.lt-name');
const sub       = document.querySelector('.lt-sub');
const team      = document.querySelector('.lt-team');
const shirt     = document.querySelector('.lt-shirt');
const underline = document.querySelector('.lt-underline');

function fill(d) {
  if (d.name !== undefined) name.textContent = d.name;
  if (d.role !== undefined) role.textContent = d.role;
  if (d.team !== undefined) team.textContent = d.team;
  if (d.number !== undefined) {
    ghost.textContent = d.number;
    shirt.textContent = `CAMISA ${d.number}`;
  }
  if (d.color !== undefined) {
    lt.style.setProperty('--accent', d.color);
  }
}

// A máscara: inset(topo direita base esquerda).
// Direita 100% = tudo recortado; tudo 0% = nada recortado.
const closed = 'inset(0% 100% 0% 0%)';
const open   = 'inset(0% 0% 0% 0%)';

// A entrada: uma timeline, como numa plataforma gráfica. O último
// valor de cada faixa é a posição: o instante, em segundos, em que
// ela começa.
function entrance() {
  return gsap.timeline()
    // 1. Mostra o container (ele começa escondido no CSS).
    .set(lt, { autoAlpha: 1 })
    // 2. A placa do nome revela da esquerda para a direita.
    .fromTo(bar, { clipPath: closed }, {
      clipPath: open, duration: 0.55, ease: 'expo.out',
    }, 0.08)
    // 3. O nome sobe de dentro da placa (ela tem overflow: hidden).
    .fromTo(name, { yPercent: 115 }, {
      yPercent: 0, duration: 0.6, ease: 'expo.out',
    }, 0.2)
    // 4. O número fantasma sobe 60 px e aparece, até a opacidade do CSS.
    .fromTo(ghost, { opacity: 0, y: 60 }, {
      opacity: 0.28, y: 0, duration: 0.6, ease: 'expo.out',
    }, 0.3)
    // 5. O kicker revela da esquerda.
    .fromTo(kicker, { clipPath: closed }, {
      clipPath: open, duration: 0.45, ease: 'expo.out',
    }, 0.32)
    // 6. A sub-barra também.
    .fromTo(sub, { clipPath: closed }, {
      clipPath: open, duration: 0.5, ease: 'expo.out',
    }, 0.4)
    // 7. O sublinhado varre da esquerda (pivô à esquerda no CSS).
    .fromTo(underline, { scaleX: 0 }, {
      scaleX: 1, duration: 0.55, ease: 'expo.out',
    }, 0.48);
}

// A saída: mais curta que a entrada, tudo junto e na ordem
// inversa. As placas fecham para a direita.
function exit() {
  const gone = 'inset(0% 0% 0% 100%)';
  return gsap.timeline()
    .to(underline, {
      scaleX: 0, duration: 0.25, ease: 'power3.in',
    }, 0)
    .to(sub, {
      clipPath: gone, duration: 0.3, ease: 'power3.in',
    }, 0.03)
    .to(kicker, {
      clipPath: gone, duration: 0.3, ease: 'power3.in',
    }, 0.06)
    .to(ghost, {
      opacity: 0, duration: 0.3, ease: 'power3.in',
    }, 0.06)
    .to(bar, {
      clipPath: gone, duration: 0.3, ease: 'power3.in',
    }, 0.1)
    .set(lt, { autoAlpha: 0 });
}

fill({
  name: 'Rafael Torres', role: 'Atacante', team: 'CD Meridian', number: 9,
});

// Teclado: E = entrar, S = sair, como as teclas de um playout.
document.addEventListener('keydown', (event) => {
  if (event.key === 'e') entrance();
  if (event.key === 's') exit();
});

// Para testar no Console.
window.entrance = entrance;
window.exit = exit;
window.fill = fill;
