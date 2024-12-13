import { IIrradiationEvent, NewIrradiationEvent } from './irradiation-event.model';

export const sampleWithRequiredData: IIrradiationEvent = {
  id: 42394,
  relativeXrayExposure: 96626,
  kvp: 'Ilha incubate convergence',
  dosemAs: 71570,
  dosemGy: 41498,
};

export const sampleWithPartialData: IIrradiationEvent = {
  id: 46675,
  relativeXrayExposure: 59328,
  kvp: 'Auto hub Usability',
  dosemAs: 78421,
  dosemGy: 99878,
};

export const sampleWithFullData: IIrradiationEvent = {
  id: 56514,
  relativeXrayExposure: 45132,
  kvp: 'input púrpura',
  dosemAs: 75955,
  dosemGy: 42677,
};

export const sampleWithNewData: NewIrradiationEvent = {
  relativeXrayExposure: 44943,
  kvp: 'Response',
  dosemAs: 80273,
  dosemGy: 66796,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
