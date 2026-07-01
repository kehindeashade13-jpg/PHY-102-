import { Question } from '../types';

export const MAGNETISM_INDUCTION_QUESTIONS: Question[] = [
  {
    id: "phy102-mi-01",
    sec: "Magnetism & Induction",
    question: "How does self-inductance affect the establishment of a steady current in a coil when a voltage is first applied?",
    options: [
      "It results in a lower net number of Weber-turns.",
      "It results in a lower induced electromotive force.",
      "It increases the maximum magnetic flux produced.",
      "It causes a longer delay in establishing a steady-state current.",
      "It completely prevents any current from flowing."
    ],
    correctAnswer: "It causes a longer delay in establishing a steady-state current.",
    explanation: "By Lenz's Law, when a current begins to rise in an inductor, the self-induced back EMF opposes the rate of increase of current. This opposition does not prevent the current from eventually reaching its full, steady Ohm's Law value, but it causes a characteristic delay (quantified by the RL time constant)."
  },
  {
    id: "phy102-mi-02",
    sec: "Magnetism & Induction",
    question: "Calculate the cyclotron frequency of an electron of mass 9.11 x 10^-31 kg and charge 1.60 x 10^-19 C circulating in a plane perpendicular to a uniform magnetic field B of magnitude 2.0 x 10^-4 T.",
    options: [
      "3.20 x 10^-23 Hz",
      "5.72 x 10^-30 Hz",
      "5.59 x 10^6 Hz",
      "1.82 x 10^-34 Hz",
      "1.59 x 10^6 Hz"
    ],
    correctAnswer: "5.59 x 10^6 Hz",
    explanation: "The cyclotron frequency is given by f = q * B / (2 * pi * m). Substituting the given values: f = (1.60 x 10^-19 C * 2.0 x 10^-4 T) / (2 * 3.1416 * 9.11 x 10^-31 kg) = 3.20 x 10^-23 / (5.724 x 10^-30) ≈ 5.59 x 10^6 Hz."
  },
  {
    id: "phy102-mi-03",
    sec: "Magnetism & Induction",
    question: "A magnetic field is represented by the expression B = axz i + byz j + c k. Applying the differential form of the Gaussian law for magnetic fields (∇ · B = 0), find the value of 'a'.",
    options: [
      "a = b",
      "a = c",
      "a = -b",
      "a = -c",
      "a = 2b"
    ],
    correctAnswer: "a = -b",
    explanation: "The divergence of a magnetic field must be zero everywhere: ∇ · B = ∂Bx/∂x + ∂By/∂y + ∂Bz/∂z = 0. Given Bx = axz, By = byz, Bz = c, we take partial derivatives: ∂Bx/∂x = az, ∂By/∂y = bz, ∂Bz/∂z = 0. Therefore, az + bz = 0 => z(a + b) = 0 => a = -b."
  },
  {
    id: "phy102-mi-04",
    sec: "Magnetism & Induction",
    question: "The total magnetic flux Φ_B through a surface area A is defined by which integral equation?",
    options: [
      "Φ_B = ∫ B · dA",
      "Φ_B = ∫ B · dE",
      "Φ_B = ∇ · D",
      "Φ_B = ∇ · E",
      "Φ_B = ∫ E · dD"
    ],
    correctAnswer: "Φ_B = ∫ B · dA",
    explanation: "Magnetic flux Φ_B is defined as the surface integral of the magnetic field B over the surface area A, which mathematically represents the number of magnetic field lines passing through a given surface: Φ_B = ∫ B · dA."
  },
  {
    id: "phy102-mi-05",
    sec: "Magnetism & Induction",
    question: "How much energy is stored in a 20 mH coil when it carries a steady current of 0.2 A?",
    options: [
      "4 x 10^-3 J",
      "4 x 10^-4 J",
      "0.4 x 10^-4 J",
      "6.4 x 10^-6 J",
      "7 x 10^-3 J"
    ],
    correctAnswer: "4 x 10^-4 J",
    explanation: "The energy U stored in the magnetic field of an inductor is: U = 1/2 * L * I^2. Substituting L = 20 mH = 20 x 10^-3 H and I = 0.2 A: U = 0.5 * (20 x 10^-3) * (0.2)^2 = 10^-2 * 0.04 = 4 x 10^-4 J."
  },
  {
    id: "phy102-mi-06",
    sec: "Magnetism & Induction",
    question: "The magnetic flux through a loop increases according to the relation Φ = 6t^2 + 7, where Φ is in milliwebers and t is in seconds. Find the magnitude of the induced EMF in the loop at t = 2.0 seconds.",
    options: [
      "0.024 V",
      "2400 V",
      "0.020 V",
      "200 V",
      "0.094 V"
    ],
    correctAnswer: "0.024 V",
    explanation: "By Faraday's Law of Induction, the induced EMF is the derivative of the magnetic flux with respect to time: EMF = |dΦ/dt|. d(6t^2 + 7)/dt = 12t. At t = 2.0 s, the rate of change of flux is 12(2) = 24 mWb/s. Therefore, the induced EMF is 24 mV = 0.024 V."
  },
  {
    id: "phy102-mi-07",
    sec: "Magnetism & Induction",
    question: "An air-cored coil of self-inductance L has N turns wound on a cylindrical core of cross-sectional area A. If both the cross-sectional area and the number of turns are doubled, and a relative permeability medium of 1000 is inserted, what is the new self-inductance?",
    options: [
      "8000 L",
      "4000 L",
      "8 x 10^-3 L",
      "1000 L",
      "8 L"
    ],
    correctAnswer: "8000 L",
    explanation: "The self-inductance of a coil is L = μ0 * N^2 * A / l. If the area A' = 2A, turns N' = 2N, and magnetic permeability μ = 1000 * μ0, then the new inductance is: L' = (1000 * μ0) * (2N)^2 * (2A) / l = 1000 * 4 * 2 * (μ0 * N^2 * A / l) = 8000 * L."
  },
  {
    id: "phy102-mi-08",
    sec: "Magnetism & Induction",
    question: "A charged particle initially moving north in a region containing a vertically downward magnetic field is deflected toward the east. What is the sign of the charge on this particle?",
    options: [
      "Positive",
      "Negative",
      "Neutral",
      "Oscillatory"
    ],
    correctAnswer: "Positive",
    explanation: "Using Fleming's Left-Hand Rule or the right-hand cross product (F = q * v × B): points velocity index finger north, magnetic field middle finger downward, the thumb (force) points east. Since the particle deflects east (the direction of the positive cross product), the charge must be Positive."
  },
  {
    id: "phy102-mi-09",
    sec: "Magnetism & Induction",
    question: "A 100-turn coil whose resistance is 6.0 Ω encloses an area of 80 cm^2. How rapidly should the magnetic field parallel to its axis change in order to induce a current of 1.0 mA in the coil?",
    options: [
      "0.0075 T/s",
      "75.0 T/s",
      "0.75 T/s",
      "7.5 x 10^-4 T/s"
    ],
    correctAnswer: "0.0075 T/s",
    explanation: "The induced EMF required is V = I * R = (1.0 x 10^-3 A) * 6.0 Ω = 6.0 x 10^-3 V. By Faraday's Law, V = N * A * (dB/dt). Area A = 80 cm^2 = 80 x 10^-4 m^2. dB/dt = V / (N * A) = (6.0 x 10^-3) / (100 * 80 x 10^-4) = 6.0 x 10^-3 / 0.8 = 0.0075 T/s."
  },
  {
    id: "phy102-mi-10",
    sec: "Magnetism & Induction",
    question: "The mutual inductance between two magnetically coupled coils depends directly on which of the following physical factors?",
    options: [
      "Magnetic permeability of the core material",
      "The total number of turns on both coils",
      "The common cross-sectional area of the core",
      "All of the above"
    ],
    correctAnswer: "All of the above",
    explanation: "Mutual inductance (M) is defined as M = μ0 * μr * N1 * N2 * A / l. This shows that mutual inductance depends on the relative permeability of the core material (μr), the number of turns in both primary and secondary coils (N1, N2), and the cross-sectional area (A) of their common core."
  },
  {
    id: "phy102-mi-11",
    sec: "Magnetism & Induction",
    question: "A circular coil of 160 turns has a radius of 1.90 cm. What current is required in the coil to produce a magnetic dipole moment of 2.30 A·m^2?",
    options: [
      "1.13 x 10^-2 A",
      "0.081 A",
      "12.78 A",
      "1.30 A",
      "5.67 A"
    ],
    correctAnswer: "12.78 A",
    explanation: "The magnetic dipole moment of a coil is P = N * I * A. Area A = pi * r^2 = pi * (0.0190)^2 ≈ 1.134 x 10^-3 m^2. The current is I = P / (N * A) = 2.30 / (160 * 1.134 x 10^-3) = 2.30 / 0.1814 ≈ 12.78 A."
  },
  {
    id: "phy102-mi-12",
    sec: "Magnetism & Induction",
    question: "Calculate the self-inductance of a solenoid containing 250 turns, if its length is 20.0 cm and its cross-sectional area is 400 x 10^-4 m^2.",
    options: [
      "1.26 mH",
      "15.7 mH",
      "0.157 mH",
      "1.26 H"
    ],
    correctAnswer: "1.26 mH",
    explanation: "Using the solenoid self-inductance formula: L = μ0 * N^2 * A / l. L = (4 * pi * 10^-7) * 250^2 * (400 x 10^-4) / 0.20 = (1.2566 x 10^-6) * 62500 * 0.04 / 0.20 = 1.2566 x 10^-3 H ≈ 1.26 mH."
  },
  {
    id: "phy102-mi-13",
    sec: "Magnetism & Induction",
    question: "Which of the following represents the correct Lorentz force equation for a moving charged particle in both an electric field E and a magnetic field B?",
    options: [
      "F = q * (E + v × B)",
      "F = q * E * (v × B)",
      "F = q * (v × B - E)",
      "F = v × B / q"
    ],
    correctAnswer: "F = q * (E + v × B)",
    explanation: "The Lorentz force law combines the electric force (qE) and the magnetic force (qv × B) acting on a point charge moving through space containing both electric and magnetic fields: F = q * E + q * (v × B) = q * (E + v × B)."
  },
  {
    id: "phy102-mi-14",
    sec: "Magnetism & Induction",
    question: "A coil of 10 turns and cross-sectional area 5.0 cm^2 is oriented perpendicularly to a magnetic flux density of 2.0 x 10^-2 T. If the field is reduced uniformly to zero in 10 s, calculate the induced EMF.",
    options: [
      "1.0 x 10^-5 V",
      "1.0 x 10^-4 V",
      "1.0 x 10^-3 V",
      "1.0 x 10^-6 V"
    ],
    correctAnswer: "1.0 x 10^-5 V",
    explanation: "By Faraday's Law, induced EMF is V = N * ΔΦ/Δt = N * A * ΔB/Δt. Area A = 5.0 cm^2 = 5.0 x 10^-4 m^2. Substituting values: V = 10 * (5.0 x 10^-4) * (2.0 x 10^-2 / 10) = 5.0 x 10^-3 * 2.0 x 10^-3 = 1.0 x 10^-5 V."
  },
  {
    id: "phy102-mi-15",
    sec: "Magnetism & Induction",
    question: "Which of the following electrical elements stores energy in its magnetic field?",
    options: [
      "Capacitor / Condenser",
      "Inductor / Inductance",
      "Resistor",
      "Diode"
    ],
    correctAnswer: "Inductor / Inductance",
    explanation: "An inductor stores energy in the form of a magnetic field as electric current flows through its windings. A capacitor, by contrast, stores energy in an electric field between its plates."
  },
  {
    id: "phy102-mi-16",
    sec: "Magnetism & Induction",
    question: "An electron in a TV camera tube is moving at 7.60 x 10^6 m/s in a magnetic field of strength 83.0 mT. If the electron has an acceleration of magnitude 4.70 x 10^14 m/s^2, find the angle between its velocity and the magnetic field.",
    options: [
      "0.52°",
      "5.20°",
      "0.24°",
      "24.0°"
    ],
    correctAnswer: "0.24°",
    explanation: "The magnetic force is F = q * v * B * sin(θ) = m * a. sin(θ) = m * a / (q * v * B). For an electron: m = 9.11 x 10^-31 kg, q = 1.6 x 10^-19 C, B = 0.083 T. sin(θ) = (9.11 x 10^-31 * 4.70 x 10^14) / (1.6 x 10^-19 * 7.60 x 10^6 * 0.083) = 4.2817 x 10^-16 / (1.009 x 10^-13) ≈ 0.00424. θ = sin^-1(0.00424) ≈ 0.24°."
  },
  {
    id: "phy102-mi-17",
    sec: "Magnetism & Induction",
    question: "Lenz's Law, which determines the direction of an induced EMF, is a direct consequence of which conservation law?",
    options: [
      "Conservation of Charge",
      "Conservation of Energy",
      "Conservation of Momentum",
      "Conservation of Angular Momentum"
    ],
    correctAnswer: "Conservation of Energy",
    explanation: "Lenz's Law states that the direction of an induced current always opposes the change in magnetic flux that produced it. If it didn't, the induced current would reinforce the flux change, creating an infinite feedback loop of increasing energy without work, violating the Law of Conservation of Energy."
  },
  {
    id: "phy102-mi-18",
    sec: "Magnetism & Induction",
    question: "The electromotive force (EMF) induced in a coil due to a changing current in a neighboring, magnetically linked coil is known as:",
    options: [
      "Dynamically induced EMF",
      "Self-induced EMF",
      "Statically induced EMF",
      "Mutually induced EMF"
    ],
    correctAnswer: "Mutually induced EMF",
    explanation: "Mutually induced EMF occurs when a changing current in one coil produces a changing magnetic field that links and induces a voltage (EMF) in a nearby second coil, forming the basis for transformer operation."
  },
  {
    id: "phy102-mi-19",
    sec: "Magnetism & Induction",
    question: "What name is given to the characteristic physical phenomenon in magnetic materials where changes in magnetization lag behind the application of an external magnetizing force?",
    options: [
      "Hysteresis",
      "Electromagnetic Induction",
      "Retentivity",
      "Magnetic Reluctance"
    ],
    correctAnswer: "Hysteresis",
    explanation: "Hysteresis refers to the lagging of the magnetization effect behind the external magnetizing force that produces it. This results in the characteristic closed 'hysteresis loop' when the magnetizing field is cycled."
  },
  {
    id: "phy102-mi-20",
    sec: "Magnetism & Induction",
    question: "If a current-carrying conductor of length L and current I is oriented perpendicular to a magnetic field B, what is the magnetic force acting on the conductor?",
    options: [
      "F = B * I * L",
      "F = B * I * L * cos(θ)",
      "F = B * I * L * tan(θ)",
      "F = 0"
    ],
    correctAnswer: "F = B * I * L",
    explanation: "The force on a current-carrying wire is F = B * I * L * sin(θ). Since the wire is oriented perpendicularly, the angle θ is 90°. Since sin(90°) = 1, the force simplifies to exactly F = B * I * L."
  },
  {
    id: "phy102-mi-21",
    sec: "Magnetism & Induction",
    question: "The fundamental law stating that whenever a conductor cuts or experiences a change in magnetic flux, an electromotive force (EMF) is induced is:",
    options: [
      "Coulomb's Law",
      "Faraday's Law of Induction",
      "Joule's Law",
      "Ohm's Law"
    ],
    correctAnswer: "Faraday's Law of Induction",
    explanation: "Faraday's Law of Induction is the fundamental law of electromagnetism stating that any change in the magnetic environment of a coil of wire will cause an EMF to be induced in the coil."
  },
  {
    id: "phy102-mi-22",
    sec: "Magnetism & Induction",
    question: "In the fundamental definition of the magnetic field B (from F = q * v × B), which of the following is NOT a measurable parameter used to define B?",
    options: [
      "Charge of the particle, q",
      "Velocity of the particle, v",
      "Magnetic deflecting force, F",
      "Magnetic torque on a macroscopic loop"
    ],
    correctAnswer: "Magnetic torque on a macroscopic loop",
    explanation: "The magnetic field B is fundamentally defined in terms of force F acting on a moving point charge q with velocity v. Magnetic torque on a loop is a macroscopic derived concept, not a fundamental definition parameter."
  },
  {
    id: "phy102-mi-23",
    sec: "Magnetism & Induction",
    question: "A coil consists of 500 turns of wire and is placed perpendicular to a magnetic field which changes from 0.5 T to 0.85 T within 0.60 s. If the diameter of the coil is 12 cm, calculate the EMF induced in the coil.",
    options: [
      "3.30 V",
      "45.6 V",
      "33.0 V",
      "52.4 V"
    ],
    correctAnswer: "3.30 V",
    explanation: "Radius r = 6 cm = 0.06 m. Area A = pi * r^2 = pi * (0.06)^2 ≈ 0.01131 m^2. The rate of change of field is dB/dt = (0.85 - 0.50) / 0.60 = 0.5833 T/s. By Faraday's law, EMF = N * A * (dB/dt) = 500 * 0.01131 * 0.5833 ≈ 3.30 V."
  },
  {
    id: "phy102-mi-24",
    sec: "Magnetism & Induction",
    question: "A step-up transformer connected to a 60 V primary supply delivers power to a 230 V, 100 W lamp on its secondary side. If the transformer is 85% efficient, calculate the current in the primary windings.",
    options: [
      "0.50 A",
      "1.25 A",
      "1.96 A",
      "2.50 A"
    ],
    correctAnswer: "1.96 A",
    explanation: "Output power P_out = 100 W. With an efficiency of 85%, input power is P_in = P_out / 0.85 = 100 / 0.85 ≈ 117.65 W. Since P_in = I_primary * V_primary: I_primary = 117.65 W / 60 V ≈ 1.96 A."
  },
  {
    id: "phy102-mi-25",
    sec: "Magnetism & Induction",
    question: "The SI unit of magnetic inductance (both self and mutual inductance) is:",
    options: [
      "Ampere",
      "Ohm",
      "Henry",
      "Farad"
    ],
    correctAnswer: "Henry",
    explanation: "The SI unit of inductance is the Henry (H), named after American scientist Joseph Henry, who discovered self-induction independently of Michael Faraday."
  },
  {
    id: "phy102-mi-26",
    sec: "Magnetism & Induction",
    question: "The magnetic force acting on a moving charge is exactly half of its maximum possible value when the angle between the velocity vector and the magnetic field vector is:",
    options: [
      "0°",
      "30°",
      "45°",
      "90°"
    ],
    correctAnswer: "30°",
    explanation: "The magnetic force is given by F = q * v * B * sin(θ). The maximum force is F_max = q * v * B (occurring at θ = 90°). For the force to be half of its maximum, sin(θ) must equal 0.5, which corresponds to an angle of 30°."
  },
  {
    id: "phy102-mi-27",
    sec: "Magnetism & Induction",
    question: "A circular current loop 6.5 cm in diameter has 12 turns and carries a current of 2.7 A. If the loop is in a region with a uniform magnetic field of 0.56 T, calculate the maximum torque that can be exerted on the loop.",
    options: [
      "0.060 N·m",
      "0.699 N·m",
      "0.274 N·m",
      "1.250 N·m"
    ],
    correctAnswer: "0.060 N·m",
    explanation: "Maximum torque is given by τ_max = N * I * A * B. Radius r = 3.25 cm = 0.0325 m. Area A = pi * (0.0325)^2 ≈ 3.318 x 10^-3 m^2. τ_max = 12 * 2.7 A * (3.318 x 10^-3 m^2) * 0.56 T ≈ 0.060 N·m."
  },
  {
    id: "phy102-mi-28",
    sec: "Magnetism & Induction",
    question: "A transformer with 200 turns in its primary winding and 50 turns in its secondary winding is connected to a 120 V AC power line. If the secondary is connected to a 100 Ω light bulb, how much current is drawn from the power line by the primary winding?",
    options: [
      "0.075 A",
      "0.300 A",
      "1.200 A",
      "0.019 A"
    ],
    correctAnswer: "0.075 A",
    explanation: "First find secondary voltage: V_s = V_p * (N_s / N_p) = 120 * (50 / 200) = 30 V. The secondary current is I_s = V_s / R = 30 V / 100 Ω = 0.3 A. Since power is conserved (ideal transformer), I_p * V_p = I_s * V_s => I_p = I_s * (V_s / V_p) = 0.3 * (30 / 120) = 0.075 A."
  },
  {
    id: "phy102-mi-29",
    sec: "Magnetism & Induction",
    question: "A core-wound coil has a length of 20 cm and an inductance of 6.0 mH. If the core length and the number of turns are both doubled, while keeping all other physical dimensions constant, what is the new inductance of the coil?",
    options: [
      "3.0 mH",
      "12.0 mH",
      "24.0 mH",
      "6.0 mH"
    ],
    correctAnswer: "12.0 mH",
    explanation: "The inductance of a coil is proportional to N^2 and inversely proportional to length l: L = μ * N^2 * A / l. If turns become 2N and length becomes 2l, the new inductance is: L' = μ * (2N)^2 * A / (2l) = 4/2 * (μ * N^2 * A / l) = 2 * L = 2 * 6.0 mH = 12.0 mH."
  },
  {
    id: "phy102-mi-30",
    sec: "Magnetism & Induction",
    question: "The line integral of the magnetic field B around any closed loop is proportional to the net current passing through that loop. This is the statement of which integral law?",
    options: [
      "Gauss's Law for Magnetism",
      "Ampere's Law",
      "Faraday's Law",
      "Lenz's Law"
    ],
    correctAnswer: "Ampere's Law",
    explanation: "Ampere's Law in integral form states that ∫ B · dl = μ0 * I_enclosed, meaning the line integral of B around a closed path is directly equal to the permeability of free space multiplied by the total current passing through the surface enclosed by the path."
  }
];
