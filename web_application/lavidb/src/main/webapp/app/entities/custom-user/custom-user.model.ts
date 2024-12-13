import { IUser } from 'app/entities/user/user.model';

export interface ICustomUser {
  id: number;
  licenseFile?: any | null;
  internalUser?: Pick<IUser, 'id'> | null;
}

export type NewCustomUser = Omit<ICustomUser, 'id'> & { id: null };
