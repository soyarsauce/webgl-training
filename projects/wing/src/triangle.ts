import { vec2, vec3 } from 'gl-matrix';

import { Camera } from './camera';
import { Mesh } from './mesh';
import { Program } from './program';
import { Texture } from './texture';

import vertexShaderSource from './shaders/vertex-shader.glsl?raw';
import fragmentShaderSource from './shaders/fragment-shader.glsl?raw';

import textureUrl from './assets/test-texture.png?url';
import cloudTextureUrl from './assets/noise-texture.png?url';

/**
 * Represents our triangle object, containing all the logic needed to render it.
 */
export class TriangleObject {
  /**
   * The mesh that defines the triangle's geometry.
   */
  private mesh: Mesh;

  /**
   * The program that will be used to render the triangle.
   */
  private program: Program;

  /**
   * The texture that will be applied to the triangle, or `null` if it hasn't
   * loaded yet.
   */
  private texture: Texture | null = null;
  /**
   * The texture that will be applied to the triangle, or `null` if it hasn't
   * loaded yet.
   */
  private cloudTexture: Texture | null = null;

  // Uniform variables that we'll use
  private viewProjectionMatrixUniform: WebGLUniformLocation | null;
  private timeUniform: WebGLUniformLocation | null;
  private textureUniform: WebGLUniformLocation | null;
  private cloudTextureUniform: WebGLUniformLocation | null;

  /**
   * Creates a new instance of our Triangle, which will render a simple triangle to the
   * screen.
   *
   * @param gl The WebGL rendering context.
   * @param camera The camera that will be used to view the scene.
   */
  constructor(
    private gl: WebGL2RenderingContext,
    private camera: Camera
  ) {
    // Create a simple triangle mesh that we want to render.
    //
    // In 3D graphics, shapes are made up of points called vertices.
    // Here's what our triangle looks like:
    //
    //        (0.0, 0.5, 0.0)
    //              /\
    //             /  \
    //            /    \
    //           /      \
    //          /________\
    // (-0.5,-0.5,0.0)  (0.5,-0.5,0.0)
    //
    // Each vertex is represented by three numbers: (x, y, z)
    // In this 2D example, z is always 0.
    const triangle = new Mesh(
      this.gl,
      [
        // Top of the triangle
        { position: vec3.fromValues(0, 0.5, 0), uv: vec2.fromValues(0.5, 1.0) },
        // Bottom left of the triangle
        {
          position: vec3.fromValues(-0.5, -0.5, 0),
          uv: vec2.fromValues(0.0, 0.0),
        },
        // Bottom right of the triangle
        {
          position: vec3.fromValues(0.5, -0.5, 0),
          uv: vec2.fromValues(1.0, 0.0),
        },
      ],
      [
        {
          name: 'iOffset',
          size: 2, // 2d vector, using 2d coordinates;
          // e.g. vec2.fromValues(0, Math.sin(perfomrance.now())) as Float32Array
        },
      ]
    );
    this.mesh = triangle;
    this.mesh.setInstanceCount(3);
    this.mesh.setInstanceProperty(
      0,
      'iOffset',
      vec2.fromValues(0, 0) as Float32Array
    );
    this.mesh.setInstanceProperty(
      1,
      'iOffset',
      vec2.fromValues(1, 0) as Float32Array
    );
    this.mesh.setInstanceProperty(
      2,
      'iOffset',
      vec2.fromValues(0.5, 1) as Float32Array
    );

    // Create a program that we'll use to render the triangle
    this.program = new Program(gl, vertexShaderSource, fragmentShaderSource);
    this.viewProjectionMatrixUniform = this.program.getUniformLocation(
      'uViewProjectionMatrix'
    );
    this.timeUniform = this.program.getUniformLocation('uTime');
    this.textureUniform = this.program.getUniformLocation('uTexture');
    this.cloudTextureUniform = this.program.getUniformLocation('uCloudTexture');

    // Load the texture for the triangle
    Texture.fromURL(
      gl,
      textureUrl,
      // Options to control how the texture is sampled
      {
        // When we need to upscale the texture, use the nearest pixel value. This
        // creates a 'pixelated' effect.
        magFilter: gl.NEAREST,
      }
    ).then((texture) => {
      this.texture = texture;
    });

    // Load the noise texture for the triangle
    Texture.fromURL(
      gl,
      cloudTextureUrl,
      // Options to control how the texture is sampled
      {
        // When we sample outside the texture's bounds in the horizontal (U)
        // direction, wrap the texture around (repeat it)
        wrapU: gl.REPEAT,
        // When we sample outside the texture's bounds in the vertical (V)
        // direction, wrap the texture around (repeat it)
        wrapV: gl.REPEAT,
      }
    ).then((texture) => {
      this.cloudTexture = texture;
    });
  }

  /**
   * Renders the triangle to the screen. This method should be called every frame.
   */
  public render() {
    // Set the view-projection matrix
    this.program.setUniformMatrix4f(
      this.viewProjectionMatrixUniform,
      this.camera.getViewProjectionMatrix()
    );

    // set time uniform
    this.program.setUniform1f(
      this.timeUniform,
      performance.now() / 1000 // Convert to seconds
    );

    // start colour texture to texture unit 0
    let textureUnit = 0;
    this.program.setUniform1i(this.textureUniform, textureUnit);
    if (this.texture) {
      this.texture.bind(textureUnit);
    }

    // Bind the noise texture to texture unit 1
    textureUnit++;
    this.program.setUniform1i(this.cloudTextureUniform, textureUnit);
    if (this.cloudTexture) {
      this.cloudTexture.bind(textureUnit);
    }

    // Render the triangle, using 'aPosition' as the attribute that will receive
    // the vertex positions and 'aUv' as the attribute that will receive the UV
    // coordinates.
    this.mesh.render(this.program, 'aPosition', 'aUv');

    Texture.unbindAll(this.gl, textureUnit);
  }
}

/** start previous code */
//   // 2 vertices at the bottom, same Y value.
//   // 1 vertex at top, between the two X, higher Y value.

//   // vertex at very top
//   const vertices = [
//     // why 0.5 instead of e.g. 50?
//     /**
//      * gonna render a triangle that’s half the size of the screen, and it’ll be
//      * in the middle.
//      * edges of left, right - will be “-1 to +1” on both x+1, via 0.5.
//      * gonna render a triangle that’s half the size of the screen, and it’ll be in the middle.
//      */
//     // TOP
//     vec3.fromValues(0, 0.5, 0),
//     // BOTTOM LEFT
//     vec3.fromValues(-0.5, -0.5, 0),
//     // BOTTOM RIGHT
//     vec3.fromValues(0.5, -0.5, 0),
//     // we flattenthem
//   ];
//   // a demo triangle
//   // const demoTriangleExercise5 = [
//   //   vec3.fromValues(0, 0.5, 0),
//   //   vec3.fromValues(-0.5, -0.5, 0),
//   //   vec3.fromValues(0.5, -0.5, 0),
//   // ];

//   // const mesh = new Mesh(renderManger.gl, vertices);
//   // const mesh = new Mesh(renderManger.gl, vertices);
//   // const triangle = new Mesh(renderManger.gl, vertices);
/** end previous code */
