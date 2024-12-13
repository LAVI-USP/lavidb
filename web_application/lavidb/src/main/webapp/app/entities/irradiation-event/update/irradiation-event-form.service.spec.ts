import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../irradiation-event.test-samples';

import { IrradiationEventFormService } from './irradiation-event-form.service';

describe('IrradiationEvent Form Service', () => {
  let service: IrradiationEventFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IrradiationEventFormService);
  });

  describe('Service methods', () => {
    describe('createIrradiationEventFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createIrradiationEventFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            relativeXrayExposure: expect.any(Object),
            kvp: expect.any(Object),
            dosemAs: expect.any(Object),
            dosemGy: expect.any(Object),
          })
        );
      });

      it('passing IIrradiationEvent should create a new form with FormGroup', () => {
        const formGroup = service.createIrradiationEventFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            relativeXrayExposure: expect.any(Object),
            kvp: expect.any(Object),
            dosemAs: expect.any(Object),
            dosemGy: expect.any(Object),
          })
        );
      });
    });

    describe('getIrradiationEvent', () => {
      it('should return NewIrradiationEvent for default IrradiationEvent initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createIrradiationEventFormGroup(sampleWithNewData);

        const irradiationEvent = service.getIrradiationEvent(formGroup) as any;

        expect(irradiationEvent).toMatchObject(sampleWithNewData);
      });

      it('should return NewIrradiationEvent for empty IrradiationEvent initial value', () => {
        const formGroup = service.createIrradiationEventFormGroup();

        const irradiationEvent = service.getIrradiationEvent(formGroup) as any;

        expect(irradiationEvent).toMatchObject({});
      });

      it('should return IIrradiationEvent', () => {
        const formGroup = service.createIrradiationEventFormGroup(sampleWithRequiredData);

        const irradiationEvent = service.getIrradiationEvent(formGroup) as any;

        expect(irradiationEvent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIrradiationEvent should not enable id FormControl', () => {
        const formGroup = service.createIrradiationEventFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIrradiationEvent should disable id FormControl', () => {
        const formGroup = service.createIrradiationEventFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
