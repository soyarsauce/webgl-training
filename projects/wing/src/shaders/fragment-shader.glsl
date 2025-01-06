#version 300 es

precision highp float;

// uniform vec3 screenSize;
// uniform vec2 cameraPosition;
// uniform float cameraZoom;
// uniform vec2 objectPosition;
// uniform float objectSize;
// if we had a bunch of different vertex shaders, would have all this
// boilerplate logic duplicating across all of them;
// and have complicated formulas to account for separate things.
// so have more complexity; more math which is error prone;
// not ideal to do it this way;
// so instead, we can use a matrix to represent the camera;
// and use linear algebra to do the math for us;

// An input variable that defines what colour we want to render the triangle with
uniform vec3 uColour;

out vec4 fragColour;

void main() {
  // fragColor = vec4(1.0, 1.0, 1.0, 1.0); // White
  // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  fragColour = vec4(uColour, 1.0);
}
