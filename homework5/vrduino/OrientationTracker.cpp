#include "OrientationTracker.h"

OrientationTracker::OrientationTracker(double imuFilterAlphaIn,  bool simulateImuIn) :

  imu(),
  gyr{0,0,0},
  acc{0,0,0},
  gyrBias{0,0,0},
  gyrVariance{0,0,0},
  accBias{0,0,0},
  accVariance{0,0,0},
  previousTimeImu(0),
  imuFilterAlpha(imuFilterAlphaIn),
  deltaT(0.0),
  simulateImu(simulateImuIn),
  simulateImuCounter(0),
  flatlandRollGyr(0),
  flatlandRollAcc(0),
  flatlandRollComp(0),
  quaternionGyr{1,0,0,0},
  eulerAcc{0,0,0},
  quaternionComp{1,0,0,0}

  {

}

void OrientationTracker::initImu() {
  imu.init();
}


/**
 * TODO: see documentation in header file
 */
void OrientationTracker::measureImuBiasVariance() {

    //set number of measurements
    int numMeasurements = 1000;

    //declare arrays of data values to be averaged
    double gyrX[numMeasurements];
    double gyrY[numMeasurements];
    double gyrZ[numMeasurements];
    double accX[numMeasurements];
    double accY[numMeasurements];
    double accZ[numMeasurements];

    int i = 0;
    while ( i < numMeasurements) {
        //check if imu.read() returns true
        if (imu.read() == true)
        {
            //then read imu.gyrX, imu.accX, ...
            gyrX[i] = imu.gyrX;
            //Serial.print("GyrX Reading: " + (String)imu.gyrX);
            gyrY[i] = imu.gyrY;
            //Serial.print(" GyrY Reading: " + (String)imu.gyrY);
            gyrZ[i] = imu.gyrZ;
            //Serial.print(" GyrZ Reading: " + (String)imu.gyrZ);
            accX[i] = imu.accX;
            //Serial.print(" AccX Reading: " + (String)imu.accX);
            accY[i] = imu.accY;
            //Serial.print(" AccY Reading: " + (String)imu.accY);
            accZ[i] = imu.accZ;
            //Serial.println(" AccZ Reading: " + (String)imu.accZ); 
            i++;
        }  
    }
    /*
    Serial.print("GyrX Array: " + (String)gyrX);
    Serial.print("GyrY Array: " + (String)gyrX);
    Serial.print("GyrZ Array: " + (String)gyrX);
    Serial.print("AccX Array: " + (String)accX);
    Serial.print("AccY Array: " + (String)accY);
    Serial.print("AccZ Array: " + (String)accZ);
*/
  //compute sum of biases:
    for (int i = 0; i < numMeasurements; i++) {
        gyrBias[0] += gyrX[i];
        gyrBias[1] += gyrY[i];
        gyrBias[2] += gyrZ[i];
        accBias[0] += accX[i];
        accBias[1] += accY[i];
        accBias[2] += accZ[i];
    }
    //Serial.println("GyrBias Sum: X: " + (String)gyrBias[0] + " Y: " + (String)gyrBias[1] + " Z: " + (String)gyrBias[2]);
    //Serial.println("AccBias Sum: X: " + (String)accBias[0] + " Y: " + (String)accBias[1] + " Z: " + (String)accBias[2]);

    //Update to get mean of bias:
    gyrBias[0] /= numMeasurements;
    gyrBias[1] /= numMeasurements;
    gyrBias[2] /= numMeasurements;
    accBias[0] /= numMeasurements;
    accBias[1] /= numMeasurements;
    accBias[2] /= numMeasurements;

    //Serial.println("GyrBias Mean: X: " + (String)gyrBias[0] + " Y: " + (String)gyrBias[1] + " Z: " + (String)gyrBias[2] );
    //Serial.println("AccBias Mean: X: " + (String)accBias[0] + " Y: " + (String)accBias[1] + " Z: " + (String)accBias[2]);

   //Compute sum of variances:
   for (int i = 0; i < numMeasurements; i++) {
        gyrVariance[0] += pow( (gyrX[i] - gyrBias[0]), 2.0);
        gyrVariance[1] += pow( (gyrY[i] - gyrBias[1]), 2.0);
        gyrVariance[2] += pow( (gyrZ[i] - gyrBias[2]), 2.0);
        accVariance[0] += pow( (accX[i] - accBias[0]), 2.0);
        accVariance[1] += pow( (accY[i] - accBias[1]), 2.0);
        accVariance[2] += pow( (accZ[i] - accBias[2]), 2.0);
    }

   //Serial.println("GyrVariance Sum: " + (String)gyrVariance[0] + " Y: " + (String)gyrVariance[1] + " Z: " + (String)gyrVariance[2]);
   //Serial.println(" AccVariance Sum: " + (String)accVariance[0] + " Y: " + (String)accVariance[1] + " Z: " + (String)accVariance[2]);

    //Update to get mean of variances:
    gyrVariance[0] /= numMeasurements;
    gyrVariance[1] /= numMeasurements;
    gyrVariance[2] /= numMeasurements;
    accVariance[0] /= numMeasurements;
    accVariance[1] /= numMeasurements;
    accVariance[2] /= numMeasurements;

    //Serial.println("GyrVariance Mean: " + (String)gyrVariance[0] + " Y: " + (String)gyrVariance[1] + " Z: " + (String)gyrVariance[2]);
    //Serial.println(" AccVariance Mean: " + (String)accVariance[0] + " Y: " + (String)accVariance[1] + " Z: " + (String)accVariance[2]);
}

