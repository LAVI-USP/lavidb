import { ICustomUser, NewCustomUser } from './custom-user.model';

export const sampleWithRequiredData: ICustomUser = {
  id: 30403,
  licenseFile: 'deposit Turcomenistão',
};

export const sampleWithPartialData: ICustomUser = {
  id: 93667,
  licenseFile: 'Corporate help-desk',
};

export const sampleWithFullData: ICustomUser = {
  id: 24641,
  licenseFile: 'SMTP overriding maximize',
};

export const sampleWithNewData: NewCustomUser = {
  licenseFile: 'Markets',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
