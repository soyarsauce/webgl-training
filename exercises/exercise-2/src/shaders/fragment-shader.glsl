#version 300 es

precision highp float;

uniform vec3 uColor;

// also need to output the color
out vec4 fragColor;

// opengl is weird because, for fragment shader, need to define the output
// colour with the `out` keyword, as opposed to the `in` keyword for the vertex
// same thing as the vertex sahder: but output the colour as the given uniform colour

void main() {
  fragColor = vec4(uColor, 1.0);
}
// when drawing a mesh, will be drawing from a buffer,
// you will explicitly map which attributes in the buffer, map to the shaders 
// vertex+fragment always linked together as a single unit.
// vertex shader is responsible for calculating the position of the vertices



//
// the vertex shader is run for every vertex in the mesh
// fragment shader is responsible for calculating the colour of the pixels
// the fragment shader is run for every pixel that is covered by the triangle
// the vertex shader is run first, and then the fragment shader is run

// use a "program" to link the shaders together.
// the program is the final object that is used to render the mesh
