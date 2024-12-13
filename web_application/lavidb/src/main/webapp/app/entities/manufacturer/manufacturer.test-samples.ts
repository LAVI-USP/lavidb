import { IManufacturer, NewManufacturer } from './manufacturer.model';

export const sampleWithRequiredData: IManufacturer = {
  id: 6644,
  name: 'GB Paradigm generation',
  model: 'Legacy Brinquedos Strategist',
  hash: 'interactive HTTP Principal',
};

export const sampleWithPartialData: IManufacturer = {
  id: 24568,
  name: 'Focused',
  model: 'Pula connecting Algodão',
  hash: 'Berkshire Borders partnerships',
};

export const sampleWithFullData: IManufacturer = {
  id: 65172,
  name: 'azul Berkshire complexity',
  model: 'circuit',
  modality: 'panel',
  hash: 'system intuitive',
};

export const sampleWithNewData: NewManufacturer = {
  name: 'Bicicleta Espírito intangible',
  model: 'Honduras',
  hash: 'Usability Credit',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
