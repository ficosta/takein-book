// CAPÍTULO 11 — Resultados de eleição. Complete os TODO.
// Abra pelo Live Server: fetch não lê arquivos com file://

// Formatadores em português: 2481093 → "2.481.093"
// e 0.5099 → "51,0%".
const votesFormat = new Intl.NumberFormat('pt-BR');
const pctFormat = new Intl.NumberFormat('pt-BR', {
  style: 'percent', minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

async function load() {
  // TODO 1 — Busque o arquivo e transforme em objeto:
  //   const response = await fetch('data/results.json');
  //   const data = await response.json();

  // TODO 2 — Escreva o título (.title: "Prefeito · São Paulo") e
  //          as urnas apuradas (.counted: "87,4% das urnas apuradas").

  // TODO 3 — Some os votos de todos os candidatos:
  //   let total = 0;
  //   for (const c of data.candidates) total = total + c.votes;

  // TODO 4 — Para cada candidato, crie uma div.row dentro da
  //          .list, com três spans: name, pct (votes / total)
  //          e votes.
}

// TODO 5 — Troque a última linha por uma função que espera o
//          load() dentro de um try/catch e, se der erro,
//          mostra a mensagem na tela com a classe "error":
//   async function start() {
//     try { await load(); }
//     catch (error) { /* mostre error.message */ }
//   }
//   start();
load();
