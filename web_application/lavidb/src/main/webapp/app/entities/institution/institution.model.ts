export interface IInstitution {
  id: number;
  name?: string | null;
  department?: string | null;
  hash?: string | null;
}

export type NewInstitution = Omit<IInstitution, 'id'> & { id: null };
