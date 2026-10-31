# Capítulo 22 — Lower third, kicker e locator

- `lower-third.*` está pronto: é o modelo. Leia o `lower-third.mjs`
  e compare com o `graphic.mjs` do capítulo 16: ficou só o que é da
  lower third.
- `kicker.mjs`: escreva `entrance`, `exit` e `swap` (seção 22.3).
- `locator`: o código está pronto, mas falta o manifest. Crie
  `locator.ograf.json` com três campos (seção 22.4): `status`
  (select: live, recorded, rerun), `city` (texto) e `state` (a sigla
  do estado, no máximo 2 letras). O `main` é `locator.mjs`.

Teste cada um no mini-controller, trocando o nome do manifest no
endereço:

    tools/mini-controller.html?manifest=../ch22-news/start/news/kicker.ograf.json
