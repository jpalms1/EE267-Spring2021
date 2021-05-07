% EE 267 HW 5 Problem 1.2 Calculations
clear; close all; clc;


w0 = [0; 0; 0];
w1 = [pi/2; 0; 0]; w2 = [0; 0; -pi/2];
w3 = [0; -pi/2; 0]; w4 = [0; 0; pi/2];

dT = 1; 

theta0 = [0; 0; 0];

% Step 1:
theta1 = theta0 +dT*w1; 
theta1_deg = rad2deg(theta1)

% Step 2:
theta2 = theta1 +dT*w2; 
theta2_deg = rad2deg(theta2)

% Step 3:
theta3 = theta2 +dT*w3; 
theta3_deg = rad2deg(theta3)

% Step 4:
theta4 = theta3 +dT*w4; 
theta4_deg = rad2deg(theta4)

% iii)
theta4x = theta4(1);
theta4y = theta4(2);
theta4z = theta4(3);
Rx = [1 0 0; 0 cos(-theta4x) sin(-theta4x); 0 sin(-theta4x) cos(-theta4x) ]
Ry = [cos(-theta4y) 0 sin(-theta4y); 0 1 0; -sin(-theta4y) 0 cos(-theta4y)]
Rz = [cos(-theta4z) -sin(-theta4z) 0; sin(-theta4z) cos(-theta4z) 0; 0 0 1]

R4 = Rz*Rx*Ry
















