export interface IPatient {
  id: number;
  name?: string | null;
  sex?: string | null;
  birthDate?: string | null;
  age?: number | null;
  hash?: string | null;
}

export type NewPatient = Omit<IPatient, 'id'> & { id: null };
