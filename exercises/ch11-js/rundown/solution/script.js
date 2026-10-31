// CAPÍTULO 11 — Um roteiro que espera. Solução.

const caption = document.querySelector('.caption');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rundown() {
  caption.textContent = 'Boa noite.';
  await wait(2000);
  caption.textContent = 'Estas são as notícias de hoje.';
  await wait(2000);
  caption.textContent = 'Primeiro, o tempo.';
  await wait(1500);
  caption.textContent = '';
}

rundown();
// Aparece antes porque rundown() só ESPERA lá dentro. Quem
// chamou não espera, a não ser que escreva "await rundown()".
console.log('Esta linha aparece ANTES do fim do roteiro. Por quê?');
