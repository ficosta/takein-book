// CAPÍTULO 11 — Um roteiro que espera. Complete os TODO.

const caption = document.querySelector('.caption');

// Pronta: devolve uma Promise que se cumpre depois de "ms"
// milissegundos. É o "espere" do nosso roteiro.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// "async" deixa usar "await" aqui dentro.
async function rundown() {
  caption.textContent = 'Boa noite.';
  await wait(2000);

  // TODO 1 — Mostre "Estas são as notícias de hoje." e espere
  //          2 segundos.

  // TODO 2 — Mostre "Primeiro, o tempo." e espere 1,5 segundo.

  // TODO 3 — Limpe a tela (textContent = '').
}

rundown();
console.log('Esta linha aparece ANTES do fim do roteiro. Por quê?');
