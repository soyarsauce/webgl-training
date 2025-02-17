import { vec2, vec3 } from 'gl-matrix';
import { Program } from './program';

interface Vertex {
  // pos for each vertex
  position: vec3;
  // texture co-ordinate for each vertex
  uv: vec2;
}

const elementsPerPosition = 3;
const elementsPerUV = 2;
const elementsPerVertex = elementsPerPosition + elementsPerUV;

export class Mesh {
  /** A way to store data, usually vertex data, on the GPU.
   *
   * When GPU is rendering, you are rendering like this.
   *
   * Not actually uploading all the faces and vertices to every GPU, that would
   * be super slow.
   *
   * Put all the data on the GPU once,
   * - Each time you need to change camera angle/move, re-render the whole thing
   *
   * So, the buffer will store our vertices.
   */
  public buffer: WebGLBuffer;
  public vertexData: Float32Array | null = null;

  constructor(
    private gl: WebGL2RenderingContext,
    // private vertices: vec3[]
    private vertices: Vertex[]
  ) {
    /**
     * Webgl isn't really an OO API; Can't call methods on it,
     *
     * Think of it like a pointer in C/C++
     */
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error('Failed to create buffer');
    }

    /** create it & hold onto it. */
    this.buffer = buffer;

    /**
     * now let's put our vertices onto it. this.buffer.setData()? -> no, webgl
       is not OO API. it's a stateful API, if we want to do anything with the
       buffer, first need to bind the buffer.
     */

    /** This is like setting a global variable. */
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    // gl.ARRAY_BUFFER ==> array buffer binding point. think of it like a
    // "global variable that you are setting"
    /** GL_ARRAY_BUFFER The buffer will be used as a source for vertex data, but
        the connection is only made when glVertexAttribPointer is called. The
        pointer field of this function is taken as a byte offset from the
        beginning of whatever buffer is currently bound to this target. */

    /**
     * buffer is similar, you are overriding the previous binding, but the
     * buffer itself, lives on.
     *
     * Don't suddenly lose the buffer if we bind a different buffer,
     *
     * But can _only_ have one buffer bound at a time.
     *
     * Think of it like e.g. "Any buffer things you operate on, will happent to
     * this buffer"
     */

    // flatten our data
    // number of our vertices, * 3;
    // Float32Array = single precision
    // Float64Array = double precision
    // gl-matrix stores things as 32 floats by default

    const vertexData = new Float32Array(vertices.length * elementsPerVertex);
    this.vertexData = vertexData;
    for (let i = 0; i < vertices.length; i++) {
      // vertexData[i * 3] = vertices[i][0];
      // vertexData[i * 3 + 2] = vertices[i][2];
      // vertexData[i * 3 + 1] = vertices[i][1];

      // vertexData[i * 3] = vertices[i][0];
      // vertexData[i * 3 + 1] = vertices[i][2];
      // vertexData[i * 3 + 2] = vertices[i][1];

      /** */
      // vertexData[i * 3] = vertices[i][0]; // x
      // vertexData[i * 3 + 1] = vertices[i][1]; // y
      // vertexData[i * 3 + 2] = vertices[i][2]; // z
      // 2025-02-03 - > adding u, v, 5 things per vertex
      // modify the vertex data, to include the uv data.
      // vertexData[i * 5 + 3] = vertices[i].uv[0];
      // each vertex has 3 components (x, y, z)
      vertexData[i * elementsPerVertex] = vertices[i].position[0]; // x
      vertexData[i * elementsPerVertex + 1] = vertices[i].position[1]; // y
      vertexData[i * elementsPerVertex + 2] = vertices[i].position[2]; // z
      // vertexData[i * elementsPerVertex] = vertices[i].position[0]; // x
      // vertexData[i * elementsPerVertex + 1] = vertices[i].position[1]; // y
      // vertexData[i * elementsPerVertex + 2] = vertices[i].position[2]; // z

      // each vertex has 2 components (u, v)
      vertexData[i * elementsPerVertex + 3] = vertices[i].uv[0]; // u
      vertexData[i * elementsPerVertex + 4] = vertices[i].uv[1]; // v
    }

    /**
     * `bufferData` -> takes some data, puts it into the buffer you've bound.
     *
     * Pattern in webgl -> bind to a binding point, then use functions that
     * operate on that binding point.
     *
     * This is basically equivalent to, if opengl was a nicely design API
     *
     * equivalent of `this.buffer.bufferData()`;
     * instead of a method on a buffer, we bind it, call a global function.
     */
    // gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    /**
     * this will either be static or dynamic draw, depending on how often you
    are going to change the data. Frequently or not, internally it will
    make some optimisations. You're just setting this data once, so it's
    optimised, you can change it frequently if you need to.
     */

    /**
     * Usually you would avoid changing vertex data, because if everything
    needs to be rendered, you need to re-upload all the data large amoutns
    to the GPU & modify without reuploading.
     */
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    /**
     * As per last week, good to clean up, so that other parts of the code don't
     * accidentally use the buffer.
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /**
     * These bindBuffer calls aren't actually doing any work on the GPU, they're
    just setting some state on the GPU. No performance impact of doing this.
     */

