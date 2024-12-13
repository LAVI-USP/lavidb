import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDatabaseVersion } from '../database-version.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../database-version.test-samples';

import { DatabaseVersionService, RestDatabaseVersion } from './database-version.service';

const requireRestSample: RestDatabaseVersion = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('DatabaseVersion Service', () => {
  let service: DatabaseVersionService;
  let httpMock: HttpTestingController;
  let expectedResult: IDatabaseVersion | IDatabaseVersion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DatabaseVersionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a DatabaseVersion', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const databaseVersion = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(databaseVersion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DatabaseVersion', () => {
      const databaseVersion = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(databaseVersion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DatabaseVersion', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DatabaseVersion', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DatabaseVersion', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDatabaseVersionToCollectionIfMissing', () => {
      it('should add a DatabaseVersion to an empty array', () => {
        const databaseVersion: IDatabaseVersion = sampleWithRequiredData;
        expectedResult = service.addDatabaseVersionToCollectionIfMissing([], databaseVersion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(databaseVersion);
      });

      it('should not add a DatabaseVersion to an array that contains it', () => {
        const databaseVersion: IDatabaseVersion = sampleWithRequiredData;
        const databaseVersionCollection: IDatabaseVersion[] = [
          {
            ...databaseVersion,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDatabaseVersionToCollectionIfMissing(databaseVersionCollection, databaseVersion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DatabaseVersion to an array that doesn't contain it", () => {
        const databaseVersion: IDatabaseVersion = sampleWithRequiredData;
        const databaseVersionCollection: IDatabaseVersion[] = [sampleWithPartialData];
        expectedResult = service.addDatabaseVersionToCollectionIfMissing(databaseVersionCollection, databaseVersion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(databaseVersion);
      });

      it('should add only unique DatabaseVersion to an array', () => {
        const databaseVersionArray: IDatabaseVersion[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const databaseVersionCollection: IDatabaseVersion[] = [sampleWithRequiredData];
        expectedResult = service.addDatabaseVersionToCollectionIfMissing(databaseVersionCollection, ...databaseVersionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const databaseVersion: IDatabaseVersion = sampleWithRequiredData;
        const databaseVersion2: IDatabaseVersion = sampleWithPartialData;
        expectedResult = service.addDatabaseVersionToCollectionIfMissing([], databaseVersion, databaseVersion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(databaseVersion);
        expect(expectedResult).toContain(databaseVersion2);
      });

      it('should accept null and undefined values', () => {
        const databaseVersion: IDatabaseVersion = sampleWithRequiredData;
        expectedResult = service.addDatabaseVersionToCollectionIfMissing([], null, databaseVersion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(databaseVersion);
      });

      it('should return initial array if no DatabaseVersion is added', () => {
        const databaseVersionCollection: IDatabaseVersion[] = [sampleWithRequiredData];
        expectedResult = service.addDatabaseVersionToCollectionIfMissing(databaseVersionCollection, undefined, null);
        expect(expectedResult).toEqual(databaseVersionCollection);
      });
    });

    describe('compareDatabaseVersion', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDatabaseVersion(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDatabaseVersion(entity1, entity2);
        const compareResult2 = service.compareDatabaseVersion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDatabaseVersion(entity1, entity2);
        const compareResult2 = service.compareDatabaseVersion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDatabaseVersion(entity1, entity2);
        const compareResult2 = service.compareDatabaseVersion(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
