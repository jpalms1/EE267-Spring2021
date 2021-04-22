/**
 * @file Fragment shader for foveated rendering
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01
 */

/* TODO (2.2.4) Fragment Shader Foveation Blur */

var shaderID = "fShaderFoveated";

var shader = document.createTextNode( `
/***
 * WebGL doesn't set any default precision for fragment shaders.
 * Precision for vertex shader is set to "highp" as default.
 * Do not use "lowp". Some mobile browsers don't support it.
 */
precision mediump float;

// texture or uv coordinates of current fragment in normalized coordinates [0,1]
varying vec2 textureCoords;

// texture map from the first rendering pass
uniform sampler2D textureMap;

// resolution of the window in [pixels]
uniform vec2 windowSize;

// window space coordinates of gaze position in [pixels]
uniform vec2 gazePosition;

// eccentricity angle at boundary of foveal and middle layers
uniform float e1;

// eccentricity angle at boundary of middle and outer layers
uniform float e2;

// visual angle of one pixel
uniform float pixelVA;

// radius of middle layer blur kernel [in pixels]
const float middleKernelRad = 2.0;

// radius of outer layer blur kernel [in pixels]
const float outerKernelRad = 4.0;

// gaussian blur kernel for middle layer (5x5)
uniform float middleBlurKernel[int(middleKernelRad)*2+1];

// gaussian blur kernel for outer layer (9x9)
uniform float outerBlurKernel[int(outerKernelRad)*2+1];


void main() {

	gl_FragColor = texture2D( textureMap,  textureCoords );

	//Convert x,y window coordinates to NDC coordinates
	float xWindow = gazePosition[0];
	float yWindow = gazePosition[1];
	
	// calculate eccentricity 
	float eccentricity = sqrt( pow(xWindow - windowSize.x*textureCoords.x, 2.0) + pow(yWindow - windowSize.y*textureCoords.y, 2.0) ) * pixelVA;

	// Set Output Color by Averagining Neighboring Pixels in the Color Image:

	//if eccentricity is outside the bounds of the middle kernel
	if ( eccentricity < e1) {
		gl_FragColor = vec4(0.0,  0.0,  0.0, 1.0);
		// perform the outer product and texture lookup in neighboring pixels:
		gl_FragColor += texture2D( textureMap, textureCoords);

	}



	// if eccentricity is within the bounds of the middle kernel
	if ( eccentricity >= e1 && eccentricity <= e2) {
		gl_FragColor = vec4(0.0,  0.0,  0.0, 1.0);
		for (int i = -int(middleKernelRad); i <= int(middleKernelRad); i++ ){
			for (int j = -int(middleKernelRad); j <= int(middleKernelRad); j++ ){
				// Find neighboring coordinates:
				vec2 neigboringCoordsMiddle = vec2(textureCoords.x + float(i)/windowSize.x, textureCoords.y + float(j)/windowSize.y );

				// perform the outer product and texture lookup in neighboring pixels:
				gl_FragColor += middleBlurKernel[ i + int(middleKernelRad) ] 
					* middleBlurKernel[ j + int(middleKernelRad) ]
					* texture2D( textureMap, neigboringCoordsMiddle);
			}
		}
	}

	// if outside the bounds and now in the outer kernel
	else if ( eccentricity >e2) {
		gl_FragColor = vec4(0.0,  0.0,  0.0, 1.0);
		for (int i = -int(outerKernelRad); i <= int(outerKernelRad); i++ ){
			for (int j = -int(outerKernelRad); j <= int(outerKernelRad); j++ ){
				// Find neighboring coordinates:
				vec2 neigboringCoordsOuter = vec2(textureCoords.x + float(i)/windowSize.x, textureCoords.y + float(j)/windowSize.y );

				// perform the outer product and texture lookup in neighboring pixels:
				gl_FragColor += outerBlurKernel[ i + int(outerKernelRad) ] 
					* outerBlurKernel[ j + int(outerKernelRad) ]
					* texture2D( textureMap, neigboringCoordsOuter);
			}
		}
	}	
	
	/*
	// Check bounds
	if ( eccentricity >= e1 && eccentricity <= e1+0.1) {
		gl_FragColor = vec4(1.0,  0.0,  0.0, 1.0);
	}
	if ( eccentricity >= e2-0.1 && eccentricity <= e2) {
		gl_FragColor = vec4(1.0,  0.0,  0.0, 1.0);
	}
	*/
}
` );

var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-fragment" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
