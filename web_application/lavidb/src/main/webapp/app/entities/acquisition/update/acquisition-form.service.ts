import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAcquisition, NewAcquisition } from '../acquisition.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAcquisition for edit and NewAcquisitionFormGroupInput for create.
 */
type AcquisitionFormGroupInput = IAcquisition | PartialWithRequiredKeyOf<NewAcquisition>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAcquisition | NewAcquisition> = Omit<T, 'acquisitionDate'> & {
  acquisitionDate?: string | null;
};

type AcquisitionFormRawValue = FormValueOf<IAcquisition>;

type NewAcquisitionFormRawValue = FormValueOf<NewAcquisition>;

type AcquisitionFormDefaults = Pick<NewAcquisition, 'id' | 'acquisitionDate'>;

type AcquisitionFormGroupContent = {
  id: FormControl<AcquisitionFormRawValue['id'] | NewAcquisition['id']>;
  accessionNumber: FormControl<AcquisitionFormRawValue['accessionNumber']>;
  acquisitionDate: FormControl<AcquisitionFormRawValue['acquisitionDate']>;
  imageLaterality: FormControl<AcquisitionFormRawValue['imageLaterality']>;
  viewPosition: FormControl<AcquisitionFormRawValue['viewPosition']>;
  imagePath: FormControl<AcquisitionFormRawValue['imagePath']>;
  imageRaw: FormControl<AcquisitionFormRawValue['imageRaw']>;
  thumbPath: FormControl<AcquisitionFormRawValue['thumbPath']>;
  version: FormControl<AcquisitionFormRawValue['version']>;
  manufacturer: FormControl<AcquisitionFormRawValue['manufacturer']>;
  irradiationEvent: FormControl<AcquisitionFormRawValue['irradiationEvent']>;
  patient: FormControl<AcquisitionFormRawValue['patient']>;
  diagnostic: FormControl<AcquisitionFormRawValue['diagnostic']>;
  institution: FormControl<AcquisitionFormRawValue['institution']>;
};

export type AcquisitionFormGroup = FormGroup<AcquisitionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AcquisitionFormService {
  createAcquisitionFormGroup(acquisition: AcquisitionFormGroupInput = { id: null }): AcquisitionFormGroup {
    const acquisitionRawValue = this.convertAcquisitionToAcquisitionRawValue({
      ...this.getFormDefaults(),
      ...acquisition,
    });
    return new FormGroup<AcquisitionFormGroupContent>({
      id: new FormControl(
        { value: acquisitionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      accessionNumber: new FormControl(acquisitionRawValue.accessionNumber, {
        validators: [Validators.required],
      }),
      acquisitionDate: new FormControl(acquisitionRawValue.acquisitionDate, {
        validators: [Validators.required],
      }),
      imageLaterality: new FormControl(acquisitionRawValue.imageLaterality, {
        validators: [Validators.required],
      }),
      viewPosition: new FormControl(acquisitionRawValue.viewPosition, {
        validators: [Validators.required],
      }),
      imagePath: new FormControl(acquisitionRawValue.imagePath, {
        validators: [Validators.required],
      }),
      imageRaw: new FormControl(acquisitionRawValue.imageRaw, {
        validators: [Validators.required],
      }),
      thumbPath: new FormControl(acquisitionRawValue.thumbPath, {
        validators: [Validators.required],
      }),
      version: new FormControl(acquisitionRawValue.version, {
        validators: [Validators.required],
      }),
      manufacturer: new FormControl(acquisitionRawValue.manufacturer),
      irradiationEvent: new FormControl(acquisitionRawValue.irradiationEvent),
      patient: new FormControl(acquisitionRawValue.patient),
      diagnostic: new FormControl(acquisitionRawValue.diagnostic),
      institution: new FormControl(acquisitionRawValue.institution),
    });
  }

  getAcquisition(form: AcquisitionFormGroup): IAcquisition | NewAcquisition {
    return this.convertAcquisitionRawValueToAcquisition(form.getRawValue() as AcquisitionFormRawValue | NewAcquisitionFormRawValue);
  }

  resetForm(form: AcquisitionFormGroup, acquisition: AcquisitionFormGroupInput): void {
    const acquisitionRawValue = this.convertAcquisitionToAcquisitionRawValue({ ...this.getFormDefaults(), ...acquisition });
    form.reset(
      {
        ...acquisitionRawValue,
        id: { value: acquisitionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AcquisitionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      acquisitionDate: currentTime,
    };
  }

  private convertAcquisitionRawValueToAcquisition(
    rawAcquisition: AcquisitionFormRawValue | NewAcquisitionFormRawValue
  ): IAcquisition | NewAcquisition {
    return {
      ...rawAcquisition,
      acquisitionDate: dayjs(rawAcquisition.acquisitionDate, DATE_TIME_FORMAT),
    };
  }

  private convertAcquisitionToAcquisitionRawValue(
    acquisition: IAcquisition | (Partial<NewAcquisition> & AcquisitionFormDefaults)
  ): AcquisitionFormRawValue | PartialWithRequiredKeyOf<NewAcquisitionFormRawValue> {
    return {
      ...acquisition,
      acquisitionDate: acquisition.acquisitionDate ? acquisition.acquisitionDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
