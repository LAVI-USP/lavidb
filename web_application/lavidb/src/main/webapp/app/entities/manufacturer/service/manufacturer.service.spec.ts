import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IManufacturer } from '../manufacturer.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../manufacturer.test-samples';

import { ManufacturerService } from './manufacturer.service';

const requireRestSample: IManufacturer = {
  ...sampleWithRequiredData,
};

describe('Manufacturer Service', () => {
  let service: ManufacturerService;
  let httpMock: HttpTestingController;
  let expectedResult: IManufacturer | IManufacturer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ManufacturerService);
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

    it('should create a Manufacturer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const manufacturer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(manufacturer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Manufacturer', () => {
      const manufacturer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(manufacturer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Manufacturer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Manufacturer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Manufacturer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addManufacturerToCollectionIfMissing', () => {
      it('should add a Manufacturer to an empty array', () => {
        const manufacturer: IManufacturer = sampleWithRequiredData;
        expectedResult = service.addManufacturerToCollectionIfMissing([], manufacturer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manufacturer);
      });

      it('should not add a Manufacturer to an array that contains it', () => {
        const manufacturer: IManufacturer = sampleWithRequiredData;
        const manufacturerCollection: IManufacturer[] = [
          {
            ...manufacturer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, manufacturer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Manufacturer to an array that doesn't contain it", () => {
        const manufacturer: IManufacturer = sampleWithRequiredData;
        const manufacturerCollection: IManufacturer[] = [sampleWithPartialData];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, manufacturer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manufacturer);
      });

      it('should add only unique Manufacturer to an array', () => {
        const manufacturerArray: IManufacturer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const manufacturerCollection: IManufacturer[] = [sampleWithRequiredData];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, ...manufacturerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const manufacturer: IManufacturer = sampleWithRequiredData;
        const manufacturer2: IManufacturer = sampleWithPartialData;
        expectedResult = service.addManufacturerToCollectionIfMissing([], manufacturer, manufacturer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manufacturer);
        expect(expectedResult).toContain(manufacturer2);
      });

      it('should accept null and undefined values', () => {
        const manufacturer: IManufacturer = sampleWithRequiredData;
        expectedResult = service.addManufacturerToCollectionIfMissing([], null, manufacturer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manufacturer);
      });

      it('should return initial array if no Manufacturer is added', () => {
        const manufacturerCollection: IManufacturer[] = [sampleWithRequiredData];
        expectedResult = service.addManufacturerToCollectionIfMissing(manufacturerCollection, undefined, null);
        expect(expectedResult).toEqual(manufacturerCollection);
      });
    });

    describe('compareManufacturer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareManufacturer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareManufacturer(entity1, entity2);
        const compareResult2 = service.compareManufacturer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareManufacturer(entity1, entity2);
        const compareResult2 = service.compareManufacturer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareManufacturer(entity1, entity2);
        const compareResult2 = service.compareManufacturer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
