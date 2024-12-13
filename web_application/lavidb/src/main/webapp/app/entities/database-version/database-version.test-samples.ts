import dayjs from 'dayjs/esm';

import { IDatabaseVersion, NewDatabaseVersion } from './database-version.model';

export const sampleWithRequiredData: IDatabaseVersion = {
  id: 56989,
  versionNumber: 38362,
};

export const sampleWithPartialData: IDatabaseVersion = {
  id: 45102,
  versionNumber: 86825,
};

export const sampleWithFullData: IDatabaseVersion = {
  id: 67507,
  versionNumber: 91454,
  createdDate: dayjs('2023-07-24T20:43'),
};

export const sampleWithNewData: NewDatabaseVersion = {
  versionNumber: 88621,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
