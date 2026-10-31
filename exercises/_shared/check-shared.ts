/**
 * Confere se as cópias de tokens.css, das fontes e do three.js espalhadas pelos
 * exercícios são iguais às de _shared/. Cada pacote OGraf leva a sua cópia
 * (no ar não há internet), e uma cópia esquecida desalinha o visual.
 *
 *   npm run shared:check
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHARED = dirname(fileURLToPath(import.meta.url));
const EXERCISES = dirname(SHARED);

const originais = new Map<string, Buffer>([
  ['tokens.css', readFileSync(join(SHARED, 'tokens.css'))],
  ...readdirSync(join(SHARED, 'fonts')).map((nome): [string, Buffer] => [`fonts/${nome}`, readFileSync(join(SHARED, 'fonts', nome))]),
  ...readdirSync(join(SHARED, 'three')).map((nome): [string, Buffer] => [`three/${nome}`, readFileSync(join(SHARED, 'three', nome))]),
]);

function* arquivos(pasta: string): Generator<string> {
  for (const nome of readdirSync(pasta)) {
    const caminho = join(pasta, nome);
    if (caminho === SHARED || nome === 'node_modules') continue;
    if (statSync(caminho).isDirectory()) yield* arquivos(caminho);
    else yield caminho;
  }
}

const diferentes: string[] = [];
let conferidos = 0;
for (const caminho of arquivos(EXERCISES)) {
  // tokens.css em qualquer lugar; o resto pela pasta: fonts/<arquivo>, three/<arquivo>.
  const nome = basename(caminho);
  const chave = nome === 'tokens.css' ? nome : `${basename(dirname(caminho))}/${nome}`;
  const original = originais.get(chave);
  if (!original) continue;
  conferidos += 1;
  if (!readFileSync(caminho).equals(original)) diferentes.push(relative(EXERCISES, caminho));
}

if (diferentes.length) {
  console.error(`Diferentes de _shared/ (copie de novo):\n  ${diferentes.join('\n  ')}`);
  process.exit(1);
}
console.log(`${conferidos} cópias conferidas, todas iguais a _shared/.`);
