import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CustomUserService } from '../service/custom-user.service';

import { CustomUserComponent } from './custom-user.component';

describe('CustomUser Management Component', () => {
  let comp: CustomUserComponent;
  let fixture: ComponentFixture<CustomUserComponent>;
  let service: CustomUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'custom-user', component: CustomUserComponent }]), HttpClientTestingModule],
      declarations: [CustomUserComponent],
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
      .overrideTemplate(CustomUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CustomUserService);

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
    expect(comp.customUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to customUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCustomUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCustomUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
