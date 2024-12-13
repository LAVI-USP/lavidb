import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../institution.test-samples';

import { InstitutionFormService } from './institution-form.service';

describe('Institution Form Service', () => {
  let service: InstitutionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutionFormService);
  });

  describe('Service methods', () => {
    describe('createInstitutionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInstitutionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            department: expect.any(Object),
            hash: expect.any(Object),
          })
        );
      });

      it('passing IInstitution should create a new form with FormGroup', () => {
        const formGroup = service.createInstitutionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            department: expect.any(Object),
            hash: expect.any(Object),
          })
        );
      });
    });

    describe('getInstitution', () => {
      it('should return NewInstitution for default Institution initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInstitutionFormGroup(sampleWithNewData);

        const institution = service.getInstitution(formGroup) as any;

        expect(institution).toMatchObject(sampleWithNewData);
      });

      it('should return NewInstitution for empty Institution initial value', () => {
        const formGroup = service.createInstitutionFormGroup();

        const institution = service.getInstitution(formGroup) as any;

        expect(institution).toMatchObject({});
      });

      it('should return IInstitution', () => {
        const formGroup = service.createInstitutionFormGroup(sampleWithRequiredData);

        const institution = service.getInstitution(formGroup) as any;

        expect(institution).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInstitution should not enable id FormControl', () => {
        const formGroup = service.createInstitutionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInstitution should disable id FormControl', () => {
        const formGroup = service.createInstitutionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
