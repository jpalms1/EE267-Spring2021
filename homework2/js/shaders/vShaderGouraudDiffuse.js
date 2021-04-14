/**
 * @file Gouraud vertex shader with diffuse and ambient light
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01
 */

/* TODO (2.1.1), (2.1.3) */

var shaderID = "vShaderGouraudDiffuse";

var shader = document.createTextNode( `
/**
 * varying qualifier is used for passing variables from a vertex shader
 * to a fragment shader. In the fragment shader, these variables are
 * interpolated between neighboring vertexes.
 */
varying vec3 vColor; // Color at a vertex

uniform mat4 viewMat;
uniform mat4 projectionMat;
uniform mat4 modelViewMat;
uniform mat3 normalMat;

struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};

uniform Material material;

uniform vec3 attenuation;

uniform vec3 ambientLightColor;

attribute vec3 position;
attribute vec3 normal;


/***
 * NUM_POINT_LIGHTS is replaced to the number of point lights by the
 * replaceNumLights() function in teapot.js before the shader is compiled.
 */
#if NUM_POINT_LIGHTS > 0

	struct PointLight {
		vec3 color;
		vec3 position;
	};

	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

#endif


void main() {
	
	// Compute ambient reflection
	vec3 ambientReflection = material.ambient * ambientLightColor;

	// Add ambient component only
	//vColor = ambientReflection;

	// transform position into clip space
	gl_Position = projectionMat * modelViewMat * vec4( position, 1.0 );

	// transform position into view space
	vec4 vertexPositionView = modelViewMat * vec4(position , 1.0);
	vec3 vertexPositionView3 = vec3(vertexPositionView);

	// transform normal into view space and normalize it
	vec3 normalView = normalize( normalMat * normal );

	// transform light position into view space 
	vec4 lightPositionView = viewMat * vec4( pointLights[0].position , 1.0);
	vec3 lightPositionView3 = vec3(lightPositionView);

	// Compute diffuse term
	float diffuseFactor = max( dot(normalView, -normalize( lightPositionView3 )) , 0.0);

	// Add diffuse components to vColor -- ambient + diffuse
	//vColor += diffuseFactor * material.diffuse * pointLights[0].color;

	// Calculate distance between light source and vertex
	float d = length( vertexPositionView3 - lightPositionView3 );

	float kc = attenuation[0];
	float kl = attenuation[1];
	float kq = attenuation[2];

	float attenuationCoeff = 1.0/(kc + kl*d + kq*d*d);
	
	// Add attenutation component to vColor -- ambient + attentuation*diffuse
	vColor =  ambientReflection + attenuationCoeff*(diffuseFactor * material.diffuse * pointLights[0].color);
}
` );

var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-vertex" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
