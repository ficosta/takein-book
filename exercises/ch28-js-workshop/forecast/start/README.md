# Capítulo 28 — A previsão do tempo

A pasta `news/` é o pacote do capítulo 25 com um gráfico novo, a
previsão (`forecast`). Complete os dois TODO do `forecast.mjs`:

1. `buildUrl`: o endereço da API da Open-Meteo.
2. `fetchForecast`: o fetch com prazo e o plano B.

Antes, abra no Chrome o endereço que o seu `buildUrl` monta e leia
o JSON que a API devolve (seção 28.7).

Teste no mini-controller (precisa de internet):

    tools/mini-controller.html?manifest=../ch28-js-workshop/forecast/start/news/forecast.ograf.json
