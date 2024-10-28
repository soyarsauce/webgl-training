import { RenderManager } from './render-manager';

function main() {
  // const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
  const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;

  const renderManger = new RenderManager(canvas);
  renderManger.render();

  console.log(renderManger.gl);
}
// window.onload = main;
window.onload = () => main();

// import { App } from './app';

// const app = new App();

// window.onload = () =>
//   app.init({
//     canvas: document.getElementById('webgl-canvas') as HTMLCanvasElement,
//   });
