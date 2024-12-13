import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { InstitutionService } from '../service/institution.service';

import { InstitutionComponent } from './institution.component';

describe('Institution Management Component', () => {
  let comp: InstitutionComponent;
  let fixture: ComponentFixture<InstitutionComponent>;
  let service: InstitutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'institution', component: InstitutionComponent }]), HttpClientTestingModule],
      declarations: [InstitutionComponent],
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
      .overrideTemplate(InstitutionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstitutionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InstitutionService);

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
    expect(comp.institutions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to institutionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getInstitutionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getInstitutionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
