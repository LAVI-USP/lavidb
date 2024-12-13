import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICustomUser, NewCustomUser } from '../custom-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomUser for edit and NewCustomUserFormGroupInput for create.
 */
type CustomUserFormGroupInput = ICustomUser | PartialWithRequiredKeyOf<NewCustomUser>;

type CustomUserFormDefaults = Pick<NewCustomUser, 'id'>;

type CustomUserFormGroupContent = {
  id: FormControl<ICustomUser['id'] | NewCustomUser['id']>;
  licenseFile: FormControl<ICustomUser['licenseFile']>;
  internalUser: FormControl<ICustomUser['internalUser']>;
};

export type CustomUserFormGroup = FormGroup<CustomUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomUserFormService {
  createCustomUserFormGroup(customUser: CustomUserFormGroupInput = { id: null }): CustomUserFormGroup {
    const customUserRawValue = {
      ...this.getFormDefaults(),
      ...customUser,
    };
    return new FormGroup<CustomUserFormGroupContent>({
      id: new FormControl(
        { value: customUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      licenseFile: new FormControl(customUserRawValue.licenseFile, {
        validators: [Validators.required],
      }),
      internalUser: new FormControl(customUserRawValue.internalUser),
    });
  }

  getCustomUser(form: CustomUserFormGroup): ICustomUser | NewCustomUser {
    return form.getRawValue() as ICustomUser | NewCustomUser;
  }

  resetForm(form: CustomUserFormGroup, customUser: CustomUserFormGroupInput): void {
    const customUserRawValue = { ...this.getFormDefaults(), ...customUser };
    form.reset(
      {
        ...customUserRawValue,
        id: { value: customUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CustomUserFormDefaults {
    return {
      id: null,
    };
  }
}
