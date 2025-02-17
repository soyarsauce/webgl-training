import { RenderManager } from './render-manager';
import { TriangleObject } from './triangle';
import { Camera } from './camera';

function main() {
  // const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
  const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;
  const renderManger = new RenderManager(canvas);
  const camera = new Camera(canvas);
  console.log(renderManger.gl);

  // Create a simple triangle mesh that we want to render
  const triangle = new TriangleObject(renderManger.gl, camera);

  // Every frame, render the triangle using the program
  renderManger.addRenderCallback(() => {
    // Move the camera in a circle
    camera.zoom = 0.63;
    camera.position[0] = Math.sin(performance.now() * 0.0005);
    camera.position[1] = Math.cos(performance.now() * 0.0005);

    // Render the triangle
    triangle.render();
  });

  // Start rendering to the canvas every frame
  renderManger.startRendering();
}
// window.onload = main;
window.onload = () => main();

// import { App } from './app';

// const app = new App();

// window.onload = () =>
//   app.init({
//     canvas: document.getElementById('webgl-canvas') as HTMLCanvasElement,
//   });
