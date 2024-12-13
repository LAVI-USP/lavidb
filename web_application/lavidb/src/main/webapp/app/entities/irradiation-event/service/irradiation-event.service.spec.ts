import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIrradiationEvent } from '../irradiation-event.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../irradiation-event.test-samples';

import { IrradiationEventService } from './irradiation-event.service';

const requireRestSample: IIrradiationEvent = {
  ...sampleWithRequiredData,
};

describe('IrradiationEvent Service', () => {
  let service: IrradiationEventService;
  let httpMock: HttpTestingController;
  let expectedResult: IIrradiationEvent | IIrradiationEvent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IrradiationEventService);
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

    it('should create a IrradiationEvent', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const irradiationEvent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(irradiationEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a IrradiationEvent', () => {
      const irradiationEvent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(irradiationEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a IrradiationEvent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of IrradiationEvent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a IrradiationEvent', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIrradiationEventToCollectionIfMissing', () => {
      it('should add a IrradiationEvent to an empty array', () => {
        const irradiationEvent: IIrradiationEvent = sampleWithRequiredData;
        expectedResult = service.addIrradiationEventToCollectionIfMissing([], irradiationEvent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(irradiationEvent);
      });

      it('should not add a IrradiationEvent to an array that contains it', () => {
        const irradiationEvent: IIrradiationEvent = sampleWithRequiredData;
        const irradiationEventCollection: IIrradiationEvent[] = [
          {
            ...irradiationEvent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIrradiationEventToCollectionIfMissing(irradiationEventCollection, irradiationEvent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a IrradiationEvent to an array that doesn't contain it", () => {
        const irradiationEvent: IIrradiationEvent = sampleWithRequiredData;
        const irradiationEventCollection: IIrradiationEvent[] = [sampleWithPartialData];
        expectedResult = service.addIrradiationEventToCollectionIfMissing(irradiationEventCollection, irradiationEvent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(irradiationEvent);
      });

      it('should add only unique IrradiationEvent to an array', () => {
        const irradiationEventArray: IIrradiationEvent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const irradiationEventCollection: IIrradiationEvent[] = [sampleWithRequiredData];
        expectedResult = service.addIrradiationEventToCollectionIfMissing(irradiationEventCollection, ...irradiationEventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const irradiationEvent: IIrradiationEvent = sampleWithRequiredData;
        const irradiationEvent2: IIrradiationEvent = sampleWithPartialData;
        expectedResult = service.addIrradiationEventToCollectionIfMissing([], irradiationEvent, irradiationEvent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(irradiationEvent);
        expect(expectedResult).toContain(irradiationEvent2);
      });

      it('should accept null and undefined values', () => {
        const irradiationEvent: IIrradiationEvent = sampleWithRequiredData;
        expectedResult = service.addIrradiationEventToCollectionIfMissing([], null, irradiationEvent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(irradiationEvent);
      });

      it('should return initial array if no IrradiationEvent is added', () => {
        const irradiationEventCollection: IIrradiationEvent[] = [sampleWithRequiredData];
        expectedResult = service.addIrradiationEventToCollectionIfMissing(irradiationEventCollection, undefined, null);
        expect(expectedResult).toEqual(irradiationEventCollection);
      });
    });

    describe('compareIrradiationEvent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIrradiationEvent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIrradiationEvent(entity1, entity2);
        const compareResult2 = service.compareIrradiationEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIrradiationEvent(entity1, entity2);
        const compareResult2 = service.compareIrradiationEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIrradiationEvent(entity1, entity2);
        const compareResult2 = service.compareIrradiationEvent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
