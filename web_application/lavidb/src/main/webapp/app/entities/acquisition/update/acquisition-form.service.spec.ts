import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../acquisition.test-samples';

import { AcquisitionFormService } from './acquisition-form.service';

describe('Acquisition Form Service', () => {
  let service: AcquisitionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcquisitionFormService);
  });

  describe('Service methods', () => {
    describe('createAcquisitionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAcquisitionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            accessionNumber: expect.any(Object),
            acquisitionDate: expect.any(Object),
            imageLaterality: expect.any(Object),
            viewPosition: expect.any(Object),
            imagePath: expect.any(Object),
            imageRaw: expect.any(Object),
            thumbPath: expect.any(Object),
            version: expect.any(Object),
            manufacturer: expect.any(Object),
            irradiationEvent: expect.any(Object),
            patient: expect.any(Object),
            diagnostic: expect.any(Object),
            institution: expect.any(Object),
          })
        );
      });

      it('passing IAcquisition should create a new form with FormGroup', () => {
        const formGroup = service.createAcquisitionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            accessionNumber: expect.any(Object),
            acquisitionDate: expect.any(Object),
            imageLaterality: expect.any(Object),
            viewPosition: expect.any(Object),
            imagePath: expect.any(Object),
            imageRaw: expect.any(Object),
            thumbPath: expect.any(Object),
            version: expect.any(Object),
            manufacturer: expect.any(Object),
            irradiationEvent: expect.any(Object),
            patient: expect.any(Object),
            diagnostic: expect.any(Object),
            institution: expect.any(Object),
          })
        );
      });
    });

    describe('getAcquisition', () => {
      it('should return NewAcquisition for default Acquisition initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAcquisitionFormGroup(sampleWithNewData);

        const acquisition = service.getAcquisition(formGroup) as any;

        expect(acquisition).toMatchObject(sampleWithNewData);
      });

      it('should return NewAcquisition for empty Acquisition initial value', () => {
        const formGroup = service.createAcquisitionFormGroup();

        const acquisition = service.getAcquisition(formGroup) as any;

        expect(acquisition).toMatchObject({});
      });

      it('should return IAcquisition', () => {
        const formGroup = service.createAcquisitionFormGroup(sampleWithRequiredData);

        const acquisition = service.getAcquisition(formGroup) as any;

        expect(acquisition).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAcquisition should not enable id FormControl', () => {
        const formGroup = service.createAcquisitionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAcquisition should disable id FormControl', () => {
        const formGroup = service.createAcquisitionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
