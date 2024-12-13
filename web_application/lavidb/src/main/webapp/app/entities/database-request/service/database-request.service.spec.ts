import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDatabaseRequest } from '../database-request.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../database-request.test-samples';

import { DatabaseRequestService, RestDatabaseRequest } from './database-request.service';

const requireRestSample: RestDatabaseRequest = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  expiresAt: sampleWithRequiredData.expiresAt?.toJSON(),
};

describe('DatabaseRequest Service', () => {
  let service: DatabaseRequestService;
  let httpMock: HttpTestingController;
  let expectedResult: IDatabaseRequest | IDatabaseRequest[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DatabaseRequestService);
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

    it('should create a DatabaseRequest', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const databaseRequest = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(databaseRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DatabaseRequest', () => {
      const databaseRequest = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(databaseRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DatabaseRequest', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DatabaseRequest', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DatabaseRequest', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDatabaseRequestToCollectionIfMissing', () => {
      it('should add a DatabaseRequest to an empty array', () => {
        const databaseRequest: IDatabaseRequest = sampleWithRequiredData;
        expectedResult = service.addDatabaseRequestToCollectionIfMissing([], databaseRequest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(databaseRequest);
      });

      it('should not add a DatabaseRequest to an array that contains it', () => {
        const databaseRequest: IDatabaseRequest = sampleWithRequiredData;
        const databaseRequestCollection: IDatabaseRequest[] = [
          {
            ...databaseRequest,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDatabaseRequestToCollectionIfMissing(databaseRequestCollection, databaseRequest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DatabaseRequest to an array that doesn't contain it", () => {
        const databaseRequest: IDatabaseRequest = sampleWithRequiredData;
        const databaseRequestCollection: IDatabaseRequest[] = [sampleWithPartialData];
        expectedResult = service.addDatabaseRequestToCollectionIfMissing(databaseRequestCollection, databaseRequest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(databaseRequest);
      });

      it('should add only unique DatabaseRequest to an array', () => {
        const databaseRequestArray: IDatabaseRequest[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const databaseRequestCollection: IDatabaseRequest[] = [sampleWithRequiredData];
        expectedResult = service.addDatabaseRequestToCollectionIfMissing(databaseRequestCollection, ...databaseRequestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const databaseRequest: IDatabaseRequest = sampleWithRequiredData;
        const databaseRequest2: IDatabaseRequest = sampleWithPartialData;
        expectedResult = service.addDatabaseRequestToCollectionIfMissing([], databaseRequest, databaseRequest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(databaseRequest);
        expect(expectedResult).toContain(databaseRequest2);
      });

      it('should accept null and undefined values', () => {
        const databaseRequest: IDatabaseRequest = sampleWithRequiredData;
        expectedResult = service.addDatabaseRequestToCollectionIfMissing([], null, databaseRequest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(databaseRequest);
      });

      it('should return initial array if no DatabaseRequest is added', () => {
        const databaseRequestCollection: IDatabaseRequest[] = [sampleWithRequiredData];
        expectedResult = service.addDatabaseRequestToCollectionIfMissing(databaseRequestCollection, undefined, null);
        expect(expectedResult).toEqual(databaseRequestCollection);
      });
    });

    describe('compareDatabaseRequest', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDatabaseRequest(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDatabaseRequest(entity1, entity2);
        const compareResult2 = service.compareDatabaseRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDatabaseRequest(entity1, entity2);
        const compareResult2 = service.compareDatabaseRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDatabaseRequest(entity1, entity2);
        const compareResult2 = service.compareDatabaseRequest(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
