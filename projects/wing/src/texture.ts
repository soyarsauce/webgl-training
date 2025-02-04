export class Texture {
  private texture: WebGLTexture;

  constructor(
    private gl: WebGL2RenderingContext,
    image: TexImageSource
  ) {
    // cases where, webgl context is lost:
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
    // e.g. if laptops have a dedicated GPU vs iGPU
    // it will switch between the two.
    const texture = gl.createTexture();
    this.texture = texture;

    if (!texture) {
      throw new Error('Failed to create texture');
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // for image/texture being flipped: bottom pixel going upwards; but browser stores images from top pixel downards

    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      // if have a colour image, default to rgba
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );

    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  public static fromURL(
    gl: WebGL2RenderingContext,
    url: string
  ): Promise<Texture> {
    const image = new Image();
    image.src = url;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(new Texture(gl, image));
      };
      image.onerror = reject;
    });
  }

  public bind(unit: number): void {
    // texture + unit -> e.g. "TEXTURE0-31"
    // designed so that they're all numbered sequentially
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    // do we clean up here?
    // no -> by the time this method finishes, nothing is bind by the end
    // will want to cleanup, but after we do rendering
    // you want to go to texture 0 by the end
  }
}
