import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomUserDetailComponent } from './custom-user-detail.component';

describe('CustomUser Management Detail Component', () => {
  let comp: CustomUserDetailComponent;
  let fixture: ComponentFixture<CustomUserDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomUserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ customUser: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CustomUserDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CustomUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load customUser on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.customUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
