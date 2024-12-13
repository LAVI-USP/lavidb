import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DiagnosticService } from '../service/diagnostic.service';

import { DiagnosticComponent } from './diagnostic.component';

describe('Diagnostic Management Component', () => {
  let comp: DiagnosticComponent;
  let fixture: ComponentFixture<DiagnosticComponent>;
  let service: DiagnosticService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'diagnostic', component: DiagnosticComponent }]), HttpClientTestingModule],
      declarations: [DiagnosticComponent],
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
      .overrideTemplate(DiagnosticComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiagnosticComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DiagnosticService);

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
    expect(comp.diagnostics?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to diagnosticService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDiagnosticIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDiagnosticIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
