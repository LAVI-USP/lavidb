export interface IManufacturer {
  id: number;
  name?: string | null;
  model?: string | null;
  modality?: string | null;
  hash?: string | null;
}

export type NewManufacturer = Omit<IManufacturer, 'id'> & { id: null };
