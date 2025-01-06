import { vec3 } from 'gl-matrix';

import { RenderManager } from './render-manager';
import { Program } from './program';
import { Mesh } from './mesh';
import { Camera } from './camera';

import vertexShaderSource from './shaders/vertex-shader.glsl?raw';
import fragmentShaderSource from './shaders/fragment-shader.glsl?raw';

function main() {
  // const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement
  const canvas = document.querySelector('#webgl-canvas') as HTMLCanvasElement;
  const camera = new Camera(canvas);

  const renderManger = new RenderManager(canvas);
  // renderManger.render();

  console.log(renderManger.gl);

  // 2 vertices at the bottom, same Y value.
  // 1 vertex at top, between the two X, higher Y value.

  // vertex at very top
  const vertices = [
    // why 0.5 instead of e.g. 50?
    /**
     * gonna render a triangle that’s half the size of the screen, and it’ll be
     * in the middle.
     * edges of left, right - will be “-1 to +1” on both x+1, via 0.5.
     * gonna render a triangle that’s half the size of the screen, and it’ll be in the middle.
     */
    // TOP
    vec3.fromValues(0, 0.5, 0),
    // BOTTOM LEFT
    vec3.fromValues(-0.5, -0.5, 0),
    // BOTTOM RIGHT
    vec3.fromValues(0.5, -0.5, 0),
    // we flattenthem
  ];
  // a demo triangle
  // const demoTriangleExercise5 = [
  //   vec3.fromValues(0, 0.5, 0),
  //   vec3.fromValues(-0.5, -0.5, 0),
  //   vec3.fromValues(0.5, -0.5, 0),
  // ];

  // const mesh = new Mesh(renderManger.gl, vertices);
  // const mesh = new Mesh(renderManger.gl, vertices);
  const triangle = new Mesh(renderManger.gl, vertices);

  const program = new Program(
    renderManger.gl,
    vertexShaderSource,
    fragmentShaderSource
  );
  const colourUniform = program.getUniformLocation('uColour');
  console.log('triangle', triangle);
  console.log('colourUniform', colourUniform);

  // const viewProjectionMatrix = camera.getViewProjectionMatrix();
  // const viewProjectionMatrixUniform = program.setUnformMatrix4fv(
  //   'uViewProjection',
  //   viewProjectionMatrix
  // );
  const viewProjectionMatrixUniform = program.getUniformLocation(
    'uViewProjectionMatrix'
  );

  // Every frame, render the triangle using the program
  renderManger.addRenderCallback(() => {
    // START REFERENCE
    // Move the camera in a circle
    camera.zoom = 0.5;
    camera.position[0] = Math.sin(performance.now() * 0.001);
    camera.position[1] = Math.cos(performance.now() * 0.001);
    // END REFERENCE

    // or sine wave to
    // camera.position[9] = Math.sin(performance.now() * 0.001);

    const pulse = (Math.sin(performance.now() / 1000) + 1) / 2;
    const pulse2 = (Math.sin(performance.now() / 1000) + 1) / 2;
    const pulse3 = (Math.cos(performance.now() / 1000) + 1) / 2;
    // // Set the colour of the triangle
    const colourUniformLocation = program.getUniformLocation('uColour');
    // renderManger.gl.uniform3f(colourUniformLocation, pulse, 0, 0);
    program.setUniform3f(
      colourUniformLocation,
      // // Red, pulsating
      // vec3.fromValues(pulse, 0, 0)
      // Red, pulsating
      // vec3.fromValues(0, pulse2, pulse3)
      vec3.fromValues(pulse, pulse2, pulse3)
    );

    // program.setUniformMatrix4f(
    //   viewProjectionMatrix,
    //   camera.getViewProjectionMatrix()
    // );
    program.setUniformMatrix4f(
      viewProjectionMatrixUniform,
      camera.getViewProjectionMatrix()
    );

    // canvas.getHTML.uniform3fv(colourUniform, 1,1,1)
    // renderManger.gl.uniform3f(colourUniform, 1,1,1)
    // program.use(); // We need to bind the program before setting the uniform
    // renderManger.gl.uniform3fv(
    //   colourUniform,
    //   // Red, pulsating
    //   vec3.fromValues(Math.sin(performance.now() * 0.005) / 2 + 0.5, 0, 0)
    // );

    // // Render the mesh, using 'aPosition' as the attribute that will receive
    // // the vertex positions
    triangle.render(program, 'aPosition');
  });

  // Start rendering to the renderManger every frame
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
