import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IIrradiationEvent, NewIrradiationEvent } from '../irradiation-event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIrradiationEvent for edit and NewIrradiationEventFormGroupInput for create.
 */
type IrradiationEventFormGroupInput = IIrradiationEvent | PartialWithRequiredKeyOf<NewIrradiationEvent>;

type IrradiationEventFormDefaults = Pick<NewIrradiationEvent, 'id'>;

type IrradiationEventFormGroupContent = {
  id: FormControl<IIrradiationEvent['id'] | NewIrradiationEvent['id']>;
  relativeXrayExposure: FormControl<IIrradiationEvent['relativeXrayExposure']>;
  kvp: FormControl<IIrradiationEvent['kvp']>;
  dosemAs: FormControl<IIrradiationEvent['dosemAs']>;
  dosemGy: FormControl<IIrradiationEvent['dosemGy']>;
};

export type IrradiationEventFormGroup = FormGroup<IrradiationEventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IrradiationEventFormService {
  createIrradiationEventFormGroup(irradiationEvent: IrradiationEventFormGroupInput = { id: null }): IrradiationEventFormGroup {
    const irradiationEventRawValue = {
      ...this.getFormDefaults(),
      ...irradiationEvent,
    };
    return new FormGroup<IrradiationEventFormGroupContent>({
      id: new FormControl(
        { value: irradiationEventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      relativeXrayExposure: new FormControl(irradiationEventRawValue.relativeXrayExposure, {
        validators: [Validators.required],
      }),
      kvp: new FormControl(irradiationEventRawValue.kvp, {
        validators: [Validators.required],
      }),
      dosemAs: new FormControl(irradiationEventRawValue.dosemAs, {
        validators: [Validators.required],
      }),
      dosemGy: new FormControl(irradiationEventRawValue.dosemGy, {
        validators: [Validators.required],
      }),
    });
  }

  getIrradiationEvent(form: IrradiationEventFormGroup): IIrradiationEvent | NewIrradiationEvent {
    return form.getRawValue() as IIrradiationEvent | NewIrradiationEvent;
  }

  resetForm(form: IrradiationEventFormGroup, irradiationEvent: IrradiationEventFormGroupInput): void {
    const irradiationEventRawValue = { ...this.getFormDefaults(), ...irradiationEvent };
    form.reset(
      {
        ...irradiationEventRawValue,
        id: { value: irradiationEventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): IrradiationEventFormDefaults {
    return {
      id: null,
    };
  }
}
