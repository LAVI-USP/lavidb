import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../database-request.test-samples';

import { DatabaseRequestFormService } from './database-request-form.service';

describe('DatabaseRequest Form Service', () => {
  let service: DatabaseRequestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseRequestFormService);
  });

  describe('Service methods', () => {
    describe('createDatabaseRequestFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDatabaseRequestFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameters: expect.any(Object),
            createdDate: expect.any(Object),
            expiresAt: expect.any(Object),
            downloadLink: expect.any(Object),
            databaseVersion: expect.any(Object),
            customUser: expect.any(Object),
          })
        );
      });

      it('passing IDatabaseRequest should create a new form with FormGroup', () => {
        const formGroup = service.createDatabaseRequestFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            parameters: expect.any(Object),
            createdDate: expect.any(Object),
            expiresAt: expect.any(Object),
            downloadLink: expect.any(Object),
            databaseVersion: expect.any(Object),
            customUser: expect.any(Object),
          })
        );
      });
    });

    describe('getDatabaseRequest', () => {
      it('should return NewDatabaseRequest for default DatabaseRequest initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDatabaseRequestFormGroup(sampleWithNewData);

        const databaseRequest = service.getDatabaseRequest(formGroup) as any;

        expect(databaseRequest).toMatchObject(sampleWithNewData);
      });

      it('should return NewDatabaseRequest for empty DatabaseRequest initial value', () => {
        const formGroup = service.createDatabaseRequestFormGroup();

        const databaseRequest = service.getDatabaseRequest(formGroup) as any;

        expect(databaseRequest).toMatchObject({});
      });

      it('should return IDatabaseRequest', () => {
        const formGroup = service.createDatabaseRequestFormGroup(sampleWithRequiredData);

        const databaseRequest = service.getDatabaseRequest(formGroup) as any;

        expect(databaseRequest).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDatabaseRequest should not enable id FormControl', () => {
        const formGroup = service.createDatabaseRequestFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDatabaseRequest should disable id FormControl', () => {
        const formGroup = service.createDatabaseRequestFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
