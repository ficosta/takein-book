// A cena 3D do gol: renderizador, câmera e as placas extrudadas.
//
// Regra da casa: quem desenha o gráfico é o CSS. O three.js mede cada
// placa do HTML e constrói a versão 3D no mesmo lugar, com a mesma
// cor. Parada, a placa 3D é idêntica à do CSS; o 3D só aparece no
// movimento.

import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh,
  Shape, ExtrudeGeometry, MeshBasicMaterial, Color, MathUtils,
} from './lib/three/three.module.min.js';

const WIDTH = 1920;
const HEIGHT = 1080;
const FOV = 30;                                     // lente fechada: perspectiva leve
const TAN_SKEW = Math.tan(MathUtils.degToRad(12));  // o ângulo do sistema

// Renderizador transparente, câmera e cena, em 1920 × 1080.
export function createStage(canvas) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(1);                   // um pixel da cena = um pixel da saída
  renderer.setSize(WIDTH, HEIGHT, false);      // false: o tamanho na página fica com o CSS
  renderer.setClearColor(0x000000, 0);         // fundo de alfa zero: o vídeo aparece

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, WIDTH / HEIGHT, 10, 10000);
  // A distância em que 1 unidade da cena vale 1 px no plano z = 0.
  camera.position.z = (HEIGHT / 2) / Math.tan(MathUtils.degToRad(FOV / 2));
  return { renderer, scene, camera };
}

// O paralelogramo do sistema: base reta, topo deslocado para a direita.
// É o skewX(−12°) do CSS, com a origem no canto de baixo à esquerda.
export function plateShape(x, width, height) {
  const k = height * TAN_SKEW;
  const shape = new Shape();
  shape.moveTo(x, 0);
  shape.lineTo(x + width, 0);
  shape.lineTo(x + width + k, height);
  shape.lineTo(x + k, height);
  shape.closePath();
  return shape;
}

// Uma forma extrudada: a frente na cor da placa, as laterais na cor
// do --side. A frente fica em z = 0, onde 1 unidade vale 1 px.
function extrude(shape, depth, front, side) {
  const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geometry.translate(0, 0, -depth);
  // Grupo 0 do ExtrudeGeometry: frente e fundo. Grupo 1: as laterais.
  const materials = [
    new MeshBasicMaterial({ color: new Color(front) }),
    new MeshBasicMaterial({ color: new Color(side) }),
  ];
  return new Mesh(geometry, materials);
}

// Posição de um elemento dentro de `origin`, sem os transforms.
function offsetIn(element, origin) {
  let left = 0;
  let top = 0;
  for (let el = element; el && el !== origin; el = el.offsetParent) {
    left += el.offsetLeft;
    top += el.offsetTop;
  }
  return { left, top };
}

// Copia uma placa do CSS para o 3D: medida, posição e cores. A borda
// esquerda, se houver, vira a lâmina de destaque. Recebe o grupo para
// poder reconstruir uma placa que já existe, quando o texto muda.
export function buildPlate(element, origin, group = new Group()) {
  const style = getComputedStyle(element);
  const { left, top } = offsetIn(element, origin);
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const depth = parseFloat(style.getPropertyValue('--depth')) || 40;
  const side = style.getPropertyValue('--side').trim();
  const blade = parseFloat(style.borderLeftWidth) || 0;

  clearPlate(group);
  // O grupo gira em torno do canto de baixo à esquerda: a dobradiça.
  group.position.set(left - WIDTH / 2, HEIGHT / 2 - (top + height), 0);
  group.add(extrude(plateShape(blade, width - blade, height), depth, style.backgroundColor, side));
  if (blade) {
    group.add(extrude(plateShape(0, blade, height), depth, style.borderLeftColor, side));
  }
  return group;
}

// Devolve à placa de vídeo o que as malhas de uma placa ocupam.
function clearPlate(group) {
  for (const mesh of [...group.children]) {
    mesh.geometry.dispose();
    for (const material of mesh.material) material.dispose();
    group.remove(mesh);
  }
}

// Tira a placa da cena e libera tudo.
export function disposePlate(group) {
  clearPlate(group);
  group.removeFromParent();
}
