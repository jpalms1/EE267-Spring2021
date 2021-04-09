
/**
 * @file functions to compute model/view/projection matrices
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01

 */

/**
 * MVPmat
 *
 * @class MVPmat
 * @classdesc Class for holding and computing model/view/projection matrices.
 *
 * @param  {DisplayParameters} dispParams    display parameters
 */
var MVPmat = function ( dispParams ) {

	// Alias for accessing this from a closure
	var _this = this;


	// A model matrix
	this.modelMat = new THREE.Matrix4();

	// A view matrix
	this.viewMat = new THREE.Matrix4();

	// A projection matrix
	this.projectionMat = new THREE.Matrix4();


	var topViewMat = new THREE.Matrix4().set(
		1, 0, 0, 0,
		0, 0, - 1, 0,
		0, 1, 0, - 1500,
		0, 0, 0, 1 );

	/* Functions */

	// A function to compute a model matrix based on the current state
	//
	// INPUT
	// state: state of StateController
	function computeModelTransform( state ) {
	
		/* TODO (2.1.1.3) Matrix Update / (2.1.2) Model Rotation  */
		//Angles 
		var thetaX = (Math.PI/180)*state.modelRotation.x;
		var thetaY = (Math.PI/180)*state.modelRotation.y;

		var m = new THREE.Matrix4();

		var mX = new THREE.Matrix4();
		var mY = new THREE.Matrix4();
		var mT = new THREE.Matrix4();

		mX.makeRotationX( thetaX );
		mY.makeRotationY( thetaY );
		mT.makeTranslation( state.modelTranslation.x, state.modelTranslation.y, state.modelTranslation.z);
		m.multiplyMatrices(mX, mY);
		m.multiplyMatrices(m, mT);

		return m;
	}

	// A function to compute a view matrix based on the current state
	//
	// NOTE
	// Do not use lookAt().
	//
	// INPUT
	// state: state of StateController
	function computeViewTransform( state ) {

		/* TODO (2.2.3) Implement View Transform */
		var eyeX = state.viewerPosition.x;
		var eyeY = state.viewerPosition.y;
		var eyeZ = state.viewerPosition.z;
		var eye = new THREE.Vector3();
		
		eye.set(eyeX, eyeY, eyeZ);

		var centerX = state.viewerTarget.x;
		var centerY = state.viewerTarget.y;
		var centerZ = state.viewerTarget.z;
		var center = new THREE.Vector3();
		center.set(centerX, centerY, centerZ);
	
		//console.log("eye ",eye);
		//console.log("center ", center);

		var zNum = new THREE.Vector3();
		zNum.subVectors(eye, center);

		var zDen = Math.sqrt(Math.pow((eyeX-centerX),2) + Math.pow((eyeY-centerY),2) + Math.pow((eyeZ-centerZ),2) );

		console.log("zNum " , zNum);
		console.log("zDen " , zDen);
		
		zNum.divideScalar(zDen);
		var zc = zNum;
		console.log("zc ",zc);

		var up = new THREE.Vector3(0, 1, 0);

		var upzc = new THREE.Vector3();
		upzc.crossVectors(up,zc);
		
		var upzcNorm =  Math.sqrt(Math.pow((upzc.x),2) + Math.pow((upzc.y),2) + Math.pow((upzc.z),2) );
		
		upzc.divideScalar(upzcNorm);
		var xc = upzc;
		
		console.log("upzc ", upzc);
		console.log("xc ", xc);
		console.log("upzcNorm ", upzcNorm);

		var yc = new THREE.Vector3();;
		yc.crossVectors(zc,xc);

		var m = new THREE.Matrix4().set(
			xc.x, xc.y, xc.z, -(xc.x*eye.x + xc.y*eye.y + xc.z*eye.z),
			yc.x, yc.y, yc.z, -(yc.x*eye.x + yc.y*eye.y + yc.z*eye.z),
			zc.x, zc.y, zc.z, -(zc.x*eye.x + zc.y*eye.y + zc.z*eye.z),
			0, 0, 0, 1 );
		console.log(m);

		return m;
		/* Original	
		return new THREE.Matrix4().set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, - 800,
			0, 0, 0, 1 );
		*/
	}

	// A function to compute a perspective projection matrix based on the
	// current state
	//
	// NOTE
	// Do not use makePerspective().
	//
	// INPUT
	// Notations for the input is the same as in the class.
	function computePerspectiveTransform( left, right, top, bottom, clipNear, clipFar ) {

		/* TODO (2.3.1) Implement Perspective Projection */
		return new THREE.Matrix4().set(
			2*clipNear/(right - left), 0, (right + left)/(right - left),  0,
			0, 2*clipNear/(top - bottom), (top + bottom)/(top - bottom), 0,
			0, 0, -(clipFar + clipNear)/(clipFar - clipNear), -2*(clipFar*clipNear)/(clipFar - clipNear),
			0, 0, - 1.0, 0 );

		/* Original
		return new THREE.Matrix4().set(
			6.7, 0, 0, 0,
			0, 6.5, 0, 0,
			0, 0, - 1.0, - 2.0,
			0, 0, - 1.0, 0 );
		*/
	}

	// A function to compute a orthographic projection matrix based on the
	// current state
	//
	// NOTE
	// Do not use makeOrthographic().
	//
	// INPUT
	// Notations for the input is the same as in the class.
	function computeOrthographicTransform( left, right, top, bottom, clipNear, clipFar ) {

		/* TODO (2.3.2) Implement Orthographic Projection */
		return new THREE.Matrix4().set(
			2/(right - left), 0,  0, -(right + left)/(right - left), 
			0, 2/(top - bottom), 0, -(top + bottom)/(top - bottom),
			0, 0, -2/(clipFar - clipNear), -(clipFar + clipNear)/(clipFar - clipNear),
			0, 0, 0, 1 );

		//return new THREE.Matrix4();
	}

	// Update the model/view/projection matrices
	// This function is called in every frame (animate() function in render.js).
	function update( state ) {

		// Compute model matrix
		this.modelMat.copy( computeModelTransform( state ) );

		// Use the hard-coded view and projection matrices for top view
		if ( state.topView ) {

			this.viewMat.copy( topViewMat );

			var right = ( dispParams.canvasWidth * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

			var left = - right;

			var top = ( dispParams.canvasHeight * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

			var bottom = - top;

			this.projectionMat.makePerspective( left, right, top, bottom, 1, 10000 );

		} else {

			// Compute view matrix
			this.viewMat.copy( computeViewTransform( state ) );

			// Compute projection matrix
			if ( state.perspectiveMat ) {

				var right = ( dispParams.canvasWidth * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

				var left = - right;

				var top = ( dispParams.canvasHeight * dispParams.pixelPitch / 2 )
				* ( state.clipNear / dispParams.distanceScreenViewer );

				var bottom = - top;

				this.projectionMat.copy( computePerspectiveTransform(
					left, right, top, bottom, state.clipNear, state.clipFar ) );

			} else {

				var right = dispParams.canvasWidth * dispParams.pixelPitch / 2;

				var left = - right;

				var top = dispParams.canvasHeight * dispParams.pixelPitch / 2;

				var bottom = - top;

				this.projectionMat.copy( computeOrthographicTransform(
					left, right, top, bottom, state.clipNear, state.clipFar ) );

			}

		}

	}



	/* Expose as public functions */

	this.computeModelTransform = computeModelTransform;

	this.computeViewTransform = computeViewTransform;

	this.computePerspectiveTransform = computePerspectiveTransform;

	this.computeOrthographicTransform = computeOrthographicTransform;

	this.update = update;

};
