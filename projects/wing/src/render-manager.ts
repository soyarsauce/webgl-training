export class RenderManager {
  public gl: WebGL2RenderingContext;
  public canvas: HTMLCanvasElement;

  // private lastFrameTime = 0;
  private lastClearTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('no canvas');
    }
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('webgl2 not suported');
    }

    this.gl = gl;
    this.canvas = canvas;

    // setInterval(() => this.render(), 1000/60);
    // too jank

    // requestAnimationFrame(() => {

    // })
  }

  public startRendering() {
    // requestAnimationFrame(this.render.bind(this));
    requestAnimationFrame(this.render);
  }

  public render = () => {
    /** perf things */
    const now = performance.now();
    // const deltaTime = now - this.lastFrameTime;
    // console.log('deltaTime', 1000 / deltaTime);
    // this.lastFrameTime = now;
    if (this.lastClearTime === 0) {
      this.lastClearTime = now;
    }

    // if don't set it
    const width = this.canvas.clientWidth * window.devicePixelRatio;
    const height = this.canvas.clientHeight * window.devicePixelRatio;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);

    // this is a "dangerous pattern" if not clearcolor before calling clear
    // this.gl.clearColor(0, 0, 0, 1);

    if (now - this.lastClearTime > 25000) {
      this.gl.clearColor(Math.random(), Math.random(), Math.random(), 1);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      this.lastClearTime = now;
    }

    // can clear color right after, to "not let state leak"
    this.gl.clearColor(0, 0, 0, 0);

    // console.log('Rendering');
    requestAnimationFrame(this.render);
  };

  /** not a problem in real world, but */
  unrelatedMethod() {
    // let's say we called clear in antoher part of the codebase.

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // ow this is gonna use whatever the last color is.
  }
}
