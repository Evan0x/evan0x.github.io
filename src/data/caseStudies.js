import { avelamedStudy } from './studies/avelamed.js';
import { aveloopStudy } from './studies/aveloop.js';
import { hangmanStudy } from './studies/hangman.js';
import { syllacalStudy } from './studies/syllacal.js';

export const caseStudies = [syllacalStudy, avelamedStudy, aveloopStudy, hangmanStudy];

export function getCaseStudy(id) {
  return caseStudies.find((study) => study.id === id) ?? null;
}