    /**
     * Q: what's roughyl something that's static, vs dynamic?
     * A: most of the time you want static. Let's say you have a model of a 
     * character, and you wanted to bend the arms as an animation, even in
     * that case you wouldn't re-upload the mesh when you need to modify the
     * vertices.
     * What you need instead, is modify vertices on the GPU, then use vertex
     * shaders to modify the vertices.
     * 
     * Just upload the angle of the bones, and each angle is mapped to the bone,
     * then it affects all the vertices it's connected to.
     * 
     * Even if you tried to modify the mesh, to avoid uploading data to the GPU.
     * 
     * You might want to use dynamic draw, if you're doing something like
     * "fabric simulation". Search "video game cloth physics",
     * 
     * Some older games might have a cloth animation. It's pre-baked/ pre-calculated,
     * every frame it'll reupload.
     * 
     * Newer engines will use GPU based techniques.
     * 
     * we use dynamic draw, for our instance buffers.

      but that’s not setting individual vertices, it’s defining, “array of all stickies we need to re-render”

      we’ll update the colour in the array, if the sticky changes.

      a buffer isn’t always vertex data. 

      can be other things, e.g. an InstancedBuffer

      no data about vertices, properties about different meshes you’re drawing.
      A good example of another binding point; GL_ELEMENT_ARRAY_BUFFER, where it’s not
      vertex data, but indices.

      Depends on what the buffer is used for.
     */

    /**
       * 
       * er:

program that runs on a GPU

fragment shader:

running for every pixel, on the triangle we are rendering, to determine the final colour.

gpu can do this really quickly, since it can do lots of things at once

shaders for vertices themselves:

as rotating camera, another shader is also running on the vertices.

they will rotate the vertices, to get them into the final spot.

- outputs the

position.

texture applied, to the surface.

rotates them.

e.g. animated model of a person.

rotate angles

in order to display texture, then rotate the vertices.
got this image, different parts of the cube are mapped to different parts of the
triangle.

the vertex shader, outputs the co-ordinates, then the fragment shader, takes the
co-ordinates and maps it to the texture.

looking up which parts of the image to display, it will interpolate between the
vertices.
using the "UV editor" in blender, can see each face of the cube, and how it's
mapped to the texture.

can make it bigger, smaller, etc.
so the vertex shader would be outputting 

any data output by the vertex shader, it will be automatically interpolated
between all the pixels in the triangle, if rendering this specific point of
the triangle, then the fragment shader will be provided, any information about
the 3 adjacent vertices, and linearly weighted between them.

if rendeirng a point really close, the input position, will be, 

paul: vertex shader, has all the points, and says "has all these points,
from closest bottom elft, all the way to top right, maps its own,
space to the texture space, then the fragment shader, takes the
data and anything that's at the closest point to the bottom left, as it gets to
the top right, i'm rendering to where the more yellow colours.

caleb: "output value of 0, and 1, on left, right. when the fragment shader runs,
the pixel in the middle, it will get the value 0.5, "

for texture co=ordinates,
each 3 corner, corresponds to a position on the image.
then it's being linearly blended on the 3 points.;

then can display an image evenly across the entire surface/triangle.
being evenly distributed 

are there any other shaders?
- geometry shader, tessellation shader, compute shader.
summary of each:
- vertex shader: runs on each vertex, outputs the position of the vertex.
- fragment shader: runs on each pixel, outputs the colour of the pixel.
- geometry shader: runs on each triangle, can output more triangles.
- tessellation shader: runs on each triangle, can output more triangles.
- compute shader: runs on the GPU, but not on the GPU, can be used for
  general purpose computation.
  

       */
  }

  render(
    program: Program,
    positionVariableName: string,
    uvVariableName: string
  ) {
    program.use();

    // const positionAttributeLocation = program.getAttribLocation('aPosition');
    const positionAttributeLocation =
      program.getAttribLocation(positionVariableName);
    const uvAttributeLocation = program.getAttribLocation(uvVariableName);

    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.enableVertexAttribArray(uvAttributeLocation);

    /** bind buffer, then tell the attribute how to get data out of it. */
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    /** tell the attribute how to get data out of the buffer. */
    // this.gl.vertexAttribPointer(
    //   // attribute location
    //   positionAttributeLocation,
    //   // number of components per vertex, 3 for x, y, z
    //   3,
    //   // gpu hardware optimised for 32 bit floats.
    //   this.gl.FLOAT,
    //   // false for no normalisation
    //   false,
    //   // The stride:
    //   // 3,
    //   // 3 * Float32Array.BYTES_PER_ELEMENT,
    //   elementsPerVertex * Float32Array.BYTES_PER_ELEMENT,
    //   0
    // );
    this.gl.vertexAttribPointer(
      // attribute location
      positionAttributeLocation,
      // number of components per vertex, 3 for x, y, z
      elementsPerPosition,
      // gpu hardware optimised for 32 bit floats.
      this.gl.FLOAT,
      // false for no normalisation
      false,
      // The stride:
      // 3,
      // 3 * Float32Array.BYTES_PER_ELEMENT,
      elementsPerVertex * Float32Array.BYTES_PER_ELEMENT,
      // offset
      0
    );

    this.gl.vertexAttribPointer(
      // attribute location
      uvAttributeLocation,
      // number of components per vertex, 3 for x, y, z
      elementsPerUV,
      // gpu hardware optimised for 32 bit floats.
      this.gl.FLOAT,
      // false for no normalisation
      false,
      // The stride:
      // 3,
      // 3 * Float32Array.BYTES_PER_ELEMENT,
      elementsPerVertex * Float32Array.BYTES_PER_ELEMENT,
      // offset
      elementsPerPosition * Float32Array.BYTES_PER_ELEMENT
    );

    // SOLN
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length);

    // // Clean up any state that we set. This is good practice as it avoids us acc
    // // accidentally using the wrong state later.
    this.gl.disableVertexAttribArray(positionAttributeLocation);
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}
