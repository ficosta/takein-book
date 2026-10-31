// R05 · Texto que cabe (autofit).
// Diminui a fonte, de 1 em 1 pixel, até o texto caber na
// largura da caixa. Pare num mínimo: abaixo dele, é melhor
// reescrever o texto do que ir ao ar ilegível.
function fitText(element, max, min) {
  let size = max;
  element.style.fontSize = `${size}px`;
  while (element.scrollWidth > element.clientWidth && size > min) {
    size = size - 1;
    element.style.fontSize = `${size}px`;
  }
  return size;
}

// Meça só depois de a fonte carregar: com a fonte substituta,
// a conta sai errada (o mesmo cuidado do SplitText).
document.fonts.ready.then(() => {
  for (const box of document.querySelectorAll('.r05-fit')) {
    box.dataset.size = fitText(box, 58, 30);
  }
});
