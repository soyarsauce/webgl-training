import { vec3 } from 'gl-matrix';

import { RenderManager } from './render-manager';
import { Mesh } from './mesh';

function main() {
  // const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
  const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

  const renderManger = new RenderManager(canvas);
  renderManger.render();

  console.log(renderManger.gl);

  // 2 vertices at the bottom, same Y value.
  // 1 vertex at top, between the two X, higher Y value.

  // vertex at very top
  const vertices = [
    // why 0.5 instead of e.g. 50?

    /**
     * gonna render a triangle that’s half the size of the screen, and it’ll be
     * in the middle.
     *
     * edges of left, right - will be “-1 to +1” on both x+1, via 0.5.
     *
     * gonna render a triangle that’s half the size of the screen, and it’ll be in the middle.
     *
     */
    // TOP
    vec3.fromValues(0, 0.5, 0),
    // BOTTOM LEFT
    vec3.fromValues(-0.5, -0.5, 0),
    // BOTTOM RIGHT
    vec3.fromValues(-0.5, -0.5, 0),
    // we flattenthem
  ];
  const mesh = new Mesh(renderManger.gl, vertices);
  console.log('mesh', mesh);
}
// window.onload = main;
window.onload = () => main();

// import { App } from './app';

// const app = new App();

// window.onload = () =>
//   app.init({
//     canvas: document.getElementById('webgl-canvas') as HTMLCanvasElement,
//   });
