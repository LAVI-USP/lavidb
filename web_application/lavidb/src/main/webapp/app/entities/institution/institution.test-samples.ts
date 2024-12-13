import { IInstitution, NewInstitution } from './institution.model';

export const sampleWithRequiredData: IInstitution = {
  id: 45351,
  name: 'Buckinghamshire deposit',
  hash: 'Representative',
};

export const sampleWithPartialData: IInstitution = {
  id: 14001,
  name: 'Licenciado Refinado mão',
  hash: 'PNG deposit',
};

export const sampleWithFullData: IInstitution = {
  id: 23899,
  name: 'Forward',
  department: 'vortals',
  hash: 'monetize do',
};

export const sampleWithNewData: NewInstitution = {
  name: 'Surinam Planner payment',
  hash: 'Nauru CFP panel',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
