export type SimMode = 'ballistics' | 'oscillator' | 'titration' | 'chaos';

export interface BallisticParams {
  velocity: number; // m/s
  angle: number; // degrees
  gravity: number; // m/s^2
  dragCoeff: number; // Cd
  mass: number; // kg
  noisePercent: number; // simulated sensor jitter %
}

export interface OscillatorParams {
  mass: number; // kg
  springConstant: number; // N/m
  damping: number; // N s/m
  drivingForce: number; // N
  drivingFreq: number; // rad/s
}

export interface TitrationParams {
  acidType: 'strong' | 'weak';
  acidConc: number; // M (mol/L)
  acidVol: number; // mL
  baseConc: number; // M (NaOH)
  pKa: number; // for weak acid (e.g. 4.76 for acetic acid)
}

export interface ChaosParams {
  l1: number;
  l2: number;
  m1: number;
  m2: number;
  theta1: number; // rad
  theta2: number; // rad
}
