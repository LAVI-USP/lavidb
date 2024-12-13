import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDiagnostic } from '../diagnostic.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../diagnostic.test-samples';

import { DiagnosticService } from './diagnostic.service';

const requireRestSample: IDiagnostic = {
  ...sampleWithRequiredData,
};

describe('Diagnostic Service', () => {
  let service: DiagnosticService;
  let httpMock: HttpTestingController;
  let expectedResult: IDiagnostic | IDiagnostic[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DiagnosticService);
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

    it('should create a Diagnostic', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const diagnostic = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(diagnostic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Diagnostic', () => {
      const diagnostic = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(diagnostic).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Diagnostic', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Diagnostic', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Diagnostic', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDiagnosticToCollectionIfMissing', () => {
      it('should add a Diagnostic to an empty array', () => {
        const diagnostic: IDiagnostic = sampleWithRequiredData;
        expectedResult = service.addDiagnosticToCollectionIfMissing([], diagnostic);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diagnostic);
      });

      it('should not add a Diagnostic to an array that contains it', () => {
        const diagnostic: IDiagnostic = sampleWithRequiredData;
        const diagnosticCollection: IDiagnostic[] = [
          {
            ...diagnostic,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDiagnosticToCollectionIfMissing(diagnosticCollection, diagnostic);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Diagnostic to an array that doesn't contain it", () => {
        const diagnostic: IDiagnostic = sampleWithRequiredData;
        const diagnosticCollection: IDiagnostic[] = [sampleWithPartialData];
        expectedResult = service.addDiagnosticToCollectionIfMissing(diagnosticCollection, diagnostic);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diagnostic);
      });

      it('should add only unique Diagnostic to an array', () => {
        const diagnosticArray: IDiagnostic[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const diagnosticCollection: IDiagnostic[] = [sampleWithRequiredData];
        expectedResult = service.addDiagnosticToCollectionIfMissing(diagnosticCollection, ...diagnosticArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const diagnostic: IDiagnostic = sampleWithRequiredData;
        const diagnostic2: IDiagnostic = sampleWithPartialData;
        expectedResult = service.addDiagnosticToCollectionIfMissing([], diagnostic, diagnostic2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diagnostic);
        expect(expectedResult).toContain(diagnostic2);
      });

      it('should accept null and undefined values', () => {
        const diagnostic: IDiagnostic = sampleWithRequiredData;
        expectedResult = service.addDiagnosticToCollectionIfMissing([], null, diagnostic, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diagnostic);
      });

      it('should return initial array if no Diagnostic is added', () => {
        const diagnosticCollection: IDiagnostic[] = [sampleWithRequiredData];
        expectedResult = service.addDiagnosticToCollectionIfMissing(diagnosticCollection, undefined, null);
        expect(expectedResult).toEqual(diagnosticCollection);
      });
    });

    describe('compareDiagnostic', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDiagnostic(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDiagnostic(entity1, entity2);
        const compareResult2 = service.compareDiagnostic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDiagnostic(entity1, entity2);
        const compareResult2 = service.compareDiagnostic(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDiagnostic(entity1, entity2);
        const compareResult2 = service.compareDiagnostic(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