void OrientationTracker::setImuBias(double bias[3]) {

  for (int i = 0; i < 3; i++) {
    gyrBias[i] = bias[i];
  }

}

void OrientationTracker::resetOrientation() {

  flatlandRollGyr = 0;
  flatlandRollAcc = 0;
  flatlandRollComp = 0;
  quaternionGyr = Quaternion();
  eulerAcc[0] = 0;
  eulerAcc[1] = 0;
  eulerAcc[2] = 0;
  quaternionComp = Quaternion();

}

bool OrientationTracker::processImu() {

  if (simulateImu) {

    //get imu values from simulation
    updateImuVariablesFromSimulation();

  } else {

    //get imu values from actual sensor
    if (!updateImuVariables()) {

      //imu data not available
      return false;

    }

  }

  //run orientation tracking algorithms
  updateOrientation();

  return true;

}

void OrientationTracker::updateImuVariablesFromSimulation() {

    deltaT = 0.002;
    //get simulated imu values from external file
    for (int i = 0; i < 3; i++) {
      gyr[i] = imuData[simulateImuCounter + i];
    }
    simulateImuCounter += 3;
    for (int i = 0; i < 3; i++) {
      acc[i] = imuData[simulateImuCounter + i];
    }
    simulateImuCounter += 3;
    simulateImuCounter = simulateImuCounter % nImuSamples;

    //simulate delay
    delay(1);

}

/**
 * TODO: see documentation in header file
 */
bool OrientationTracker::updateImuVariables() {

  //sample imu values
  if (!imu.read()) {
  // return false if there's no data
    return false;
  }

  //call micros() to get current time in microseconds
  double currentTime = micros();
  
  //update: deltaT (in seconds) and previousTimeImu (in seconds)
  deltaT = (currentTime / 1000000) - previousTimeImu;
  previousTimeImu = (currentTime / 1000000); //in seconds

  //read imu.gyrX, imu.accX ...
  //update:
  //gyr[0], ...
  //acc[0], ...

  // You also need to appropriately modify the update of gyr as instructed in (2.1.3).
  gyr[0] = imu.gyrX - gyrBias[0];
  gyr[1] = imu.gyrY - gyrBias[1];
  gyr[2] = imu.gyrZ - gyrBias[2];

  acc[0] = imu.accX;
  acc[1] = imu.accY;
  acc[2] = imu.accZ;

  return true;

}


/**
 * TODO: see documentation in header file
 */
void OrientationTracker::updateOrientation() {

  //call functions in OrientationMath.cpp.
  //use only class variables as arguments to functions.

  //update:
  //flatlandRollGyr
    flatlandRollGyr = computeFlatlandRollGyr(flatlandRollGyr, gyr,  deltaT);
  //flatlandRollAcc
    flatlandRollAcc = computeFlatlandRollAcc(acc);
  //flatlandRollComp
    flatlandRollComp = computeFlatlandRollComp(flatlandRollComp, gyr, flatlandRollAcc, deltaT, imuFilterAlpha);
  //quaternionGyr
  //eulerAcc
  //quaternionComp




}
