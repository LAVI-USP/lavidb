import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInstitution } from '../institution.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../institution.test-samples';

import { InstitutionService } from './institution.service';

const requireRestSample: IInstitution = {
  ...sampleWithRequiredData,
};

describe('Institution Service', () => {
  let service: InstitutionService;
  let httpMock: HttpTestingController;
  let expectedResult: IInstitution | IInstitution[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InstitutionService);
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

    it('should create a Institution', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const institution = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(institution).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Institution', () => {
      const institution = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(institution).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Institution', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Institution', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Institution', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInstitutionToCollectionIfMissing', () => {
      it('should add a Institution to an empty array', () => {
        const institution: IInstitution = sampleWithRequiredData;
        expectedResult = service.addInstitutionToCollectionIfMissing([], institution);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(institution);
      });

      it('should not add a Institution to an array that contains it', () => {
        const institution: IInstitution = sampleWithRequiredData;
        const institutionCollection: IInstitution[] = [
          {
            ...institution,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInstitutionToCollectionIfMissing(institutionCollection, institution);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Institution to an array that doesn't contain it", () => {
        const institution: IInstitution = sampleWithRequiredData;
        const institutionCollection: IInstitution[] = [sampleWithPartialData];
        expectedResult = service.addInstitutionToCollectionIfMissing(institutionCollection, institution);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(institution);
      });

      it('should add only unique Institution to an array', () => {
        const institutionArray: IInstitution[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const institutionCollection: IInstitution[] = [sampleWithRequiredData];
        expectedResult = service.addInstitutionToCollectionIfMissing(institutionCollection, ...institutionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const institution: IInstitution = sampleWithRequiredData;
        const institution2: IInstitution = sampleWithPartialData;
        expectedResult = service.addInstitutionToCollectionIfMissing([], institution, institution2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(institution);
        expect(expectedResult).toContain(institution2);
      });

      it('should accept null and undefined values', () => {
        const institution: IInstitution = sampleWithRequiredData;
        expectedResult = service.addInstitutionToCollectionIfMissing([], null, institution, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(institution);
      });

      it('should return initial array if no Institution is added', () => {
        const institutionCollection: IInstitution[] = [sampleWithRequiredData];
        expectedResult = service.addInstitutionToCollectionIfMissing(institutionCollection, undefined, null);
        expect(expectedResult).toEqual(institutionCollection);
      });
    });

    describe('compareInstitution', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInstitution(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInstitution(entity1, entity2);
        const compareResult2 = service.compareInstitution(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInstitution(entity1, entity2);
        const compareResult2 = service.compareInstitution(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInstitution(entity1, entity2);
        const compareResult2 = service.compareInstitution(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
