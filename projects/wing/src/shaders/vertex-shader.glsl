#version 300 es

// layout (location = 0) in vec3 aPosition;

// uniform mat4 uProjectionMatrix;
// uniform mat4 uViewMatrix;
// uniform mat4 uModelMatrix;
uniform mat4 uViewProjectionMatrix;

// void main() {
//   gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
// }

// The position of the vertex being processed
in vec3 aPosition;

out vec3 vPosition;

void main() {
  // pass vertex position to the fragment shader
  vPosition = aPosition;

  // Output the vertex position unchanged
  // gl_Position is a built-in variable that holds the final output position
  // gl_Position = vec4(aPosition, 1.0);
  gl_Position = uViewProjectionMatrix * vec4(aPosition, 1.0);
}
