/**
 * @file Unwarp fragment shader
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01
 */

/* TODO (2.2.2) Fragment shader implementation */

var shaderID = "fShaderUnwarp";

var shader = document.createTextNode( `
/**
 * WebGL doesn't set any default precision for fragment shaders.
 * Precision for vertex shader is set to "highp" as default.
 * Do not use "lowp". Some mobile browsers don't support it.
 */

precision mediump float;

varying vec2 textureCoords;

// texture rendered in the first rendering pass
uniform sampler2D map;

// center of lens for un-distortion
// in normalized coordinates between 0 and 1
uniform vec2 centerCoordinate;

// [width, height] size of viewport in [mm]
// viewport is the left/right half of the browser window
uniform vec2 viewportSize;

// lens distortion parameters [K_1, K_2]
uniform vec2 K;

// distance between lens and screen in [mm]
uniform float distLensScreen;

void main() {

	gl_FragColor = texture2D( map, textureCoords );

	float K1 = K[0];
	float K2 = K[1];

	float xu = textureCoords.x * viewportSize.x;
	float yu = textureCoords.y * viewportSize.y;

	float xc = centerCoordinate.x * viewportSize.x;
	float yc = centerCoordinate.y * viewportSize.y;

	float r = sqrt( pow( (xu-xc), 2.0) + pow( (yu-yc), 2.0) )/distLensScreen;

	float xd = ( (xu - xc )*( 1.0 + K1*pow( r, 2.0) + K2*pow( r, 4.0) ))/viewportSize.x;
	float yd = ( (yu - yc )*( 1.0 + K1*pow( r, 2.0) + K2*pow( r, 4.0) ))/viewportSize.y;

	xc = xc/ viewportSize.x;
	yc = yc/ viewportSize.y;

	if ( (xd + xc ) <= 0.0 || (xd + xc ) > 1.0 || (yd + yc ) <= 0.0 || (yd + yc ) > 1.0) 
	{
		// make black
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	} 
	else 
	{
		//distort appropriately
		gl_FragColor = texture2D(map, vec2( xd + xc , yd + yc ));
	}


}
` );


var shaderNode = document.createElement( "script" );

shaderNode.id = shaderID;

shaderNode.setAttribute( "type", "x-shader/x-fragment" );

shaderNode.appendChild( shader );

document.body.appendChild( shaderNode );
