import dayjs from 'dayjs/esm';

import { IAcquisition, NewAcquisition } from './acquisition.model';

export const sampleWithRequiredData: IAcquisition = {
  id: 85639,
  accessionNumber: 'alarm back',
  acquisitionDate: dayjs('2023-07-12T23:09'),
  imageLaterality: 'indexing Borders',
  viewPosition: 'niches',
  imagePath: 'Investment',
  imageRaw: 'Bedfordshire',
  thumbPath: 'Algodão',
  version: 32341,
};

export const sampleWithPartialData: IAcquisition = {
  id: 65395,
  accessionNumber: 'açafrão eyeballs hacking',
  acquisitionDate: dayjs('2023-07-13T19:24'),
  imageLaterality: 'deposit',
  viewPosition: 'Bacon incentivize Ergonômico',
  imagePath: 'Licenciado',
  imageRaw: 'front-end Cadeira',
  thumbPath: 'platforms',
  version: 14433,
};

export const sampleWithFullData: IAcquisition = {
  id: 99690,
  accessionNumber: 'generate',
  acquisitionDate: dayjs('2023-07-13T18:15'),
  imageLaterality: 'holistic Metal',
  viewPosition: 'Rio B2C Alameda',
  imagePath: '24/7 Zelândia Account',
  imageRaw: 'Direct Borracha',
  thumbPath: 'hub Monitored',
  version: 20374,
};

export const sampleWithNewData: NewAcquisition = {
  accessionNumber: '24/7',
  acquisitionDate: dayjs('2023-07-13T07:29'),
  imageLaterality: 'Kuwait Peso',
  viewPosition: 'parsing',
  imagePath: 'innovative Filmes',
  imageRaw: 'Agent Bacon',
  thumbPath: 'reinvent Rodovia Brinquedos',
  version: 83009,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
