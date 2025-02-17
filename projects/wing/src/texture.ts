interface TextureOptions {
  /**
   * Filtering method when texture is minified (shrunk). Default is LINEAR_MIPMAP_LINEAR.
   */
  minFilter?: number;
  /**
   * Filtering method when texture is magnified (enlarged). Default is LINEAR.
   */
  magFilter?: number;
  /**
   * Wrapping method for the U coordinate. Default is CLAMP_TO_EDGE.
   */
  wrapU?: number;
  /**
   * Wrapping method for the V coordinate. Default is CLAMP_TO_EDGE.
   */
  wrapV?: number;
}

export class Texture {
  private texture: WebGLTexture;

  constructor(
    private gl: WebGL2RenderingContext,
    image: TexImageSource,
    options: TextureOptions = {}
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

    // copy texture
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      // if have a colour image, default to rgba
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );

    // Set texture parameters with defaults
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      options.minFilter ?? this.gl.LINEAR_MIPMAP_LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      options.magFilter ?? this.gl.LINEAR
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      options.wrapU ?? this.gl.CLAMP_TO_EDGE
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      options.wrapV ?? this.gl.CLAMP_TO_EDGE
    );

    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  static async fromURL(
    gl: WebGL2RenderingContext,
    url: string,
    options: TextureOptions = {}
  ): Promise<Texture> {
    const image = new Image();
    image.src = url;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
    });

    return new Texture(gl, image, options);
  }

  static unbindAll(gl: WebGL2RenderingContext, maxTextureUnit: number): void {
    // It's important to start from the max texture unit and work our way down,
    // so that we finish with texture unit 0 as the active texture unit.
    for (let i = maxTextureUnit; i >= 0; i--) {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
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
