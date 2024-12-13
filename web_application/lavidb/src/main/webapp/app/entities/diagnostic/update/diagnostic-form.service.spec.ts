import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../diagnostic.test-samples';

import { DiagnosticFormService } from './diagnostic-form.service';

describe('Diagnostic Form Service', () => {
  let service: DiagnosticFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosticFormService);
  });

  describe('Service methods', () => {
    describe('createDiagnosticFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDiagnosticFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            birads: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing IDiagnostic should create a new form with FormGroup', () => {
        const formGroup = service.createDiagnosticFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            birads: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getDiagnostic', () => {
      it('should return NewDiagnostic for default Diagnostic initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDiagnosticFormGroup(sampleWithNewData);

        const diagnostic = service.getDiagnostic(formGroup) as any;

        expect(diagnostic).toMatchObject(sampleWithNewData);
      });

      it('should return NewDiagnostic for empty Diagnostic initial value', () => {
        const formGroup = service.createDiagnosticFormGroup();

        const diagnostic = service.getDiagnostic(formGroup) as any;

        expect(diagnostic).toMatchObject({});
      });

      it('should return IDiagnostic', () => {
        const formGroup = service.createDiagnosticFormGroup(sampleWithRequiredData);

        const diagnostic = service.getDiagnostic(formGroup) as any;

        expect(diagnostic).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDiagnostic should not enable id FormControl', () => {
        const formGroup = service.createDiagnosticFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDiagnostic should disable id FormControl', () => {
        const formGroup = service.createDiagnosticFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
