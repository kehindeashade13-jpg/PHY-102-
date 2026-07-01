import { Question } from '../types';

export const CURRENT_ELECTRICITY_QUESTIONS: Question[] = [
  {
    id: "phy102-ce-01",
    sec: "Current Electricity",
    question: "Calculate the conductivity and resistance of a uniform wire of length 2.0 m and resistivity 5.4 × 10^-7 Ω·m if the cross-sectional area of the wire is 9.5 × 10^-3 cm^2.",
    options: [
      "1.85 × 10^6 Ω^-1m^-1, 1.44 Ω",
      "3.70 × 10^6 Ω^-1m^-1, 1.44 Ω",
      "1.85 × 10^6 Ω^-1m^-1, 2.28 Ω",
      "1.85 × 10^6 Ω^-1m^-1, 1.14 Ω"
    ],
    correctAnswer: "1.85 × 10^6 Ω^-1m^-1, 1.14 Ω",
    explanation: "Conductivity (σ) is the reciprocal of resistivity (ρ): σ = 1 / (5.4 × 10^-7) ≈ 1.85 × 10^6 Ω^-1m^-1. Area (A) = 9.5 × 10^-3 cm^2 = 9.5 × 10^-7 m^2. Resistance is R = ρ * L / A = (5.4 × 10^-7 * 2.0) / (9.5 × 10^-7) ≈ 1.14 Ω."
  },
  {
    id: "phy102-ce-02",
    sec: "Current Electricity",
    question: "Which of the following formulas represents electrical conductivity (σ) in terms of electric field (E) and current density (J)?",
    options: [
      "σ = E / J",
      "σ = J / E",
      "σ = E * J",
      "σ = E / J^2"
    ],
    correctAnswer: "σ = J / E",
    explanation: "Ohm's Law in vector form is J = σ * E, where J is current density, σ is electrical conductivity, and E is the electric field. Thus, the conductivity is σ = J / E."
  },
  {
    id: "phy102-ce-03",
    sec: "Current Electricity",
    question: "The line integral of current density J over a cross-sectional area A represented by ∫ J · dA gives which of the following quantities?",
    options: [
      "Resistance",
      "Electric current",
      "Resistivity",
      "Potential difference"
    ],
    correctAnswer: "Electric current",
    explanation: "Current density J is defined as current per unit area. Integrating current density J over a surface area A yields the total electric current (I) flowing through that surface: I = ∫ J · dA."
  },
  {
    id: "phy102-ce-04",
    sec: "Current Electricity",
    question: "Which of the following statements is NOT correct regarding the electrical resistance of a uniform wire?",
    options: [
      "The resistance increases as length increases.",
      "The resistance increases as cross-sectional area increases.",
      "The resistance increases as temperature increases (for metals).",
      "The nature of the material affects the resistance."
    ],
    correctAnswer: "The resistance increases as cross-sectional area increases.",
    explanation: "The resistance of a uniform conductor is inversely proportional to its cross-sectional area (R = ρ * L / A). Thus, as cross-sectional area increases, the resistance actually decreases, making statement B incorrect."
  },
  {
    id: "phy102-ce-05",
    sec: "Current Electricity",
    question: "The integration of current with respect to time, given by the expression ∫ I dt, yields which of the following physical quantities?",
    options: [
      "Resistance",
      "Quantity of charge",
      "Potential difference",
      "Electric field strength"
    ],
    correctAnswer: "Quantity of charge",
    explanation: "Since current (I) is the rate of flow of electric charge (I = dq/dt), integrating current over time yields the net charge (q) that has flowed: q = ∫ I dt."
  },
  {
    id: "phy102-ce-06",
    sec: "Current Electricity",
    question: "The property of a substance or physical element to oppose or restrict the flow of electric current through it is called:",
    options: [
      "Conductance",
      "Inductance",
      "Capacitance",
      "Resistance"
    ],
    correctAnswer: "Resistance",
    explanation: "Resistance is the electrical property of a substance that opposes or limits the flow of electric charges (current). Conductance is the exact opposite (ease of flow)."
  },
  {
    id: "phy102-ce-07",
    sec: "Current Electricity",
    question: "Which of the following parameters does NOT affect the electrical resistance of a uniform wire?",
    options: [
      "Cross-sectional area",
      "Temperature",
      "Potential difference",
      "Length"
    ],
    correctAnswer: "Potential difference",
    explanation: "According to Ohm's Law and structural definitions, resistance R = ρ * L / A depends on length, cross-sectional area, temperature, and material composition. It is independent of the applied potential difference."
  },
  {
    id: "phy102-ce-08",
    sec: "Current Electricity",
    question: "When resistors are connected in a parallel configuration in a DC circuit, which of the following variables is the same across each resistor?",
    options: [
      "Current",
      "Power",
      "Resistance",
      "Voltage"
    ],
    correctAnswer: "Voltage",
    explanation: "In a parallel circuit, the terminals of all components are connected across the same common nodes. Therefore, the electric potential difference (voltage) is identical across each parallel component."
  },
  {
    id: "phy102-ce-09",
    sec: "Current Electricity",
    question: "If a steady current of 6.0 A flows through a wire, how much electric charge will pass through its cross-section in 2.0 seconds?",
    options: [
      "12 Coulombs",
      "10 Coulombs",
      "8 Coulombs",
      "4 Coulombs"
    ],
    correctAnswer: "12 Coulombs",
    explanation: "The quantity of charge q is equal to current multiplied by time: q = I * t. Substituting I = 6 A and t = 2 s yields: q = 6.0 * 2.0 = 12 Coulombs."
  },
  {
    id: "phy102-ce-10",
    sec: "Current Electricity",
    question: "Which of the following is NOT a standard method or instrument designed for measuring electrical resistance?",
    options: [
      "Wheatstone bridge",
      "Meter bridge",
      "Substitution method",
      "Bridge divider"
    ],
    correctAnswer: "Bridge divider",
    explanation: "Wheatstone bridges, meter bridges, and substitution methods are well-established techniques for measuring resistance. A voltage divider exists, but a 'bridge divider' is not a standard resistance-measurement instrument."
  },
  {
    id: "phy102-ce-11",
    sec: "Current Electricity",
    question: "Find the total equivalent resistance across terminals A and B in a circuit where a parallel pair of 1.0 Ω resistors is connected in series with another parallel pair of 1.0 Ω resistors.",
    options: [
      "1.0 Ω",
      "2.0 Ω",
      "0.5 Ω",
      "4.0 Ω",
      "3.0 Ω"
    ],
    correctAnswer: "1.0 Ω",
    explanation: "First parallel pair: R_eq1 = (1 * 1) / (1 + 1) = 0.5 Ω. Second parallel pair: R_eq2 = (1 * 1) / (1 + 1) = 0.5 Ω. Connected in series: R_total = R_eq1 + R_eq2 = 0.5 + 0.5 = 1.0 Ω."
  },
  {
    id: "phy102-ce-12",
    sec: "Current Electricity",
    question: "What happens to the potential energy of a negative test charge (such as an electron) when it is moved from a lower potential point to a higher potential point?",
    options: [
      "It remains the same",
      "It increases",
      "It decreases",
      "It becomes zero"
    ],
    correctAnswer: "It decreases",
    explanation: "Since potential energy is U = q * V, and the charge q is negative for an electron, moving it to a higher potential point (larger positive V) makes the potential energy more negative, which means the potential energy decreases. However, on the exam sheet, the general formulation asserts that work is done, making choice B ('increases') or C ('decreases') relevant depending on context. Let's use 'decreases' as the standard physical resolution, or 'increases' if treating positive work. The sheet says 'decreases' (C) for positive charges, but let's stick to the physical definition."
  },
  {
    id: "phy102-ce-13",
    sec: "Current Electricity",
    question: "The drift velocity of free conduction electrons in a typical metal wire carrying a standard household current is of what order of magnitude?",
    options: [
      "Speed of light (3 × 10^8 m/s)",
      "Speed of sound (340 m/s)",
      "A few meters per second",
      "A few millimeters per second"
    ],
    correctAnswer: "A few millimeters per second",
    explanation: "Although the electrical signal propagates near the speed of light, the actual physical drift velocity of individual electrons through the wire is very slow, typically on the order of 10^-4 to 10^-3 m/s (millimeters per second) due to frequent collisions with lattice ions."
  },
  {
    id: "phy102-ce-14",
    sec: "Current Electricity",
    question: "Kirchhoff's Current Law (KCL), which states that the sum of currents entering any junction equals the sum of currents leaving, is a direct consequence of which conservation law?",
    options: [
      "Conservation of Energy",
      "Conservation of Momentum",
      "Conservation of Charge",
      "Conservation of Mass"
    ],
    correctAnswer: "Conservation of Charge",
    explanation: "KCL states that charge cannot be accumulated or lost at a circuit node. Since charge must be conserved, the total rate of charge entering a junction must equal the total rate of charge leaving."
  },
  {
    id: "phy102-ce-15",
    sec: "Current Electricity",
    question: "Kirchhoff's Voltage Law (KVL), which states that the algebraic sum of potential differences around any closed loop is zero, is a direct consequence of which conservation law?",
    options: [
      "Conservation of Energy",
      "Conservation of Charge",
      "Conservation of Momentum",
      "Conservation of Mass"
    ],
    correctAnswer: "Conservation of Energy",
    explanation: "KVL is based on the conservation of energy. It implies that when a charge moves around any closed path, returning to its starting point, its net change in electrostatic potential energy must be zero."
  },
  {
    id: "phy102-ce-16",
    sec: "Current Electricity",
    question: "A battery with an EMF of 12.0 V and an internal resistance of 1.0 Ω is connected across an external load resistor of 5.0 Ω. Calculate the terminal potential difference of the battery.",
    options: [
      "12.0 V",
      "10.0 V",
      "6.0 V",
      "2.0 V"
    ],
    correctAnswer: "10.0 V",
    explanation: "First, find the circuit current: I = E / (R_load + r_int) = 12.0 / (5.0 + 1.0) = 2.0 A. The terminal potential difference is V = I * R_load = 2.0 A * 5.0 Ω = 10.0 V (or V = E - I * r_int = 12.0 - 2.0 = 10.0 V)."
  },
  {
    id: "phy102-ce-17",
    sec: "Current Electricity",
    question: "The electrical power dissipated as heat in a resistor R when carrying a current I is represented by which of the following mathematical equations?",
    options: [
      "P = I * R",
      "P = I^2 * R",
      "P = I * R^2",
      "P = V^2 * I"
    ],
    correctAnswer: "P = I^2 * R",
    explanation: "Power is P = V * I. By Ohm's Law, V = I * R. Substituting V yields: P = (I * R) * I = I^2 * R, which is Joule's law of heating."
  },
  {
    id: "phy102-ce-18",
    sec: "Current Electricity",
    question: "Which of the following materials acts as an excellent electrical insulator?",
    options: [
      "Copper",
      "Glass",
      "Silicon",
      "Gold"
    ],
    correctAnswer: "Glass",
    explanation: "Copper and gold are metals (conductors), silicon is a semiconductor, and glass is an insulator because its electrons are tightly bound and cannot move freely."
  },
  {
    id: "phy102-ce-19",
    sec: "Current Electricity",
    question: "The temperature coefficient of resistance is positive for which of the following categories of materials?",
    options: [
      "Pure metals",
      "Semiconductors",
      "Insulators",
      "Electrolytes"
    ],
    correctAnswer: "Pure metals",
    explanation: "Pure metals have a positive temperature coefficient of resistance, meaning their resistance increases as temperature increases because thermal vibrations of lattice ions increase electron scattering."
  },
  {
    id: "phy102-ce-20",
    sec: "Current Electricity",
    question: "The electrical resistance of a pure semiconductor material like silicon behaves in which way as its temperature is increased?",
    options: [
      "It increases",
      "It decreases",
      "It remains completely constant",
      "It becomes negative"
    ],
    correctAnswer: "It decreases",
    explanation: "Semiconductors have a negative temperature coefficient of resistance. As temperature rises, more electrons gain thermal energy to jump from the valence band to the conduction band, increasing conductivity and decreasing resistance."
  },
  {
    id: "phy102-ce-21",
    sec: "Current Electricity",
    question: "A uniform wire of resistance 4.0 Ω is stretched uniformly to twice its original length. Assuming its mass and density remain constant, what is its new electrical resistance?",
    options: [
      "8.0 Ω",
      "16.0 Ω",
      "2.0 Ω",
      "4.0 Ω"
    ],
    correctAnswer: "16.0 Ω",
    explanation: "When stretched to twice its length, its cross-sectional area must decrease to half to maintain a constant volume (V = A * L). R = ρ * L / A. The new resistance is R' = ρ * (2L) / (A/2) = 4 * (ρ * L / A) = 4 * 4.0 Ω = 16.0 Ω."
  },
  {
    id: "phy102-ce-22",
    sec: "Current Electricity",
    question: "Which of the following electrical instruments operates on the principle of a balanced Wheatstone bridge to measure an unknown resistance?",
    options: [
      "Voltmeter",
      "Ammeter",
      "Meter Bridge",
      "Oscilloscope"
    ],
    correctAnswer: "Meter Bridge",
    explanation: "A Meter Bridge is a practical form of a Wheatstone bridge that uses a one-meter-long uniform wire to form two ratio arms. It operates on the principle of null deflection (balanced bridge) to find unknown resistances."
  },
  {
    id: "phy102-ce-23",
    sec: "Current Electricity",
    question: "If a copper wire A has twice the diameter of another copper wire B of the same length, what is the ratio of the electrical resistance of wire A to wire B?",
    options: [
      "1:2",
      "2:1",
      "1:4",
      "4:1"
    ],
    correctAnswer: "1:4",
    explanation: "Resistance is inversely proportional to the square of diameter: R ∝ 1 / D^2. If wire A has twice the diameter, its cross-sectional area is four times larger, so its resistance is one-fourth of B's resistance (ratio 1:4)."
  },
  {
    id: "phy102-ce-24",
    sec: "Current Electricity",
    question: "What is the equivalent resistance of three 6.0 Ω resistors connected in a parallel configuration?",
    options: [
      "18.0 Ω",
      "2.0 Ω",
      "3.0 Ω",
      "0.5 Ω"
    ],
    correctAnswer: "2.0 Ω",
    explanation: "For three identical resistors in parallel, equivalent resistance is R_eq = R / N = 6.0 / 3 = 2.0 Ω."
  },
  {
    id: "phy102-ce-25",
    sec: "Current Electricity",
    question: "Which electrical device must be connected in parallel with a circuit element to measure the potential difference across its terminals?",
    options: [
      "Ammeter",
      "Voltmeter",
      "Galvanometer",
      "Rheostat"
    ],
    correctAnswer: "Voltmeter",
    explanation: "A voltmeter has high internal resistance and must be connected in parallel with a circuit component so it measures potential difference without drawing significant current."
  },
  {
    id: "phy102-ce-26",
    sec: "Current Electricity",
    question: "Which electrical device must be connected in series with a branch of a circuit to measure the current flowing through it?",
    options: [
      "Ammeter",
      "Voltmeter",
      "Capacitor",
      "Potentiometer"
    ],
    correctAnswer: "Ammeter",
    explanation: "An ammeter has very low internal resistance and is connected in series with a branch so all of the current flows through it, enabling accurate current measurement without changing circuit current."
  },
  {
    id: "phy102-ce-27",
    sec: "Current Electricity",
    question: "How is a galvanometer converted into an ammeter capable of measuring large currents?",
    options: [
      "By connecting a low resistance shunt in parallel",
      "By connecting a high resistance multiplier in series",
      "By connecting a capacitor in parallel",
      "By connecting an inductor in series"
    ],
    correctAnswer: "By connecting a low resistance shunt in parallel",
    explanation: "To convert a galvanometer into an ammeter, a low resistance (shunt) is connected in parallel with it to bypass most of the current, protecting the galvanometer while allowing measurement of larger currents."
  },
  {
    id: "phy102-ce-28",
    sec: "Current Electricity",
    question: "How is a galvanometer converted into a voltmeter capable of measuring high potential differences?",
    options: [
      "By connecting a low resistance in parallel",
      "By connecting a high resistance multiplier in series",
      "By connecting a capacitor in series",
      "By connecting a shunt in parallel"
    ],
    correctAnswer: "By connecting a high resistance multiplier in series",
    explanation: "To convert a galvanometer into a voltmeter, a high resistance (called a multiplier) is connected in series with it to limit the current through the coil, allowing it to withstand high voltages without damage."
  },
  {
    id: "phy102-ce-29",
    sec: "Current Electricity",
    question: "An electric heater is rated at 240 V and 1200 W. What is the resistance of the heating element when operating?",
    options: [
      "48 Ω",
      "0.2 Ω",
      "24 Ω",
      "5 Ω"
    ],
    correctAnswer: "48 Ω",
    explanation: "Using the power formula P = V^2 / R, we get R = V^2 / P. Substituting V = 240 V and P = 1200 W: R = (240)^2 / 1200 = 57600 / 1200 = 48 Ω."
  },
  {
    id: "phy102-ce-30",
    sec: "Current Electricity",
    question: "A potential difference of 6.0 V is maintained across a 1.5 m wire. If the current is 2.0 A, what is the electric field intensity E inside the wire?",
    options: [
      "9.0 V/m",
      "4.0 V/m",
      "3.0 V/m",
      "0.25 V/m"
    ],
    correctAnswer: "4.0 V/m",
    explanation: "The electric field intensity E inside a uniform wire of length L across which a potential difference V is applied is given by E = V / L = 6.0 V / 1.5 m = 4.0 V/m."
  }
];
