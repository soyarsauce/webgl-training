#version 300 es

// The view-projection matrix, which maps world coordinates to clip-space
// coordinates
uniform mat4 uViewProjectionMatrix;

// in vec3 aOffset;
// in vec3 aColor;
in vec3 iOffset;
// in vec3 iColor;

// these values will be the same for every vertex, will handle automatically passing
// them to the fragment shader for you.
// e.g. can use offset in each shader;
// e.g. out vec3 vColor; -> pass it to fragment shader to use colour

// The position of the vertex being processed
in vec3 aPosition;

// The texture coordinates of the vertex being processed
in vec2 aUv;

// The texture coordinates of the vertex, output to the fragment shader
out vec2 vUv;

void main() {
  // Pass the texture coordinates to the fragment shader
  vUv = aUv;
  // vColor = iColor;

  // Output the vertex position multiplied by uViewProjectionMatrix
  // gl_Position is a built-in variable that holds the final output position
  gl_Position = uViewProjectionMatrix * vec4((aPosition + iOffset), 1.0);
}
