/**
 * Quaternion class
 *
 * We are using C++! Not JavaScript!
 * Unlike JavaScript, "this" keyword is representing a pointer!
 * If you want to access the member variable q[0], you should write
 * this->q[0].
 *
 * @copyright The Board of Trustees of the Leland Stanford Junior University
 * @version 2021/04/01
 */

#ifndef QUATERNION_H
#define QUATERNION_H

#include "Arduino.h"

class Quaternion {
public:

  /***
   * public member variables to hold the values
   *
   * Definition:
   * q = q[0] + q[1] * i + q[2] * j + q[3] * k
   */
  double q[4];


  /* Default constructor */
  Quaternion() :
    q{1.0, 0.0, 0.0, 0.0} {}


  /* Constructor with some inputs */
  Quaternion(double q0, double q1, double q2, double q3) :
    q{q0, q1, q2, q3} {}


  /* function to create another quaternion with the same values. */
  Quaternion clone() {

    return Quaternion(this->q[0], this->q[1], this->q[2], this->q[3]);

  }

  /* function to construct a quaternion from angle-axis representation. angle is given in degrees. */
  Quaternion& setFromAngleAxis(double angle, double vx, double vy, double vz) {

    //this->q[0] = ...
    //convert angle to radians
      angle *= ( PI / 180.0 );
      *this = Quaternion(cos(angle/2.0), vx * sin(angle/2.0), vy * sin(angle/2.0), vz * sin(angle/2.0));
    return *this;

  }

  /* function to compute the length of a quaternion */
  double length() {

    return sqrt( pow(this->q[0], 2.0) + pow(this->q[1], 2.0) + pow(this->q[2], 2.0) + pow(this->q[3], 2.0) );

  }

  /* function to normalize a quaternion */
  Quaternion& normalize() {

    //this->q[0] = ...
      double L = length();
      *this = Quaternion(this->q[0] / L, this->q[1] / L, this->q[2] / L, this->q[3] / L);

    return *this;
  }

  /* function to invert a quaternion */
  Quaternion& inverse() {

    //this->q[0] = ...

      double L = length();
      *this = Quaternion(this->q[0] / sq(L), -this->q[1] / sq(L), -this->q[2] / sq(L), -this->q[3] / sq(L));
    return *this;
  }

  /* function to multiply two quaternions */
  Quaternion multiply(Quaternion a, Quaternion b) {

    Quaternion q;

    //q.q[0] = ...

    return Quaternion(a.q[0] * b.q[0] - a.q[1] * b.q[1] - a.q[2] * b.q[2] - a.q[3] * b.q[3],
                      a.q[0] * b.q[1] + a.q[1] * b.q[0] + a.q[2] * b.q[3] - a.q[3] * b.q[2],
                      a.q[0] * b.q[2] - a.q[1] * b.q[3] + a.q[2] * b.q[0] + a.q[3] * b.q[1],
                      a.q[0] * b.q[3] + a.q[1] * b.q[2] - a.q[2] * b.q[1] + a.q[3] * b.q[0] );
  }

  /* function to rotate a quaternion by r * q * r^{-1} */
  Quaternion rotate(Quaternion r) {
      
      // Create copies of quaternions to manipulate without 
      // altering original values
      Quaternion r1 = r.clone();
      Quaternion q = clone();

      return multiply(multiply(r, q), r1.inverse());

  }


  /* helper function to print out a quaternion */
  void serialPrint() {
    Serial.print(q[0]);
    Serial.print(" ");
    Serial.print(q[1]);
    Serial.print(" ");
    Serial.print(q[2]);
    Serial.print(" ");
    Serial.print(q[3]);
    Serial.println();
  }
};

#endif // ifndef QUATERNION_H
