#include "OrientationMath.h"

/** TODO: see documentation in header file */
double computeAccPitch(double acc[3]) {

	double accNorm = sqrt( sq( acc[0] ) + sq( acc[1] ) + sq( acc[2] ) );
	acc[0] /= accNorm;
	acc[1] /= accNorm;
	acc[2] /= accNorm;

	// Check sign to deal with sign(ay)
	if (acc[1] > 0) 
	{
		return -atan2( acc[2], sqrt(sq(acc[0]) + sq(acc[1])) ) * (180 / PI);
	}
	else 
	{
		return -atan2( acc[2], -sqrt( sq( acc[0] ) + sq( acc[1] ) ) ) * (180 / PI);
	}
}

/** TODO: see documentation in header file */
double computeAccRoll(double acc[3]) {

	double accNorm = sqrt(sq(acc[0]) + sq(acc[1]) + sq(acc[2]));

	return -atan2(-acc[0] / accNorm, acc[1] / accNorm) * (180 / PI);

}

/** TODO: see documentation in header file */
double computeFlatlandRollGyr(double flatlandRollGyrPrev, double gyr[3], double deltaT) {

  //Edit only the roll value
  return flatlandRollGyrPrev + (gyr[2]*deltaT);

}

/** TODO: see documentation in header file */
double computeFlatlandRollAcc(double acc[3]) {

  return atan2(acc[0],acc[1])*(180/PI);

}

/** TODO: see documentation in header file */
double computeFlatlandRollComp(double flatlandRollCompPrev, double gyr[3], double flatlandRollAcc, double deltaT, double alpha) {

	return alpha * (computeFlatlandRollGyr(flatlandRollCompPrev, gyr, deltaT)) + (1 - alpha) * flatlandRollAcc;

}


/** TODO: see documentation in header file */
void updateQuaternionGyr(Quaternion& q, double gyr[3], double deltaT) {
  // q is the previous quaternion estimate
  // update it to be the new quaternion estimate
	
	double normGyrAxis = sqrt( sq( gyr[0] ) + sq( gyr[1] ) + sq( gyr[2] ) );

	// check if norm is too small
	if (normGyrAxis < pow(10, -8))
	{
		//Ignore measurement
		normGyrAxis = 1;
	}

	Quaternion q1 = q.clone();
	
	//angle in radians to degree??????
	double angle = deltaT * normGyrAxis;// * (180/PI);
	Serial.println("ANGLE: " + (String)angle);
	//qDelta
	Quaternion qDelta = q1.setFromAngleAxis(angle, gyr[0] / normGyrAxis, gyr[1] / normGyrAxis, gyr[2] / normGyrAxis );
	
	// Find q from equation q_i+1 = q_i*qDelta
	q = q.multiply( q, qDelta );

	//normalize q for proper rotation
	q.normalize();
	
}


/** TODO: see documentation in header file */
void updateQuaternionComp(Quaternion& q, double gyr[3], double acc[3], double deltaT, double alpha) {
  // q is the previous quaternion estimate
  // update it to be the new quaternion estimate

	//Make copy to preserve original q
	Quaternion q1 = q.clone();

	//(i) Query qDelta and (ii) Update quaternion
	updateQuaternionGyr(q1, gyr, deltaT);

	//(iii) Query acc and create quaternion
	Quaternion qAcc(0, acc[0], acc[1], acc[2]);

	//(iv) Rotate quaternion from sensor frame to inertial frame
	//an normalize it
	Quaternion qAccW = qAcc.rotate(q1);
	qAccW.normalize();

	//(v) Compute phi, the angle between the 2 vector components
	float phi = acos(qAccW.q[2]) * 180 / PI;

	//(vi) Find n, the normalized rotation axis
	double n = sqrt( sq( -qAccW.q[3]) + sq(qAccW.q[1] ) );

	//vx = norm(-vz)
	double vx = -qAccW.q[3] / n;
	//vz = norm(vx)
	double vz = qAccW.q[1] / n;

	//Tilt correction quaternion
	Quaternion qt = q.setFromAngleAxis((1 - alpha) * phi, vx, 0.0, vz);
	
	//(vii) Implement filter by multiplying tilt correction quaternion
	// with the current estimate of rotation quaternion
	q = q.multiply(qt, q1);
	//Normalize resulting quaternion
	q.normalize();
}
