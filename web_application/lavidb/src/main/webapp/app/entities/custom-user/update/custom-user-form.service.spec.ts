import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../custom-user.test-samples';

import { CustomUserFormService } from './custom-user-form.service';

describe('CustomUser Form Service', () => {
  let service: CustomUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomUserFormService);
  });

  describe('Service methods', () => {
    describe('createCustomUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCustomUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            licenseFile: expect.any(Object),
            internalUser: expect.any(Object),
          })
        );
      });

      it('passing ICustomUser should create a new form with FormGroup', () => {
        const formGroup = service.createCustomUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            licenseFile: expect.any(Object),
            internalUser: expect.any(Object),
          })
        );
      });
    });

    describe('getCustomUser', () => {
      it('should return NewCustomUser for default CustomUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCustomUserFormGroup(sampleWithNewData);

        const customUser = service.getCustomUser(formGroup) as any;

        expect(customUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewCustomUser for empty CustomUser initial value', () => {
        const formGroup = service.createCustomUserFormGroup();

        const customUser = service.getCustomUser(formGroup) as any;

        expect(customUser).toMatchObject({});
      });

      it('should return ICustomUser', () => {
        const formGroup = service.createCustomUserFormGroup(sampleWithRequiredData);

        const customUser = service.getCustomUser(formGroup) as any;

        expect(customUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICustomUser should not enable id FormControl', () => {
        const formGroup = service.createCustomUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCustomUser should disable id FormControl', () => {
        const formGroup = service.createCustomUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
