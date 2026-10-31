// CAPÍTULO 10 — solução.

const data = {
  name: 'Rafael Torres',
  role: 'Atacante',
  team: 'CD Meridian',
  number: 9,
  color: '#c8f71d',
};

// Versão do desafio: só troca o que veio. Um campo que não veio
// (undefined) deixa o que já estava na tela.
function fill(d) {
  if (d.name !== undefined) {
    document.querySelector('.lt-name').textContent = d.name;
  }
  if (d.role !== undefined) {
    document.querySelector('.lt-role').textContent = d.role;
  }
  if (d.team !== undefined) {
    document.querySelector('.lt-team').textContent = d.team;
  }
  if (d.number !== undefined) {
    document.querySelector('.lt-ghost').textContent = d.number;
    document.querySelector('.lt-shirt').textContent = `CAMISA ${d.number}`;
  }
  if (d.color !== undefined) {
    const lt = document.querySelector('.lt');
    lt.style.setProperty('--accent', d.color);
  }
}

fill(data);
