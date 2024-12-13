import dayjs from 'dayjs/esm';

export interface IDatabaseVersion {
  id: number;
  versionNumber?: number | null;
  createdDate?: dayjs.Dayjs | null;
}

export type NewDatabaseVersion = Omit<IDatabaseVersion, 'id'> & { id: null };
