// CAPÍTULO 12 — Um módulo: funções de formatação para usar em
// qualquer gráfico.

const pct = new Intl.NumberFormat('pt-BR', {
  style: 'percent', maximumFractionDigits: 1,
});

// "export" deixa outros arquivos importarem esta função.
export function percent(value) {
  return pct.format(value);
}

// TODO 1 — Escreva e exporte a função thousands(value), que
//          devolve o número com separador de milhar em pt-BR:
//          12345 → "12.345". Dica: new Intl.NumberFormat('pt-BR')
