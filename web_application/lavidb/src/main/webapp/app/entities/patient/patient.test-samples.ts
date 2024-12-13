import { IPatient, NewPatient } from './patient.model';

export const sampleWithRequiredData: IPatient = {
  id: 39843,
  name: 'AGP',
  birthDate: 'Montserrat',
  hash: 'Rodovia Planner',
};

export const sampleWithPartialData: IPatient = {
  id: 75571,
  name: 'Strategist',
  birthDate: 'Home Consultant Noruega',
  hash: 'International',
};

export const sampleWithFullData: IPatient = {
  id: 59959,
  name: 'Salgadinhos dourado',
  sex: 'Account',
  birthDate: 'synthesize Web',
  age: 79016,
  hash: 'Cambridgeshire Accounts navigating',
};

export const sampleWithNewData: NewPatient = {
  name: 'bluetooth microchip initiatives',
  birthDate: 'functionalities Savings',
  hash: 'stable Dynamic Bola',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
