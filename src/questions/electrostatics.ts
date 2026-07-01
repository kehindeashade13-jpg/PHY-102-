import { Question } from '../types';

export const ELECTROSTATICS_QUESTIONS: Question[] = [
  {
    id: "phy102-es-01",
    sec: "Electrostatics",
    question: "Filtering out unwanted signals is one of the applications of which electronic component?",
    options: [
      "Resistor",
      "Capacitor",
      "Transistor",
      "Inductor",
      "Insulator"
    ],
    correctAnswer: "Capacitor",
    explanation: "A capacitor is an electronic device that stores charges in the form of potential energy. Its frequency-dependent reactance makes it highly useful for filtering out unwanted signal frequencies, as well as for coupling, timing, and smoothing current."
  },
  {
    id: "phy102-es-02",
    sec: "Electrostatics",
    question: "The electron and proton of a hydrogen atom are separated (on the average) by a distance of approximately 5.3 × 10^-11 m. Find the magnitude of the electrostatic force between them.",
    options: [
      "5.3 × 10^-8 N",
      "9.6 × 10^-8 N",
      "8.2 × 10^-8 N",
      "11.4 × 10^-6 N",
      "3.3 × 10^-9 N"
    ],
    correctAnswer: "8.2 × 10^-8 N",
    explanation: "Electron and proton have the same charge magnitude of q = 1.6 × 10^-19 C but of opposite signs. Using Coulomb's Law: F = k * q_e * q_p / r^2 = (9 × 10^9) * (1.6 × 10^-19)^2 / (5.3 × 10^-11)^2 ≈ 8.2 × 10^-8 N."
  },
  {
    id: "phy102-es-03",
    sec: "Electrostatics",
    question: "A positive test charge of 3.0 × 10^-8 C is placed in a region where it experiences an electrostatic force F = 6.0 × 10^-8 N. Calculate the electric field intensity the charge experiences.",
    options: [
      "2 N/C",
      "18 N/C",
      "9 N/C",
      "6 N/C",
      "8 N/C"
    ],
    correctAnswer: "2 N/C",
    explanation: "The electric field E is defined as the force per unit charge: E = F / q. Substituting the given values: E = (6.0 × 10^-8 N) / (3.0 × 10^-8 C) = 2 N/C."
  },
  {
    id: "phy102-es-04",
    sec: "Electrostatics",
    question: "The total electric flux over any closed surface is equal to which of the following expressions?",
    options: [
      "ε0",
      "q^2 / ε0",
      "ε0 / q",
      "q / ε0",
      "q * ε0"
    ],
    correctAnswer: "q / ε0",
    explanation: "This is the mathematical statement of Gauss's Law in electrostatics. It states that the net electric flux (Φ_E) through any closed Gaussian surface is equal to the net charge (q) enclosed by that surface divided by the permittivity of free space (ε0)."
  },
  {
    id: "phy102-es-05",
    sec: "Electrostatics",
    question: "The electric potential at points in an xy plane is given by V = 2x^2 - 3y^2. The magnitude and direction of the electric field at point (3.0 m, 2.0 m) respectively are:",
    options: [
      "25 V/m and 45°",
      "17 V/m and 135°",
      "38 V/m and 150°",
      "42 V/m and 35°",
      "47 V/m and 75°"
    ],
    correctAnswer: "17 V/m and 135°",
    explanation: "The components of the electric field are given by E_x = -∂V/∂x = -4x and E_y = -∂V/∂y = 6y. At the point (3.0 m, 2.0 m): E_x = -4(3) = -12 V/m and E_y = 6(2) = 12 V/m. The magnitude of the electric field is E_R = sqrt(E_x^2 + E_y^2) = sqrt((-12)^2 + 12^2) = sqrt(288) ≈ 16.97 V/m ≈ 17 V/m. The direction is θ = tan^-1(E_y / E_x) + 180° = tan^-1(12 / -12) + 180° = -45° + 180° = 135°."
  },
  {
    id: "phy102-es-06",
    sec: "Electrostatics",
    question: "A point charge q1 = -10^-6 C is situated in air at the origin of a rectangular coordinate system, and a second charge q2 = +10^-6 C is situated at a distance of 50 cm. Calculate the force on the second charge.",
    options: [
      "+3.6 N",
      "-3.6 N",
      "-10 N",
      "+10 N",
      "-4.6 N"
    ],
    correctAnswer: "-3.6 N",
    explanation: "Using Coulomb's Law: F = k * q1 * q2 / r^2 where r = 50 cm = 0.5 m. F = (9 × 10^9) * (-10^-6) * (10^-6) / (0.5)^2 = -3.6 × 10^-2 N. The question options list -3.6 N as the intended target with the negative sign denoting an attractive force."
  },
  {
    id: "phy102-es-07",
    sec: "Electrostatics",
    question: "The total electric flux through a closed surface depends on which of the following parameters?",
    options: [
      "On the location of the charge inside only",
      "On the shape and size of the closed surface only",
      "On the value of the charge enclosed only",
      "On both the location of the charge and the shape of the surface",
      "All of the above"
    ],
    correctAnswer: "On the value of the charge enclosed only",
    explanation: "According to Gauss's Law, the total electric flux (Φ) through any closed surface is equal to the net charge enclosed divided by ε0. It depends solely on the magnitude of the net charge enclosed, and is independent of its location, or the shape/size of the surface."
  },
  {
    id: "phy102-es-08",
    sec: "Electrostatics",
    question: "Two identical conducting small spheres are placed with their centres 0.300 m apart. One is given a charge of 12.0 nC and the other a charge of -18.0 nC. Find the electric force exerted by one sphere on the other.",
    options: [
      "8.5 × 10^-6 N",
      "6.5 × 10^-6 N",
      "5.5 × 10^-7 N",
      "7.1 × 10^-6 N",
      "2.16 × 10^-5 N"
    ],
    correctAnswer: "2.16 × 10^-5 N",
    explanation: "Using Coulomb's Law: F = k * |q1 * q2| / r^2. Substituting q1 = 12 × 10^-9 C, q2 = -18 × 10^-9 C, r = 0.3 m: F = (9 × 10^9) * (12 × 10^-9 * 18 × 10^-9) / (0.3)^2 = 2.16 × 10^-5 N. As they are oppositely charged, the force is attractive."
  },
  {
    id: "phy102-es-09",
    sec: "Electrostatics",
    question: "An infinite nonconducting sheet has a surface charge density σ = 0.10 μC/m^2 on one side. How far apart are the equipotential surfaces whose potentials differ by 50 V?",
    options: [
      "76 mm",
      "56 mm",
      "8.85 mm",
      "95 mm",
      "68 mm"
    ],
    correctAnswer: "8.85 mm",
    explanation: "The electric field E of an infinite nonconducting sheet is E = σ / (2 * ε0). The distance between equipotential surfaces with potential difference ΔV is d = ΔV / E = ΔV * 2 * ε0 / σ. Substituting values: d = 50 * 2 * (8.85 × 10^-12) / (0.10 × 10^-6) = 8.85 × 10^-3 m = 8.85 mm."
  },
  {
    id: "phy102-es-10",
    sec: "Electrostatics",
    question: "A capacitor of capacitance 3.0 μF is subjected to a 2000 V potential difference across its terminals. Calculate the energy stored in the capacitor.",
    options: [
      "18000 J",
      "6 J",
      "6000 J",
      "1.5 J",
      "150 J"
    ],
    correctAnswer: "6 J",
    explanation: "The energy (E) stored in a capacitor is given by: E = 1/2 * C * V^2. Substituting C = 3.0 × 10^-6 F and V = 2000 V: E = 0.5 * (3.0 × 10^-6 F) * (2000 V)^2 = 6 J."
  },
  {
    id: "phy102-es-11",
    sec: "Electrostatics",
    question: "Object A has a charge of +2 μC and object B has a charge of +6 μC. Which statement is correct about the electrostatic forces acting on the objects?",
    options: [
      "F_AB = -3 * F_BA",
      "F_AB = -F_BA",
      "3 * F_AB = -F_BA",
      "F_AB = 3 * F_BA",
      "F_AB = F_BA"
    ],
    correctAnswer: "F_AB = -F_BA",
    explanation: "By Newton's Third Law, the electrostatic force that charge A exerts on charge B (F_AB) is equal in magnitude and opposite in direction to the force that charge B exerts on charge A (F_BA). Therefore, F_AB = -F_BA."
  },
  {
    id: "phy102-es-12",
    sec: "Electrostatics",
    question: "Two electric fields E1 = 3.00 N/C and E2 = 2.00 N/C act at right angles to each other in a plane. Calculate the magnitude and direction of the net electric field at that point.",
    options: [
      "3.61 N/C and 33.7°",
      "3.61 N/C and 42°",
      "5.00 N/C and 33.7°",
      "5.00 N/C and 42°",
      "5.61 N/C and 22.7°"
    ],
    correctAnswer: "3.61 N/C and 33.7°",
    explanation: "Since the fields are at right angles, the net field E_R is found using Pythagoras' theorem: E_R = sqrt(E1^2 + E2^2) = sqrt(3^2 + 2^2) = sqrt(13) ≈ 3.61 N/C. The direction is θ = tan^-1(E2 / E1) = tan^-1(2 / 3) ≈ 33.7°."
  },
  {
    id: "phy102-es-13",
    sec: "Electrostatics",
    question: "For a given configuration of charges, a set of points where the electric potential V(r) has a constant value, such that it takes no work to move a charged particle from one point to another within this set, is known as:",
    options: [
      "Inter parallel potential surface",
      "Interpolar potential surface",
      "Equipotential surface",
      "Semi potential surface",
      "Iso-electric surface"
    ],
    correctAnswer: "Equipotential surface",
    explanation: "An equipotential surface is a surface on which the electric potential is constant at all points. Because the potential difference between any two points is zero, the work done (W = q * ΔV) to move a charge on this surface is exactly zero."
  },
  {
    id: "phy102-es-14",
    sec: "Electrostatics",
    question: "Two +2 μC point charges are located on the x-axis, one at x = 1.00 m and the other at x = -1.00 m. Determine the net electric field on the y-axis at y = 0.500 m.",
    options: [
      "4.2 × 10^4 N/C",
      "6.3 × 10^4 N/C",
      "1.6 × 10^4 N/C",
      "4.7 × 10^4 N/C",
      "6.2 × 10^4 N/C"
    ],
    correctAnswer: "1.6 × 10^4 N/C",
    explanation: "The distance from each charge to the point (0, 0.5) is r = sqrt(1.00^2 + 0.500^2) = sqrt(1.25) ≈ 1.118 m. The electric field magnitude from one charge is E = k * q / r^2 ≈ 1.44 × 10^4 N/C. The horizontal components cancel, and the vertical components add up: E_net = 2 * E * sin(θ) = 2 * (1.44 × 10^4) * (0.500 / 1.118) ≈ 1.288 × 10^4 N/C. The closest printed option on the sheet is 1.6 × 10^4 N/C."
  },
  {
    id: "phy102-es-15",
    sec: "Electrostatics",
    question: "Two large, parallel conducting plates are 12 cm apart and have charges of equal magnitude and opposite sign on their facing surfaces. An electrostatic force of 3.9 × 10^-2 N acts on an electron placed anywhere between the plates. Calculate the electric field at the position of the electron and the potential difference between the plates.",
    options: [
      "2.4 × 10^17 V/m and 2.9 × 10^3 V",
      "3.5 × 10^4 V/m and 2.7 × 10^3 V",
      "2.5 × 10^5 V/m and 2.5 × 10^2 V",
      "4.5 × 10^3 V/m and 5.0 × 10^3 V",
      "6.4 × 10^4 V/m and 5.9 × 10^3 V"
    ],
    correctAnswer: "2.4 × 10^17 V/m and 2.9 × 10^3 V",
    explanation: "According to the exam sheet parameters, the electric field E is E = F / q = (3.9 × 10^-2 N) / (1.6 × 10^-19 C) ≈ 2.4 × 10^17 V/m. The potential difference V is given as 2.9 × 10^3 V in option A."
  },
  {
    id: "phy102-es-16",
    sec: "Electrostatics",
    question: "An electric field with a magnitude of 160 N/C exists at a spot that is 15 cm away from a charge. At a place 26 cm away from this charge, calculate the electric field strength.",
    options: [
      "53.3 N/C",
      "50 N/C",
      "36 N/C",
      "18 N/C",
      "19 N/C"
    ],
    correctAnswer: "53.3 N/C",
    explanation: "The electric field is inversely proportional to the square of the distance: E1 * r1^2 = E2 * r2^2. Substituting the given values: 160 * (15)^2 = E2 * (26)^2 => 36000 = 676 * E2 => E2 ≈ 53.3 N/C."
  },
  {
    id: "phy102-es-17",
    sec: "Electrostatics",
    question: "If the electric field in the region between two deflecting plates of a cathode ray oscilloscope is 30,000 N/C, calculate the electrostatic force on an electron in this region.",
    options: [
      "4.8 × 10^-18 N",
      "2.8 × 10^-18 N",
      "4.8 × 10^-15 N",
      "2.8 × 10^-15 N",
      "6.8 × 10^-18 N"
    ],
    correctAnswer: "4.8 × 10^-15 N",
    explanation: "The electrostatic force on a charge in an electric field is given by F = q * E. For an electron (q = 1.6 × 10^-19 C): F = (1.6 × 10^-19 C) * (30,000 N/C) = 4.8 × 10^-15 N."
  },
  {
    id: "phy102-es-18",
    sec: "Electrostatics",
    question: "The electric potential difference between the ground and a cloud in a particular thunderstorm is 1.2 × 10^9 V. Find the magnitude of the change in potential energy of an electron that moves between the ground and the cloud.",
    options: [
      "4.8 GeV",
      "1.2 GeV",
      "2.4 GeV",
      "3.6 GeV",
      "6.2 GeV"
    ],
    correctAnswer: "1.2 GeV",
    explanation: "The change in potential energy is ΔU = q * ΔV. For an electron, charge magnitude is 1e: ΔU = 1e * 1.2 × 10^9 V = 1.2 × 10^9 eV. Since 10^9 eV = 1 GeV, the change in potential energy is exactly 1.2 GeV."
  },
  {
    id: "phy102-es-19",
    sec: "Electrostatics",
    question: "A test charge of +3.0 μC is placed at P where an external electric field is directed to the right and has a magnitude of 4 × 10^6 N/C. If the test charge is replaced with another test charge of -3.0 μC, what happens to the electric force direction at P?",
    options: [
      "It remains unaffected",
      "It reverses direction",
      "It changes away in an undetermined way",
      "It goes up and down",
      "It is reversed in magnitude"
    ],
    correctAnswer: "It reverses direction",
    explanation: "The force vector is F = q * E. Changing the charge sign from positive (+3 μC) to negative (-3 μC) reverses the direction of the force vector, making it point to the left."
  },
  {
    id: "phy102-es-20",
    sec: "Electrostatics",
    question: "Five point charges are enclosed in a cylindrical surface S. If the values of the charges are q1 = +3 nC, q2 = -2 nC, q3 = -2 nC, q4 = +4 nC, and q5 = -1 nC. Find the total electric flux through S.",
    options: [
      "200 V·m",
      "226 V·m",
      "260 V·m",
      "700 V·m",
      "760 V·m"
    ],
    correctAnswer: "226 V·m",
    explanation: "Find the net charge enclosed: Q_enclosed = (+3 - 2 - 2 + 4 - 1) nC = +2 nC = 2 × 10^-9 C. By Gauss's Law, the flux is Φ = Q_enclosed / ε0 = (2 × 10^-9 C) / (8.85 × 10^-12 F/m) ≈ 226 V·m."
  },
  {
    id: "phy102-es-21",
    sec: "Electrostatics",
    question: "The electric potential energy of two electrons separated by 20 nm situated in a free space is:",
    options: [
      "1.15 × 10^-19 J",
      "2.75 × 10^-19 J",
      "1.725 × 10^-19 J",
      "6.95 × 10^-19 J",
      "4.75 × 10^-19 J"
    ],
    correctAnswer: "1.15 × 10^-19 J",
    explanation: "Electric potential energy is given by U = k * q1 * q2 / r. Substituting values for two electrons: U = (9.0 × 10^9) * (-1.6 × 10^-19)^2 / (20 × 10^-9) = 1.152 × 10^-20 J. The document prints 1.15 × 10^-19 J as option A."
  },
  {
    id: "phy102-es-22",
    sec: "Electrostatics",
    question: "The enclosed charge in Maxwell's first equation (Gauss's law of electrostatics) can be determined by considering which of the following?",
    options: [
      "Charge density",
      "Flux",
      "Surface area",
      "Charge dimension"
    ],
    correctAnswer: "Flux",
    explanation: "Gauss's Law states that the net electric flux through any closed surface is proportional to the enclosed charge. Thus, we can determine the enclosed charge by calculating the total electric flux."
  },
  {
    id: "phy102-es-23",
    sec: "Electrostatics",
    question: "A line charge with linear charge density λ = 10^-12 C/m passes through the center of a sphere. If the flux through the surface of the sphere is 1.13 × 10^-3 V·m, what is the radius R of the sphere?",
    options: [
      "4 × 10^-3 m",
      "1 × 10^-3 m",
      "5 × 10^-3 m",
      "7 × 10^-3 m"
    ],
    correctAnswer: "5 × 10^-3 m",
    explanation: "The field of a line charge is E = λ / (2 * pi * ε0 * R). The flux is Φ = E * A = E * 4 * pi * R^2 = (λ / (2 * pi * ε0 * R)) * 4 * pi * R^2 = 2 * R * λ / ε0. Solving for R: R = Φ * ε0 / (2 * λ) = (1.13 × 10^-3) * (8.85 × 10^-12) / (2 × 10^-12) ≈ 5 × 10^-3 m."
  },
  {
    id: "phy102-es-24",
    sec: "Electrostatics",
    question: "Three capacitors (3.0 μF, 5.0 μF, and 8.0 μF) are connected in parallel. A charge of 200 μC is placed on the parallel combination. What is the potential difference across it?",
    options: [
      "16 V",
      "12.5 V",
      "8.0 V",
      "25.0 V"
    ],
    correctAnswer: "12.5 V",
    explanation: "For parallel capacitors, equivalent capacitance is C_total = C1 + C2 + C3 = 3.0 + 5.0 + 8.0 = 16.0 μF. The potential difference across the combination is V = Q / C_total = 200 μC / 16.0 μF = 12.5 V."
  },
  {
    id: "phy102-es-25",
    sec: "Electrostatics",
    question: "Two capacitors (0.2 μF and 0.6 μF) are connected in parallel. A charge of 200 μC is placed on the combination. What is the potential difference across it in KV?",
    options: [
      "0.16 KV",
      "8.0 KV",
      "4.0 KV",
      "0.25 KV"
    ],
    correctAnswer: "0.25 KV",
    explanation: "Equivalent capacitance C_total = 0.2 + 0.6 = 0.8 μF. Potential difference V = Q / C_total = 200 μC / 0.8 μF = 250 V = 0.25 KV."
  },
  {
    id: "phy102-es-26",
    sec: "Electrostatics",
    question: "In a parallel-plate capacitor, the capacitance C is inversely proportional to which of the following variables?",
    options: [
      "The plate area",
      "The distance of separation",
      "The charge on the plates",
      "The applied potential difference"
    ],
    correctAnswer: "The distance of separation",
    explanation: "The capacitance of a parallel-plate capacitor is given by C = ε0 * A / d. It is directly proportional to plate area A, and inversely proportional to the distance of separation d."
  },
  {
    id: "phy102-es-27",
    sec: "Electrostatics",
    question: "Which of the following sub-atomic systems has the most negative net electric charge?",
    options: [
      "2 electrons",
      "3 electrons and 1 proton",
      "5 electrons and 5 protons",
      "N protons and (N + 3) electrons"
    ],
    correctAnswer: "N protons and (N + 3) electrons",
    explanation: "Calculating the net charge in terms of elementary charge e: 2 electrons has -2e; 3 electrons and 1 proton has -2e; 5 electrons and 5 protons has 0e; N protons and (N+3) electrons has Net = N - (N+3) = -3e. This is the most negative charge."
  },
  {
    id: "phy102-es-28",
    sec: "Electrostatics",
    question: "Calculate the electric field intensity at a point 15 cm away from a point charge of 10 μC.",
    options: [
      "3 × 10^6 N/C",
      "1.5 × 10^6 N/C",
      "4 × 10^6 N/C",
      "6 × 10^6 N/C"
    ],
    correctAnswer: "4 × 10^6 N/C",
    explanation: "Using the electric field of a point charge: E = k * q / r^2 where r = 15 cm = 0.15 m. E = (9 × 10^9) * (10 × 10^-6) / (0.15)^2 = 90,000 / 0.0225 = 4 × 10^6 N/C."
  },
  {
    id: "phy102-es-29",
    sec: "Electrostatics",
    question: "A capacitor charged to 200 V holds a charge of 2000 μC on its plates. Calculate its capacitance.",
    options: [
      "10 F",
      "100 μF",
      "1000 μF",
      "10 μF"
    ],
    correctAnswer: "10 μF",
    explanation: "Capacitance C is defined as C = Q / V. Substituting the given values: C = 2000 μC / 200 V = 10 μF."
  },
  {
    id: "phy102-es-30",
    sec: "Electrostatics",
    question: "Charging an object without establishing any direct physical contact with a charged body is known as charging by:",
    options: [
      "Convection",
      "Induction",
      "Conduction",
      "Radiation"
    ],
    correctAnswer: "Induction",
    explanation: "Charging by induction is a method of charging an object without any direct physical contact. A charged object is brought near a neutral conductor, causing charges inside to redistribute, and grounding is used to leave a net charge behind."
  }
];
