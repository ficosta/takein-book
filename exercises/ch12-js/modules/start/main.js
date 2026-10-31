// CAPÍTULO 12 — O módulo principal. Complete os TODO.

// TODO 2 — Importe também a função thousands:
import { percent } from './format.js';

const output = document.querySelector('.output');

// TODO 3 — Mostre "51,3% · 2.481.093 votos" usando as duas
//          funções com 0.5132 e 2481093.
output.textContent = percent(0.5132);
