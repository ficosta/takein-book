// CAPÍTULO 12 — Um módulo: funções de formatação. Solução.

const pct = new Intl.NumberFormat('pt-BR', {
  style: 'percent', maximumFractionDigits: 1,
});
const number = new Intl.NumberFormat('pt-BR');

export function percent(value) {
  return pct.format(value);
}

export function thousands(value) {
  return number.format(value);
}
