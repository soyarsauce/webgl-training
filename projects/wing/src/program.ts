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
   * webgl is very stateful, so we need to set the program before we can do
   * anything with it.
   * we can do program.use, then any other draw calls will use this program.
   */
}
