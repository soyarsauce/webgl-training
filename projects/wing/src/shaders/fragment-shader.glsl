#version 300 es

precision highp float;

// An input variable that defines what colour we want to render the triangle with
uniform vec3 uColour;

out vec4 fragColour;

void main() {
  // fragColor = vec4(1.0, 1.0, 1.0, 1.0); // White
  // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  // fragColor = vec4(1.0, 0.0, 0.5, 1.0); // White
  fragColour = vec4(uColour, 1.0);
}
