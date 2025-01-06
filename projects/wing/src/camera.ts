import { mat4, vec2, vec3 } from 'gl-matrix';

export class Camera {
  public position: vec2;

  public zoom: number;

  // todo/optional: rotation

  // we want to know aspect ratio of screen, want to adjust size of our scene
  // to match the aspect ratio of the screen.

  /** reference to the canvas so we can quickly get the size */
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.position = vec2.create();
    this.zoom = 1;
  }
  // clipspace is -1 to 1, so we need to adjust our scene to match the aspect ratio of the screen.
  // we want to make sure that the aspect ratio of our scene matches the aspect ratio of the screen.
  // if we don't do this, we'll get
  // stretching or squishing of our scene.

  // why mat4 for view-projection matrix?
  // in webgl, matrices are 4x4, so we need to use mat4 to represent them.
  // 3x3 can't actually represent all the transformations we need to do in webgl.
  // we need to do things like translation, rotation, scaling, and projection.
  // 4x4 matrices can represent all of these operations.
  public getViewProjectionMatrix(): mat4 {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const aspect = width / height;
    // clientWidth or width doesn't matter since we only care about the ratio.

    // 50% is 4 units; what is the height of the screen taking zoom into account
    // if 100% zoom is 2 units, then 50% zoom is 1 unit.
    // or if at 200% zoom, only 1 unit fits in hweight of screen
    // if 100% zoom is 2 units, then 200% zoom is 1 unit.
    // i.e. if zoom was 0.5, get 4 units of height.
    const screenHeight = 2; // this is height of our co-oridnate system;
    // could change this to whatever we want.
    const screenWidth = screenHeight * aspect;
    // as you zoom out, you can fit more units in the screen.
    const zoomedScreenHeight = screenHeight / this.zoom;
    const zoomedScreenWidth = screenWidth / this.zoom;

    // in webgl, clipspace is alway2s -1 to 1, so we need to
    // adjust our scene to match the aspect ratio of the screen.
    // const scaledScreenWidth = clipSpaceRange
    // it "looks weird" when we apply scale to clip space range;
    // but it will be fine once its stretched to the screen.
    const clipSpaceRange = 2;
    const scaleX = clipSpaceRange / zoomedScreenWidth;
    const scaleY = clipSpaceRange / zoomedScreenHeight;
    // const scaleZ = clipSpaceRange / totalDepth;
    // we don't need to scale the depth, since we're not using it.
    // we're only using 2d.
    const scalingMatrix = mat4.fromScaling(
      mat4.create(),
      vec3.fromValues(scaleX, scaleY, 1)
    );
    const translationMatrix = mat4.fromTranslation(
      mat4.create(),
      vec3.fromValues(-this.position[0], -this.position[1], 0)
    );
    // "moving the entire unit by 2 units to the right, gives us effect
    // of moving the camera 2 units to the left."
    // so if we want things to appear to move to the right, we move the
    // camera to the left/negative direction.
    // with camera, it's moving opposite direction to the world.

    // "zoom screen might be 4 if you have a wide screen";

    // then combine scaling and translation matrices
    // to read matrix multipliciation, "right hand side" is applied first.
    // "scalingMatrix & translationMatrix" are applied in reverse order.
    // scaling matrix * trnaslation matrix
    const viewProjectionMatrix = mat4.multiply(
      mat4.create(),
      scalingMatrix,
      translationMatrix
    );

    return viewProjectionMatrix;
  }
}
