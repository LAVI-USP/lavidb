import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDatabaseVersion, NewDatabaseVersion } from '../database-version.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDatabaseVersion for edit and NewDatabaseVersionFormGroupInput for create.
 */
type DatabaseVersionFormGroupInput = IDatabaseVersion | PartialWithRequiredKeyOf<NewDatabaseVersion>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDatabaseVersion | NewDatabaseVersion> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

type DatabaseVersionFormRawValue = FormValueOf<IDatabaseVersion>;

type NewDatabaseVersionFormRawValue = FormValueOf<NewDatabaseVersion>;

type DatabaseVersionFormDefaults = Pick<NewDatabaseVersion, 'id' | 'createdDate'>;

type DatabaseVersionFormGroupContent = {
  id: FormControl<DatabaseVersionFormRawValue['id'] | NewDatabaseVersion['id']>;
  versionNumber: FormControl<DatabaseVersionFormRawValue['versionNumber']>;
  createdDate: FormControl<DatabaseVersionFormRawValue['createdDate']>;
};

export type DatabaseVersionFormGroup = FormGroup<DatabaseVersionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DatabaseVersionFormService {
  createDatabaseVersionFormGroup(databaseVersion: DatabaseVersionFormGroupInput = { id: null }): DatabaseVersionFormGroup {
    const databaseVersionRawValue = this.convertDatabaseVersionToDatabaseVersionRawValue({
      ...this.getFormDefaults(),
      ...databaseVersion,
    });
    return new FormGroup<DatabaseVersionFormGroupContent>({
      id: new FormControl(
        { value: databaseVersionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      versionNumber: new FormControl(databaseVersionRawValue.versionNumber, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(databaseVersionRawValue.createdDate),
    });
  }

  getDatabaseVersion(form: DatabaseVersionFormGroup): IDatabaseVersion | NewDatabaseVersion {
    return this.convertDatabaseVersionRawValueToDatabaseVersion(
      form.getRawValue() as DatabaseVersionFormRawValue | NewDatabaseVersionFormRawValue
    );
  }

  resetForm(form: DatabaseVersionFormGroup, databaseVersion: DatabaseVersionFormGroupInput): void {
    const databaseVersionRawValue = this.convertDatabaseVersionToDatabaseVersionRawValue({ ...this.getFormDefaults(), ...databaseVersion });
    form.reset(
      {
        ...databaseVersionRawValue,
        id: { value: databaseVersionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DatabaseVersionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
    };
  }

  private convertDatabaseVersionRawValueToDatabaseVersion(
    rawDatabaseVersion: DatabaseVersionFormRawValue | NewDatabaseVersionFormRawValue
  ): IDatabaseVersion | NewDatabaseVersion {
    return {
      ...rawDatabaseVersion,
      createdDate: dayjs(rawDatabaseVersion.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertDatabaseVersionToDatabaseVersionRawValue(
    databaseVersion: IDatabaseVersion | (Partial<NewDatabaseVersion> & DatabaseVersionFormDefaults)
  ): DatabaseVersionFormRawValue | PartialWithRequiredKeyOf<NewDatabaseVersionFormRawValue> {
    return {
      ...databaseVersion,
      createdDate: databaseVersion.createdDate ? databaseVersion.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
