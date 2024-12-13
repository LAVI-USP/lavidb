import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDatabaseRequest, NewDatabaseRequest } from '../database-request.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDatabaseRequest for edit and NewDatabaseRequestFormGroupInput for create.
 */
type DatabaseRequestFormGroupInput = IDatabaseRequest | PartialWithRequiredKeyOf<NewDatabaseRequest>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDatabaseRequest | NewDatabaseRequest> = Omit<T, 'createdDate' | 'expiresAt'> & {
  createdDate?: string | null;
  expiresAt?: string | null;
};

type DatabaseRequestFormRawValue = FormValueOf<IDatabaseRequest>;

type NewDatabaseRequestFormRawValue = FormValueOf<NewDatabaseRequest>;

type DatabaseRequestFormDefaults = Pick<NewDatabaseRequest, 'id' | 'createdDate' | 'expiresAt'>;

type DatabaseRequestFormGroupContent = {
  id: FormControl<DatabaseRequestFormRawValue['id'] | NewDatabaseRequest['id']>;
  parameters: FormControl<DatabaseRequestFormRawValue['parameters']>;
  createdDate: FormControl<DatabaseRequestFormRawValue['createdDate']>;
  expiresAt: FormControl<DatabaseRequestFormRawValue['expiresAt']>;
  downloadLink: FormControl<DatabaseRequestFormRawValue['downloadLink']>;
  databaseVersion: FormControl<DatabaseRequestFormRawValue['databaseVersion']>;
  customUser: FormControl<DatabaseRequestFormRawValue['customUser']>;
};

export type DatabaseRequestFormGroup = FormGroup<DatabaseRequestFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DatabaseRequestFormService {
  createDatabaseRequestFormGroup(databaseRequest: DatabaseRequestFormGroupInput = { id: null }): DatabaseRequestFormGroup {
    const databaseRequestRawValue = this.convertDatabaseRequestToDatabaseRequestRawValue({
      ...this.getFormDefaults(),
      ...databaseRequest,
    });
    return new FormGroup<DatabaseRequestFormGroupContent>({
      id: new FormControl(
        { value: databaseRequestRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      parameters: new FormControl(databaseRequestRawValue.parameters, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(databaseRequestRawValue.createdDate),
      expiresAt: new FormControl(databaseRequestRawValue.expiresAt),
      downloadLink: new FormControl(databaseRequestRawValue.downloadLink),
      databaseVersion: new FormControl(databaseRequestRawValue.databaseVersion),
      customUser: new FormControl(databaseRequestRawValue.customUser),
    });
  }

  getDatabaseRequest(form: DatabaseRequestFormGroup): IDatabaseRequest | NewDatabaseRequest {
    return this.convertDatabaseRequestRawValueToDatabaseRequest(
      form.getRawValue() as DatabaseRequestFormRawValue | NewDatabaseRequestFormRawValue
    );
  }

  resetForm(form: DatabaseRequestFormGroup, databaseRequest: DatabaseRequestFormGroupInput): void {
    const databaseRequestRawValue = this.convertDatabaseRequestToDatabaseRequestRawValue({ ...this.getFormDefaults(), ...databaseRequest });
    form.reset(
      {
        ...databaseRequestRawValue,
        id: { value: databaseRequestRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DatabaseRequestFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      expiresAt: currentTime,
    };
  }

  private convertDatabaseRequestRawValueToDatabaseRequest(
    rawDatabaseRequest: DatabaseRequestFormRawValue | NewDatabaseRequestFormRawValue
  ): IDatabaseRequest | NewDatabaseRequest {
    return {
      ...rawDatabaseRequest,
      createdDate: dayjs(rawDatabaseRequest.createdDate, DATE_TIME_FORMAT),
      expiresAt: dayjs(rawDatabaseRequest.expiresAt, DATE_TIME_FORMAT),
    };
  }

  private convertDatabaseRequestToDatabaseRequestRawValue(
    databaseRequest: IDatabaseRequest | (Partial<NewDatabaseRequest> & DatabaseRequestFormDefaults)
  ): DatabaseRequestFormRawValue | PartialWithRequiredKeyOf<NewDatabaseRequestFormRawValue> {
    return {
      ...databaseRequest,
      createdDate: databaseRequest.createdDate ? databaseRequest.createdDate.format(DATE_TIME_FORMAT) : undefined,
      expiresAt: databaseRequest.expiresAt ? databaseRequest.expiresAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
