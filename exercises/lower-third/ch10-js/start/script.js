// CAPÍTULO 10 — Preencha a lower third com JavaScript.
//
// Repare que no index.html os textos agora estão vazios.
// Quem escreve o nome, a função, o time e o número é este arquivo.

// Os dados: numa plataforma gráfica, é o que o operador digita
// nos campos do gráfico.
const data = {
  name: 'Rafael Torres',
  role: 'Atacante',
  team: 'CD Meridian',
  number: 9,
  color: '#c8f71d',
};

// Uma função que recebe dados e coloca na tela.
function fill(d) {
  // Encontra o elemento com a classe lt-name e troca o texto dele:
  document.querySelector('.lt-name').textContent = d.name;

  // TODO 1 — faça o mesmo para a função (.lt-role) e o time (.lt-team).

  // TODO 2 — o número aparece em dois lugares: sozinho no fantasma
  //          (.lt-ghost) e com a palavra CAMISA na sub-barra (.lt-shirt):
  //          `CAMISA ${d.number}`

  // TODO 3 — troque a cor de destaque. A cor é uma variável CSS;
  //          troque-a no elemento .lt, e todas as peças que a usam
  //          mudam juntas:
  //          elemento.style.setProperty('--accent', d.color);
}

// Chama a função com os dados.
fill(data);

// TODO 4 — Abra o Console do navegador (⌥ ⌘ J no Mac,
//          Ctrl Shift J no Windows) e digite:
//          fill({ name: 'Marina Silveira', role: 'Treinadora',
//                 team: 'Atlético Oro', number: 1, color: '#ffb81c' })
//
// DESAFIO — agora digite  fill({ name: 'Só o nome' })
//           O que aconteceu com a função, o time, o número e a cor? Como evitar isso?
