/**
 * @file Fragment shader for anaglyph rendering
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01
 */

/* TODO (2.4.3) Color Channel Multiplexing */

var shaderID = "fShaderAnaglyph";

var shader = document.createTextNode( `
/**
 * WebGL doesn't set any default precision for fragment shaders.
 * Precision for vertex shader is set to "highp" as default.
 * Do not use "lowp". Some mobile browsers don't support it.
 */

precision mediump float;

// uv coordinates after interpolation
varying vec2 textureCoords;

// Texture map for the left eye
uniform sampler2D textureMapL;

// Texture map for the right eye
uniform sampler2D textureMapR;

void main() {

	gl_FragColor = texture2D( textureMapL,  textureCoords );

	// Convert images to grayscale
	float leftImageGray = 0.2989 * texture2D( textureMapL,  textureCoords ).r
						+ 0.5870 * texture2D( textureMapL,  textureCoords ).g
						+ 0.1140 * texture2D( textureMapL,  textureCoords ).b; 
	float rightImageGray = 0.2989 * texture2D( textureMapR,  textureCoords ).r
						+ 0.5870 * texture2D( textureMapR,  textureCoords ).g
						+ 0.1140 * texture2D( textureMapR,  textureCoords ).b;

	gl_FragColor = vec4( leftImageGray, rightImageGray, rightImageGray, 1.0 );


}
` );

var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-fragment" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
