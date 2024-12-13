import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DatabaseRequestService } from '../service/database-request.service';

import { DatabaseRequestComponent } from './database-request.component';

describe('DatabaseRequest Management Component', () => {
  let comp: DatabaseRequestComponent;
  let fixture: ComponentFixture<DatabaseRequestComponent>;
  let service: DatabaseRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'database-request', component: DatabaseRequestComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [DatabaseRequestComponent],
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
      .overrideTemplate(DatabaseRequestComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DatabaseRequestComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DatabaseRequestService);

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
    expect(comp.databaseRequests?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to databaseRequestService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDatabaseRequestIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDatabaseRequestIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
