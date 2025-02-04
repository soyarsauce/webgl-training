import { mat4, vec3 } from 'gl-matrix';

export class Program {
  public program: WebGLProgram;

  constructor(
    private gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    // Compile the vertex and fragment shaders
    const vertexShader = this.compileShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    // Create and link the WebGL program
    this.program = this.createProgram(vertexShader, fragmentShader);
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    // Create a new program object
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error('Failed to create program');
    }

    // Attach the vertex and fragment shaders to the program
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);

    // Link the program
    this.gl.linkProgram(program);

    // Check if the linking was successful
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      throw new Error(`Failed to link program: ${info}`);
    }

    return program;
  }

  private compileShader(type: number, shaderSource: string) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Failed to create shader');
    }

    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      throw new Error(`Failed to compile shader: ${info}`);
    }
    return shader;
  }

  // private linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  //   const program = this.gl.createProgram();
  //   if (!program) {
  //     throw new Error();
  //   }
  //   this.gl.attachShader(program, vertexShader);
  //   this.gl.attachShader(program, fragmentShader);

  //   this.gl.linkProgram(program);

  //   if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
  //     const info = this.gl.getProgramInfoLog(program);
  //     throw new Error(`Failed to link program: ${info}`);
  //   }
  //   return program;
  // }

  public use() {
    this.gl.useProgram(this.program);
  }

  // program.getAttribLocation('aPosition');
  public getAttribLocation(name: string) {
    return this.gl.getAttribLocation(this.program, name);
  }

  // program.getUniformLocation('uColor');
  public getUniformLocation(name: string) {
    return this.gl.getUniformLocation(this.program, name);
  }

  /**
   * VIA REFERENCE: Sets a `float` uniform variable in the program.
   *
   * @param location The location of the uniform variable in the program, as
   * returned by {@link getUniformLocation}.
   * @param value The value to set the uniform to.
   */
  setUniform1f(location: WebGLUniformLocation | null, value: number): void {
    if (location == null) {
      throw new Error('Uniform location is null');
    }

    this.use();

    this.gl.uniform1f(location, value);

    // Unbind the program to avoid accidental changes
    this.gl.useProgram(null);
  }

  /**
   * VIA REFERENCE: Sets a `vec3` uniform variable in the program.
   *
   * @param location The location of the uniform variable in the program, as
   * returned by {@link getUniformLocation}.
   * @param value The value to set the uniform to.
   */
  setUniform3f(location: WebGLUniformLocation | null, value: vec3): void {
    if (location == null) {
      throw new Error('Uniform location is null');
    }

    this.use();

    this.gl.uniform3fv(location, value);

    // Unbind the program to avoid accidental changes
    this.gl.useProgram(null);
  }

  /**
   * webgl is very stateful, so we need to set the program before we can do
   * anything with it.
   * we can do program.use, then any other draw calls will use this program.
   */
  /** VIA REFERENCE
   * Sets a `mat4` uniform variable in the program.
   *
   * @param location The location of the uniform variable in the program, as
   * returned by {@link getUniformLocation}.
   * @param value The value to set the uniform to.
   */
  setUniformMatrix4f(location: WebGLUniformLocation | null, value: mat4): void {
    if (location == null) {
      throw new Error('Uniform location is null');
    }

    this.use();

    // The second argument is unused and must always be false (it makes no sense
    // why it's part of the API)
    this.gl.uniformMatrix4fv(location, false, value);

    // Unbind the program to avoid accidental changes
    this.gl.useProgram(null);
  }
}
