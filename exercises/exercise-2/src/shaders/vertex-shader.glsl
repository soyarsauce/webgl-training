#version 300 es

// shaders can operate with different levels of precision

// for vertex shaders, we want to use high precision for the vertex positions
// because we want to avoid any artifacts that might be caused by low precision
// calculations

// if didn't use high precision, and outputting low precision, the vertex positions
// will look very jagged and not smooth,
// and the model will look like it's made of lego blocks
// because the vertex positions are not calculated accurately

// https://registry.khronos.org/OpenGL/specs/es/3.2/GLSL_ES_Specification_3.20.pdf
// highp, mediump, lowp table: page 92

precision highp float;

in vec3 aPosition;
// "a" prefix represents the texture coming from the vertex shader,
// and a is used because it's an attribute


// `in` keyword implies, that the position is different for each vertex.
// as opposed to `uniform`, which is the same for all vertices.

// if wanted to display a flat colour, across entire triangle,
// can do:
// uniform vec4 uColor;

// why vec3? because we're using 3D positions
// why vec4? because we're using 4D positions. 4d positions are: 
// x, y, z, w, w represnte the perspective divide.
// perspective divide is the process of dividing the x, y, z by w

uniform vec4 uColor;
// if wanted to otuput a piece of data from vertex sahder to fragment,
// can do 
// out float test;
// and then in the fragment shader, can do
// in float test;



void main() {
  // gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
  gl_Position = vec4(aPosition, 1.0);
  // 2d app, just set it to 1, because we're not doing any perspective divide

  // the 4th parameter acts as a divisor, and is used for perspective divide
  // e.g. if it was set to 5, it ends up dividing rest of it by the number
  // 

  // could also do
  // aPosition.x = aPosition.x + 0.5;
  // or to put it into another vector
  // vec3 newPosition = aPosition + vec3(0.5, 0.5, 0.5);
  // or to put it into another vector, and set the z to 0
  // vec3 newPosition = aPosition + vec3(0.5, 0.5, 0.0);
  // or to put it into another vector, and set the z to 0, and multiply by 0.5
  // vec3 newPosition = aPosition + vec3(0.5, 0.5, 0.0) * 0.5;
  // alternatively, could also do

  // it's called "swizzling"
}

