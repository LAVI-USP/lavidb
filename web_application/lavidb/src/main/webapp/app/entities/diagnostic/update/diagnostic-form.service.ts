import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDiagnostic, NewDiagnostic } from '../diagnostic.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDiagnostic for edit and NewDiagnosticFormGroupInput for create.
 */
type DiagnosticFormGroupInput = IDiagnostic | PartialWithRequiredKeyOf<NewDiagnostic>;

type DiagnosticFormDefaults = Pick<NewDiagnostic, 'id'>;

type DiagnosticFormGroupContent = {
  id: FormControl<IDiagnostic['id'] | NewDiagnostic['id']>;
  birads: FormControl<IDiagnostic['birads']>;
  description: FormControl<IDiagnostic['description']>;
};

export type DiagnosticFormGroup = FormGroup<DiagnosticFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DiagnosticFormService {
  createDiagnosticFormGroup(diagnostic: DiagnosticFormGroupInput = { id: null }): DiagnosticFormGroup {
    const diagnosticRawValue = {
      ...this.getFormDefaults(),
      ...diagnostic,
    };
    return new FormGroup<DiagnosticFormGroupContent>({
      id: new FormControl(
        { value: diagnosticRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      birads: new FormControl(diagnosticRawValue.birads, {
        validators: [Validators.required],
      }),
      description: new FormControl(diagnosticRawValue.description),
    });
  }

  getDiagnostic(form: DiagnosticFormGroup): IDiagnostic | NewDiagnostic {
    return form.getRawValue() as IDiagnostic | NewDiagnostic;
  }

  resetForm(form: DiagnosticFormGroup, diagnostic: DiagnosticFormGroupInput): void {
    const diagnosticRawValue = { ...this.getFormDefaults(), ...diagnostic };
    form.reset(
      {
        ...diagnosticRawValue,
        id: { value: diagnosticRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DiagnosticFormDefaults {
    return {
      id: null,
    };
  }
}
