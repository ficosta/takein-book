// CAPÍTULO 14 — Anime a lower third com GSAP.
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

    // TODO 1 — O kicker revela da esquerda, como a placa do nome:
    //          de closed a open, 0,45 s, 'expo.out', no instante 0.32.

    // TODO 2 — A sub-barra faz o mesmo: 0,5 s, no instante 0.4.

    // TODO 3 — O sublinhado varre da esquerda: de scaleX 0 a 1,
    //          0,55 s, 'expo.out', no instante 0.48. (O pivô,
    //          transform-origin, já está à esquerda no CSS.)
    ;
}

// TODO 4 — A saída. Uma timeline de 0,4 s, com ease 'power3.in',
// tudo quase junto e na ordem inversa da entrada:
//   - o sublinhado encolhe (scaleX: 0), no instante 0
//   - a sub-barra fecha para a direita, no 0.03:
//       clipPath 'inset(0% 0% 0% 100%)'
//   - o kicker fecha do mesmo jeito e o fantasma some
//     (opacity: 0), os dois no 0.06
//   - a placa do nome fecha por último, no 0.1
//   - no fim, esconde o container: .set(lt, { autoAlpha: 0 })
// Regra de ouro: a saída é mais curta que a entrada.
function exit() {

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
