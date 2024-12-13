import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAcquisition } from '../acquisition.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../acquisition.test-samples';

import { AcquisitionService, RestAcquisition } from './acquisition.service';

const requireRestSample: RestAcquisition = {
  ...sampleWithRequiredData,
  acquisitionDate: sampleWithRequiredData.acquisitionDate?.toJSON(),
};

describe('Acquisition Service', () => {
  let service: AcquisitionService;
  let httpMock: HttpTestingController;
  let expectedResult: IAcquisition | IAcquisition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AcquisitionService);
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

    it('should create a Acquisition', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const acquisition = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(acquisition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Acquisition', () => {
      const acquisition = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(acquisition).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Acquisition', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Acquisition', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Acquisition', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAcquisitionToCollectionIfMissing', () => {
      it('should add a Acquisition to an empty array', () => {
        const acquisition: IAcquisition = sampleWithRequiredData;
        expectedResult = service.addAcquisitionToCollectionIfMissing([], acquisition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(acquisition);
      });

      it('should not add a Acquisition to an array that contains it', () => {
        const acquisition: IAcquisition = sampleWithRequiredData;
        const acquisitionCollection: IAcquisition[] = [
          {
            ...acquisition,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAcquisitionToCollectionIfMissing(acquisitionCollection, acquisition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Acquisition to an array that doesn't contain it", () => {
        const acquisition: IAcquisition = sampleWithRequiredData;
        const acquisitionCollection: IAcquisition[] = [sampleWithPartialData];
        expectedResult = service.addAcquisitionToCollectionIfMissing(acquisitionCollection, acquisition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(acquisition);
      });

      it('should add only unique Acquisition to an array', () => {
        const acquisitionArray: IAcquisition[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const acquisitionCollection: IAcquisition[] = [sampleWithRequiredData];
        expectedResult = service.addAcquisitionToCollectionIfMissing(acquisitionCollection, ...acquisitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const acquisition: IAcquisition = sampleWithRequiredData;
        const acquisition2: IAcquisition = sampleWithPartialData;
        expectedResult = service.addAcquisitionToCollectionIfMissing([], acquisition, acquisition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(acquisition);
        expect(expectedResult).toContain(acquisition2);
      });

      it('should accept null and undefined values', () => {
        const acquisition: IAcquisition = sampleWithRequiredData;
        expectedResult = service.addAcquisitionToCollectionIfMissing([], null, acquisition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(acquisition);
      });

      it('should return initial array if no Acquisition is added', () => {
        const acquisitionCollection: IAcquisition[] = [sampleWithRequiredData];
        expectedResult = service.addAcquisitionToCollectionIfMissing(acquisitionCollection, undefined, null);
        expect(expectedResult).toEqual(acquisitionCollection);
      });
    });

    describe('compareAcquisition', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAcquisition(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAcquisition(entity1, entity2);
        const compareResult2 = service.compareAcquisition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAcquisition(entity1, entity2);
        const compareResult2 = service.compareAcquisition(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAcquisition(entity1, entity2);
        const compareResult2 = service.compareAcquisition(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
