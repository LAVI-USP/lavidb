import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AcquisitionDetailComponent } from './acquisition-detail.component';

describe('Acquisition Management Detail Component', () => {
  let comp: AcquisitionDetailComponent;
  let fixture: ComponentFixture<AcquisitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcquisitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ acquisition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AcquisitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AcquisitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load acquisition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.acquisition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
