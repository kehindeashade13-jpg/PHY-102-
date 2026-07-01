/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

export const MAXWELLS_EQUATIONS_QUESTIONS: Question[] = [
  {
    id: "phy102-me-01",
    sec: "Maxwell's Equations",
    question: "Which of Maxwell's equations mathematically states that magnetic monopoles do not exist?",
    options: [
      "∮ E · dA = q / ε0",
      "∮ B · dA = 0",
      "∮ E · dl = -dΦB/dt",
      "∮ B · dl = μ0 * (I + ε0 * dΦE/dt)"
    ],
    correctAnswer: "∮ B · dA = 0",
    explanation: "Gauss's Law for Magnetism, ∮ B · dA = 0 (or in differential form, ∇ · B = 0), states that the net magnetic flux through any closed surface is zero. This implies that magnetic field lines are continuous loops without start or end, meaning isolated magnetic monopoles do not exist."
  },
  {
    id: "phy102-me-02",
    sec: "Maxwell's Equations",
    question: "What is the differential form of Faraday's Law of electromagnetic induction?",
    options: [
      "∇ · E = ρ / ε0",
      "∇ × E = 0",
      "∇ × E = -∂B/∂t",
      "∇ × B = μ0 * J"
    ],
    correctAnswer: "∇ × E = -∂B/∂t",
    explanation: "Faraday's Law in differential form is ∇ × E = -∂B/∂t. This states that a time-varying magnetic field produces a curl of an electric field (a non-conservative, circulating electric field)."
  },
  {
    id: "phy102-me-03",
    sec: "Maxwell's Equations",
    question: "Maxwell added a correction term to Ampere's Law to resolve a logical inconsistency during the charging of a capacitor. What is this term called?",
    options: [
      "Conduction current",
      "Eddy current",
      "Displacement current",
      "Polarization current"
    ],
    correctAnswer: "Displacement current",
    explanation: "The correction term ε0 * dΦE/dt is called the displacement current (or displacement current density J_d = ε0 * ∂E/∂t in differential form). It accounts for magnetic fields created by time-varying electric fields, ensuring the continuity of current in circuits containing gaps like capacitors."
  },
  {
    id: "phy102-me-04",
    sec: "Maxwell's Equations",
    question: "Calculate the displacement current between the plates of a parallel-plate capacitor if the electric flux through the plates is changing at a rate of 2.0 × 10^11 V·m/s. (Take ε0 = 8.85 × 10^-12 F/m)",
    options: [
      "1.77 A",
      "0.177 A",
      "17.7 A",
      "1.77 mA"
    ],
    correctAnswer: "1.77 A",
    explanation: "Displacement current is defined as I_d = ε0 * (dΦE/dt). Substituting the given values: I_d = (8.85 × 10^-12 F/m) * (2.0 × 10^11 V·m/s) = 1.77 A."
  },
  {
    id: "phy102-me-05",
    sec: "Maxwell's Equations",
    question: "In free space (vacuum with ρ = 0 and J = 0), which of the following represents the differential form of Ampere-Maxwell's Law?",
    options: [
      "∇ × B = μ0 * ε0 * ∂E/∂t",
      "∇ × B = μ0 * J",
      "∇ × B = -∂E/∂t",
      "∇ · B = 0"
    ],
    correctAnswer: "∇ × B = μ0 * ε0 * ∂E/∂t",
    explanation: "In free space, conduction current density J is 0. The Ampere-Maxwell equation ∇ × B = μ0 * (J + ε0 * ∂E/∂t) simplifies to ∇ × B = μ0 * ε0 * ∂E/∂t."
  },
  {
    id: "phy102-me-06",
    sec: "Maxwell's Equations",
    question: "The speed of electromagnetic waves in a vacuum, c, is determined by which fundamental constants from Maxwell's equations?",
    options: [
      "c = 1 / (μ0 * ε0)",
      "c = sqrt(μ0 * ε0)",
      "c = 1 / sqrt(μ0 * ε0)",
      "c = μ0 / ε0"
    ],
    correctAnswer: "c = 1 / sqrt(μ0 * ε0)",
    explanation: "By solving Maxwell's equations in free space, we get the wave equation where the wave speed c is found to be c = 1 / sqrt(μ0 * ε0) ≈ 3.00 × 10^8 m/s."
  },
  {
    id: "phy102-me-07",
    sec: "Maxwell's Equations",
    question: "The vector S representing the energy flux density (rate of energy transfer per unit area) of an electromagnetic wave is called:",
    options: [
      "Lorentz vector",
      "Poynting vector",
      "Gauss vector",
      "Maxwell vector"
    ],
    correctAnswer: "Poynting vector",
    explanation: "The Poynting vector S, defined as S = (1 / μ0) * (E × B), represents the directional energy flux density of an electromagnetic wave. Its unit is Watts per square meter (W/m^2)."
  },
  {
    id: "phy102-me-08",
    sec: "Maxwell's Equations",
    question: "For a plane electromagnetic wave propagating in a vacuum, what is the relationship between the amplitudes of the electric field E0 and magnetic field B0?",
    options: [
      "B0 = c * E0",
      "E0 = c * B0",
      "E0 = c^2 * B0",
      "E0 * B0 = c"
    ],
    correctAnswer: "E0 = c * B0",
    explanation: "From Maxwell's equations applied to harmonic plane waves, the ratio of the electric field magnitude to the magnetic field magnitude at any point is always equal to the speed of light: E0 / B0 = c, hence E0 = c * B0."
  },
  {
    id: "phy102-me-09",
    sec: "Maxwell's Equations",
    question: "Which equation represents the continuity of electric charge, expressing conservation of charge, which is mathematically embedded in Maxwell's equations?",
    options: [
      "∇ · J = -∂ρ/∂t",
      "∇ × J = ∂ρ/∂t",
      "∇ · J = 0",
      "∇ · B = -∂ρ/∂t"
    ],
    correctAnswer: "∇ · J = -∂ρ/∂t",
    explanation: "Taking the divergence of the Ampere-Maxwell law (∇ · (∇ × B) = 0) requires that ∇ · J + ∂ρ/∂t = 0, which is the equation of continuity representing the conservation of charge: the net outward current equals the rate of decrease of charge density."
  },
  {
    id: "phy102-me-10",
    sec: "Maxwell's Equations",
    question: "What is the total instantaneous energy density u stored in an electromagnetic wave in a vacuum?",
    options: [
      "u = ε0 * E^2 + B^2 / μ0",
      "u = 1/2 * ε0 * E^2 + 1/2 * B^2 / μ0",
      "u = 1/2 * (E^2 / ε0 + B^2 * μ0)",
      "u = ε0 * B^2 + E^2 / μ0"
    ],
    correctAnswer: "u = 1/2 * ε0 * E^2 + 1/2 * B^2 / μ0",
    explanation: "The total energy density u of an electromagnetic field is the sum of the electric energy density (1/2 * ε0 * E^2) and the magnetic energy density (1/2 * B^2 / μ0)."
  },
  {
    id: "phy102-me-11",
    sec: "Maxwell's Equations",
    question: "If an electromagnetic wave is traveling through a non-magnetic dielectric medium with a relative permittivity (dielectric constant) of εr = 4.0, what is the speed of the wave in this medium?",
    options: [
      "3.0 × 10^8 m/s",
      "1.5 × 10^8 m/s",
      "6.0 × 10^8 m/s",
      "0.75 × 10^8 m/s"
    ],
    correctAnswer: "1.5 × 10^8 m/s",
    explanation: "The wave speed in a medium is v = 1 / sqrt(μ * ε). For non-magnetic media (μ ≈ μ0), v = c / sqrt(εr). Substituting εr = 4.0: v = c / sqrt(4) = c / 2 = 1.5 × 10^8 m/s."
  },
  {
    id: "phy102-me-12",
    sec: "Maxwell's Equations",
    question: "Which of the following is a key boundary condition for the electric field at the boundary interface between two different dielectric materials?",
    options: [
      "The normal component of E is continuous across the boundary.",
      "The tangential component of E is continuous across the boundary.",
      "The tangential component of E always drops to zero.",
      "The normal component of D is always zero."
    ],
    correctAnswer: "The tangential component of E is continuous across the boundary.",
    explanation: "By applying Faraday's Law (∮ E · dl = 0 in electrostatic limits) to a thin rectangular loop across an interface, it is shown that the tangential component of the electric field is continuous across any boundary: E_t1 = E_t2."
  },
  {
    id: "phy102-me-13",
    sec: "Maxwell's Equations",
    question: "Which boundary condition applies to the magnetic field B at any boundary interface?",
    options: [
      "The normal component of B is continuous.",
      "The tangential component of B is continuous.",
      "The normal component of B is always zero.",
      "The normal component of B is discontinuous by surface charge density."
    ],
    correctAnswer: "The normal component of B is continuous.",
    explanation: "According to Gauss's Law for Magnetism (∮ B · dA = 0), applying a pillbox surface at an interface shows that the normal component of the magnetic B-field must be continuous across the boundary: B_n1 = B_n2."
  },
  {
    id: "phy102-me-14",
    sec: "Maxwell's Equations",
    question: "Under static conditions (time-independent fields), the curl of the electric field is zero (∇ × E = 0). This indicates that:",
    options: [
      "Static electric fields are non-conservative.",
      "Static electric fields are conservative and can be written as the gradient of a scalar potential (E = -∇V).",
      "Magnetic fields must also be zero.",
      "Charges cannot move."
    ],
    correctAnswer: "Static electric fields are conservative and can be written as the gradient of a scalar potential (E = -∇V).",
    explanation: "A curl-free vector field (∇ × E = 0) is a conservative field. This allows the electrostatic field to be expressed as the negative gradient of a electric scalar potential V: E = -∇V."
  },
  {
    id: "phy102-me-15",
    sec: "Maxwell's Equations",
    question: "A time-varying magnetic field B = B0 * sin(ωt) k is applied. What can be concluded about the resulting electric field?",
    options: [
      "The electric field is static.",
      "The electric field is conservative.",
      "The electric field is non-conservative and has a non-zero curl.",
      "No electric field is created."
    ],
    correctAnswer: "The electric field is non-conservative and has a non-zero curl.",
    explanation: "By Faraday's Law (∇ × E = -∂B/∂t), a time-varying magnetic field produces a non-zero curl of E, which means the induced electric field is non-conservative (work done over a closed loop is non-zero)."
  },
  {
    id: "phy102-me-16",
    sec: "Maxwell's Equations",
    question: "The displacement current density is mathematically defined as:",
    options: [
      "J_d = ε0 * (∂E/∂t)",
      "J_d = μ0 * (∂B/∂t)",
      "J_d = ∂D/∂x",
      "J_d = σ * E"
    ],
    correctAnswer: "J_d = ε0 * (∂E/∂t)",
    explanation: "The displacement current density is defined as J_d = ∂D/∂t. In linear, isotropic media, D = ε * E, so in a vacuum or free space, J_d = ε0 * (∂E/∂t)."
  },
  {
    id: "phy102-me-17",
    sec: "Maxwell's Equations",
    question: "Maxwell's formulation of electromagnetism unified which two historically separate areas of physics?",
    options: [
      "Thermodynamics and Mechanics",
      "Electricity and Magnetism (and showed light is an electromagnetic wave)",
      "Gravity and Nuclear forces",
      "Quantum Mechanics and Relativity"
    ],
    correctAnswer: "Electricity and Magnetism (and showed light is an electromagnetic wave)",
    explanation: "Maxwell's equations unified electricity and magnetism into electromagnetism, and his prediction of electromagnetic wave propagation with speed equal to the speed of light unified optics with electromagnetism."
  },
  {
    id: "phy102-me-18",
    sec: "Maxwell's Equations",
    question: "A plane electromagnetic wave propagates along the positive z-axis. If the electric field vector oscillates along the x-axis, along which axis does the magnetic field vector oscillate?",
    options: [
      "Positive z-axis",
      "Negative x-axis",
      "Y-axis",
      "At a 45 degree angle in the x-z plane"
    ],
    correctAnswer: "Y-axis",
    explanation: "Electromagnetic waves are transverse. The direction of propagation is given by E × B. If propagation is along +z and E is along +x, then B must lie along the y-axis because i × j = k."
  },
  {
    id: "phy102-me-19",
    sec: "Maxwell's Equations",
    question: "In the study of electromagnetic potentials, how is the magnetic field B related to the magnetic vector potential A?",
    options: [
      "B = ∇ · A",
      "B = ∇ × A",
      "B = -∇A",
      "B = ∂A/∂t"
    ],
    correctAnswer: "B = ∇ × A",
    explanation: "Since ∇ · B = 0 (solenoidal field), B can be written as the curl of another vector field called the magnetic vector potential A: B = ∇ × A."
  },
  {
    id: "phy102-me-20",
    sec: "Maxwell's Equations",
    question: "Which of the following describes the gauge condition known as the Coulomb gauge?",
    options: [
      "∇ · A = 0",
      "∇ · A = -μ0 * ε0 * ∂V/∂t",
      "∇ × A = 0",
      "∇ · E = 0"
    ],
    correctAnswer: "∇ · A = 0",
    explanation: "The Coulomb gauge (or radiation gauge) is defined by the condition that the divergence of the vector potential is zero: ∇ · A = 0."
  }
];
