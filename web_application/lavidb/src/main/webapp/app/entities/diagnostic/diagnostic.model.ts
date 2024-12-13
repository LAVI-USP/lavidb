export interface IDiagnostic {
  id: number;
  birads?: string | null;
  description?: string | null;
}

export type NewDiagnostic = Omit<IDiagnostic, 'id'> & { id: null };
