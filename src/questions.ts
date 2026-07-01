/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from './types';
import { ELECTROSTATICS_QUESTIONS } from './questions/electrostatics';
import { CURRENT_ELECTRICITY_QUESTIONS } from './questions/current_electricity';
import { MAGNETISM_INDUCTION_QUESTIONS } from './questions/magnetism_induction';

export const BANK: Question[] = [
  ...ELECTROSTATICS_QUESTIONS,
  ...CURRENT_ELECTRICITY_QUESTIONS,
  ...MAGNETISM_INDUCTION_QUESTIONS,
];
