// CAPÍTULO 12 — O módulo principal. Solução.

import { percent, thousands } from './format.js';

const output = document.querySelector('.output');

output.textContent =
  `${percent(0.5132)} · ${thousands(2481093)} votos`;
