/**
 * @file Phong fragment shader
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01
 */

/* TODO (2.2.2) */

var shaderID = "fShaderPhong";

var shader = document.createTextNode( `
/**
 * WebGL doesn't set any default precision for fragment shaders.
 * Precision for vertex shader is set to "highp" as default.
 * Do not use "lowp". Some mobile browsers don't support it.
 */
precision mediump float;

varying vec3 normalCam; // Normal in view coordinate
varying vec3 fragPosCam; // Fragment position in view cooridnate

uniform mat4 viewMat;

struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};

uniform Material material;

uniform vec3 attenuation;

uniform vec3 ambientLightColor;


/***
 * NUM_POINT_LIGHTS is replaced to the number of point lights by the
 * replaceNumLights() function in teapot.js before the shader is compiled.
 */
#if NUM_POINT_LIGHTS > 0

	struct PointLight {
		vec3 position;
		vec3 color;
	};

	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

#endif


void main() {
	// Aggregate specular and diffuse components
	vec3 fColorSum;

	// Compute ambient reflection
	vec3 ambientReflection = material.ambient * ambientLightColor;

	vec3 fColor = ambientReflection;

	gl_FragColor = vec4( fColor, 1.0 );

	// Set vertex position
	vec3 positionView3 = fragPosCam;

	// Re-normalize normalCam
	vec3 normalView = normalize( normalCam );

	// Attenuation parameters
	float kc = attenuation[0];
	float kl = attenuation[1];
	float kq = attenuation[2];

	for (int i = 0; i < NUM_POINT_LIGHTS; i++)
	{
		// transform light position into view space 
		vec4 lightPositionView = viewMat * vec4( pointLights[i].position , 1.0);
		vec3 lightPositionView3 = vec3( lightPositionView );

		// Compute diffuse term
		float diffuseFactor = max( dot( normalView, -normalize( lightPositionView3 )) , 0.0);

		// Calculate distance between light source and vertex
		float d = length( positionView3 - lightPositionView3 );

		float attenuationCoeff = 1.0/(kc + kl*d + kq*d*d);

		//Specular parameters
		vec3 L = -normalize( lightPositionView3 );
		vec3 N = normalView;
		vec3 R = 2.0*dot(N, L)*N - L;
		vec3 V = -normalize( positionView3 );

		float specularFactor = pow( max( dot(R, V), 0.0), material.shininess);

		// Add point light sources to vColor -- sigma( attentuation*(specular +diffuse) )
		fColorSum +=  attenuationCoeff*((specularFactor * material.specular * pointLights[i].color) + (diffuseFactor * material.diffuse * pointLights[i].color));
	}
	// Total fColor -- ambient + sigma( attentuation*(specular + diffuse) )
	gl_FragColor.rgb =  ambientReflection + fColorSum;

}
` );


var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-fragment" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
