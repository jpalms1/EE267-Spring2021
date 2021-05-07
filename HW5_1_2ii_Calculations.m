% EE 267 HW 5 Problem 1.2ii Calculations
clear; close all; clc;
w=1; x=2; y=3; z=4;
w0 = [0; 0; 0];
w1 = [pi/2; 0; 0]; w2 = [0; 0; -pi/2];
w3 = [0; -pi/2; 0]; w4 = [0; 0; pi/2];

dT = 1; 

% Step 1:
syms theta real
q0_theta = 0; q1_theta = pi/2;
q0_v = [0; 0; 0]; q1_v = [1; 0; 0];

q0 = [cos(q0_theta/2) 
    q0_v(1)*sin(q0_theta/2) 
    q0_v(2)*sin(q0_theta/2) 
    q0_v(3)*sin(q0_theta/2)];
q1 = [cos(q1_theta/2) 
    q1_v(1)*sin(q1_theta/2) 
    q1_v(2)*sin(q1_theta/2) 
    q1_v(3)*sin(q1_theta/2)];

q1 = solveQP(q0,q1);

disp("Step 1: ")
theta = 2*acos(q1(1));

vx = q1(2)/sin(theta/2);
vy = q1(3)/sin(theta/2);
vz = q1(4)/sin(theta/2);
theta = rad2deg(2*acos(q1(1)))
v = [vx; vy; vz]

% Step 2:
syms theta real
q1_theta = dT*norm(w1);
q2_theta = dT*norm(w2);
q1_v = w1/norm(w1);
q2_v = w2/norm(w2);

q2 = [cos(q2_theta/2) 
    q2_v(1)*sin(q2_theta/2) 
    q2_v(2)*sin(q2_theta/2) 
    q2_v(3)*sin(q2_theta/2)];

q2 = solveQP(q1,q2);

disp("Step 2: ")
theta = 2*acos(q2(1));

vx = q2(2)/sin(theta/2);
vy = q2(3)/sin(theta/2);
vz = q2(4)/sin(theta/2);
theta = rad2deg(2*acos(q2(1)))
v = [vx; vy; vz]

% Step 3:
syms theta real
q2_theta = dT*norm(w2);
q3_theta = dT*norm(w3);
q2_v = w2/norm(w2);
q3_v = w3/norm(w3);

q3 = [cos(q3_theta/2) 
    q3_v(1)*sin(q3_theta/2) 
    q3_v(2)*sin(q3_theta/2) 
    q3_v(3)*sin(q3_theta/2)];

q3 = solveQP(q2,q3)

disp("Step 3: ")
theta = 2*acos(q3(1));

vx = q3(2)/sin(theta/2);
vy = q3(3)/sin(theta/2);
vz = q3(4)/sin(theta/2);
theta = rad2deg(2*acos(q3(1)))
v = [vx; vy; vz]

% Step 4:
syms theta real
q3_theta = dT*norm(w3);
q4_theta = dT*norm(w4);
q3_v = w3/norm(w3);
q4_v = w2/norm(w4);

q4 = [cos(q4_theta/2) 
    q4_v(1)*sin(q4_theta/2) 
    q4_v(2)*sin(q4_theta/2) 
    q4_v(3)*sin(q4_theta/2)];

q4 = solveQP(q3,q4);

disp("Step 4: ")
theta = 2*acos(q4(1));

vx = q4(2)/sin(theta/2);
vy = q4(3)/sin(theta/2);
vz = q4(4)/sin(theta/2);
theta = rad2deg(2*acos(q4(1)))
v = [vx; vy; vz]

function qw = solveQP(q,p)
    w=1; x=2; y=3; z=4;
    qw = [q(w)*p(w) - q(x)*p(x) - q(y)*p(y) - q(z)*p(z)
        q(w)*p(x) + q(x)*p(w) + q(y)*p(z) - q(z)*p(y)
        q(w)*p(y) - q(x)*p(z) + q(y)*p(w) + q(z)*p(x)
        q(w)*p(z) + q(x)*p(y) - q(y)*p(x) + q(z)*p(w)];
end