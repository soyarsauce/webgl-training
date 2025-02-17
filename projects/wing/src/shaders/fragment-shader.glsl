#version 300 es

precision highp float;
// pi math
// #define PI 3.14159265359

// Input variables that define the two colours of the gradient
// uniform vec3 uColour1;
// uniform vec3 uColour2;
uniform float uTime;
// in vec3 vPosition;

uniform sampler2D uTexture;
uniform sampler2D uCloudTexture;
in vec2 vUv;

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
// uniform vec3 uColour;
out vec4 fragColour;



void main() {
  // fragColour = vec4(color.rgb, 1.0);
  // vec4 color = texture(uTexture, vUv);
  // fragColour = color;
  vec3 colour = texture(uTexture, vUv.xy).rgb;

  vec2 cloudTextCoordOffset = vec2(uTime * 0.025);
  float cloudTextCoordScale = 0.5;
  float noise = texture(
    uCloudTexture,
    vUv.xy * cloudTextCoordScale + cloudTextCoordOffset
  ).r;

  noise = pow(noise + 0.46, 8.0);
  fragColour = vec4(colour * noise, 1.0);

  // fragColour = vec4(colour, 1.0);

  // fragColor = vec4(1.0, 1.0, 1.0, 1.0); // White
  // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  // fragColour = vec4(colour, 1.0);


///


  // float gradient = vPosition.x + 0.5;
  // gradient += uTime;
  // gradient = 0.5 + 0.5 * cos(2.0 * PI * gradient);
  // vec3 colour = mix(uColour1, uColour2, gradient);

  // // fragColor = vec4(1.0, 1.0, 1.0, 1.0); // White
  // // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  // // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  // fragColour = vec4(colour, 1.0);
}
