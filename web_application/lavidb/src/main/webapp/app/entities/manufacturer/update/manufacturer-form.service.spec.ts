import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../manufacturer.test-samples';

import { ManufacturerFormService } from './manufacturer-form.service';

describe('Manufacturer Form Service', () => {
  let service: ManufacturerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManufacturerFormService);
  });

  describe('Service methods', () => {
    describe('createManufacturerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createManufacturerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            model: expect.any(Object),
            modality: expect.any(Object),
            hash: expect.any(Object),
          })
        );
      });

      it('passing IManufacturer should create a new form with FormGroup', () => {
        const formGroup = service.createManufacturerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            model: expect.any(Object),
            modality: expect.any(Object),
            hash: expect.any(Object),
          })
        );
      });
    });

    describe('getManufacturer', () => {
      it('should return NewManufacturer for default Manufacturer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createManufacturerFormGroup(sampleWithNewData);

        const manufacturer = service.getManufacturer(formGroup) as any;

        expect(manufacturer).toMatchObject(sampleWithNewData);
      });

      it('should return NewManufacturer for empty Manufacturer initial value', () => {
        const formGroup = service.createManufacturerFormGroup();

        const manufacturer = service.getManufacturer(formGroup) as any;

        expect(manufacturer).toMatchObject({});
      });

      it('should return IManufacturer', () => {
        const formGroup = service.createManufacturerFormGroup(sampleWithRequiredData);

        const manufacturer = service.getManufacturer(formGroup) as any;

        expect(manufacturer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IManufacturer should not enable id FormControl', () => {
        const formGroup = service.createManufacturerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewManufacturer should disable id FormControl', () => {
        const formGroup = service.createManufacturerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
