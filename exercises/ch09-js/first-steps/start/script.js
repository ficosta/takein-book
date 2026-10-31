// CAPÍTULO 9 — Primeiros passos.
// Complete cada TODO, salve, recarregue a página e confira
// o resultado no Console.

// ── 1. Variáveis ─────────────────────────────────────────
// TODO 1 — Crie uma constante "name" com o nome do jogador
//          ('Rafael') e uma variável (let) "goals" valendo 0.
//          Mostre as duas:
//          console.log(name, goals);


// ── 2. Contas ────────────────────────────────────────────
// TODO 2 — Some 1 aos gols (goals = goals + 1) e mostre de novo.


// ── 3. Textos com valores dentro ─────────────────────────
// TODO 3 — Monte a frase "Rafael marcou 1 gol" com uma template
//          string (crases e ${ }) e mostre no Console.


// ── 4. Decisão ───────────────────────────────────────────
// TODO 4 — Se goals for 1, escreva "gol"; se não, "gols".
//          Guarde numa variável "word" e refaça a frase.


// ── 5. Funções ───────────────────────────────────────────
// TODO 5 — Escreva a função timeOnAir(text): quantos segundos
//          uma lower third precisa ficar no ar para ser lida.
//          Regra: 3 palavras por segundo, nunca menos de 4 s.
//          Dicas:
//            text.split(' ').length  conta as palavras
//            Math.ceil(x)            arredonda para cima
//            Math.max(a, b)          o maior dos dois
function timeOnAir(text) {

}

// Testes: o Console deve mostrar 4, 4 e 6.
console.log(timeOnAir('Rafael Torres'));
console.log(timeOnAir('Rafael Torres, atacante do CD Meridian'));
console.log(timeOnAir('Ministro da Economia anuncia hoje em ' +
  'Brasília novas regras para o setor elétrico a partir de janeiro'));
