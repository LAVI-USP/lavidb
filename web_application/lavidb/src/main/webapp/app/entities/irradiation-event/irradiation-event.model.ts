export interface IIrradiationEvent {
  id: number;
  relativeXrayExposure?: number | null;
  kvp?: string | null;
  dosemAs?: number | null;
  dosemGy?: number | null;
}

export type NewIrradiationEvent = Omit<IIrradiationEvent, 'id'> & { id: null };
