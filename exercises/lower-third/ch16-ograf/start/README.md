# Capítulo 16 — O ciclo de vida

O `graphic.mjs` desta pasta é o do capítulo 15: funciona, mas
responde ao playout antes de a animação terminar. Complete os
TODO para ele seguir a regra de ouro.

Teste no mini-controller:

    tools/mini-controller.html?manifest=../lower-third/ch16-ograf/start/lower-third/lower-third.ograf.json

No log, o Play deve levar uns 1000 ms e o Stop uns 400 ms. Com
"skipAnimation" ligado, os dois devem levar 0 ms.

Desafio (TODO 4, seção 16.7): fora do tempo real. Escreva o
`setActionsSchedule` e o `goToTime`, ligue `"supportsNonRealTime": true`
no manifest e teste com `&render=non-realtime` no endereço:

    tools/mini-controller.html?manifest=../lower-third/ch16-ograf/start/lower-third/lower-third.ograf.json&render=non-realtime
