import { IDiagnostic, NewDiagnostic } from './diagnostic.model';

export const sampleWithRequiredData: IDiagnostic = {
  id: 27100,
  birads: 'Travessa deposit Chief',
};

export const sampleWithPartialData: IDiagnostic = {
  id: 79722,
  birads: 'Sapatos Alameda Filmes',
};

export const sampleWithFullData: IDiagnostic = {
  id: 77879,
  birads: 'Customer-focused withdrawal',
  description: 'aggregate',
};

export const sampleWithNewData: NewDiagnostic = {
  birads: 'connecting',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
