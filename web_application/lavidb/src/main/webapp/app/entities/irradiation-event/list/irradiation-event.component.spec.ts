import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IrradiationEventService } from '../service/irradiation-event.service';

import { IrradiationEventComponent } from './irradiation-event.component';

describe('IrradiationEvent Management Component', () => {
  let comp: IrradiationEventComponent;
  let fixture: ComponentFixture<IrradiationEventComponent>;
  let service: IrradiationEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'irradiation-event', component: IrradiationEventComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [IrradiationEventComponent],
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
      .overrideTemplate(IrradiationEventComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IrradiationEventComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IrradiationEventService);

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
    expect(comp.irradiationEvents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to irradiationEventService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getIrradiationEventIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getIrradiationEventIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
