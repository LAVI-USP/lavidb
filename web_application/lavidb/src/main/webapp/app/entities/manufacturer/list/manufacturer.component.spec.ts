import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ManufacturerService } from '../service/manufacturer.service';

import { ManufacturerComponent } from './manufacturer.component';

describe('Manufacturer Management Component', () => {
  let comp: ManufacturerComponent;
  let fixture: ComponentFixture<ManufacturerComponent>;
  let service: ManufacturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'manufacturer', component: ManufacturerComponent }]), HttpClientTestingModule],
      declarations: [ManufacturerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ManufacturerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ManufacturerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ManufacturerService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.manufacturers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to manufacturerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getManufacturerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getManufacturerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
