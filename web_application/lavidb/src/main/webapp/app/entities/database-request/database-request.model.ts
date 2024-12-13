import dayjs from 'dayjs/esm';
import { IDatabaseVersion } from 'app/entities/database-version/database-version.model';
import { ICustomUser } from 'app/entities/custom-user/custom-user.model';

export interface IDatabaseRequest {
  id: number;
  parameters?: string | null;
  createdDate?: dayjs.Dayjs | null;
  expiresAt?: dayjs.Dayjs | null;
  downloadLink?: string | null;
  databaseVersion?: Pick<IDatabaseVersion, 'id' | 'versionNumber'> | null;
  customUser?: Pick<ICustomUser, 'id'> | null;
}

export type NewDatabaseRequest = Omit<IDatabaseRequest, 'id'> & { id: null };
