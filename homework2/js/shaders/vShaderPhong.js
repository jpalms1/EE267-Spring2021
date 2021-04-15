/**
 * @file Phong vertex shader only with point lights
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01
 */

/* TODO (2.2.1) */

var shaderID = "vShaderPhong";

var shader = document.createTextNode( `
/**
 * varying qualifier is used for passing variables from a vertex shader
 * to a fragment shader. In the fragment shader, these variables are
 * interpolated between neighboring vertexes.
 */
varying vec3 normalCam; // Normal in view coordinate
varying vec3 fragPosCam; // Vertex/Fragment position in view cooridnate

uniform mat4 modelViewMat;
uniform mat4 projectionMat;
uniform mat3 normalMat;

attribute vec3 position;
attribute vec3 normal;

void main() {

	gl_Position = projectionMat * modelViewMat * vec4( position, 1.0 );

	// transform position into view space
	vec4 vertexPositionView = modelViewMat * vec4( position , 1.0);
	vec3 vertexPositionView3 = vec3(vertexPositionView);

	// transform normal into view space and normalize it
	vec3 normalView = normalize( normalMat * normal );
	
	// Set output texture coordinate to vertex position in world space
	normalCam = normalView;

	// Set output color to vertex normal direction
	fragPosCam = vertexPositionView3;
}
` );


var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-vertex" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
