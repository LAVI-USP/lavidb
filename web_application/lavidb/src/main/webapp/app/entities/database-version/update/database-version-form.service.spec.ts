import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../database-version.test-samples';

import { DatabaseVersionFormService } from './database-version-form.service';

describe('DatabaseVersion Form Service', () => {
  let service: DatabaseVersionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseVersionFormService);
  });

  describe('Service methods', () => {
    describe('createDatabaseVersionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDatabaseVersionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            versionNumber: expect.any(Object),
            createdDate: expect.any(Object),
          })
        );
      });

      it('passing IDatabaseVersion should create a new form with FormGroup', () => {
        const formGroup = service.createDatabaseVersionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            versionNumber: expect.any(Object),
            createdDate: expect.any(Object),
          })
        );
      });
    });

    describe('getDatabaseVersion', () => {
      it('should return NewDatabaseVersion for default DatabaseVersion initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDatabaseVersionFormGroup(sampleWithNewData);

        const databaseVersion = service.getDatabaseVersion(formGroup) as any;

        expect(databaseVersion).toMatchObject(sampleWithNewData);
      });

      it('should return NewDatabaseVersion for empty DatabaseVersion initial value', () => {
        const formGroup = service.createDatabaseVersionFormGroup();

        const databaseVersion = service.getDatabaseVersion(formGroup) as any;

        expect(databaseVersion).toMatchObject({});
      });

      it('should return IDatabaseVersion', () => {
        const formGroup = service.createDatabaseVersionFormGroup(sampleWithRequiredData);

        const databaseVersion = service.getDatabaseVersion(formGroup) as any;

        expect(databaseVersion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDatabaseVersion should not enable id FormControl', () => {
        const formGroup = service.createDatabaseVersionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDatabaseVersion should disable id FormControl', () => {
        const formGroup = service.createDatabaseVersionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
