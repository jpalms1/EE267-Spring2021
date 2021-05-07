% EE 267 HW 5 Problem 1.2iv Calculations
clear; close all; clc;
w=1; x=2; y=3; z=4;
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