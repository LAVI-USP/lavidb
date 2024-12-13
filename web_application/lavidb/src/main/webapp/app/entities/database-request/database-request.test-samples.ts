import dayjs from 'dayjs/esm';

import { IDatabaseRequest, NewDatabaseRequest } from './database-request.model';

export const sampleWithRequiredData: IDatabaseRequest = {
  id: 72391,
  parameters: 'interactive Grosso iterate',
};

export const sampleWithPartialData: IDatabaseRequest = {
  id: 59874,
  parameters: 'Bebê',
  createdDate: dayjs('2023-07-13T09:03'),
  expiresAt: dayjs('2023-07-13T11:53'),
  downloadLink: 'transmitting background cohesive',
};

export const sampleWithFullData: IDatabaseRequest = {
  id: 19273,
  parameters: 'parsing compressing Rufiyaa',
  createdDate: dayjs('2023-07-13T20:18'),
  expiresAt: dayjs('2023-07-13T18:25'),
  downloadLink: 'Ergonômico initiative approach',
};

export const sampleWithNewData: NewDatabaseRequest = {
  parameters: 'Toalhas bronze',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
