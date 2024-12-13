import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IrradiationEventDetailComponent } from './irradiation-event-detail.component';

describe('IrradiationEvent Management Detail Component', () => {
  let comp: IrradiationEventDetailComponent;
  let fixture: ComponentFixture<IrradiationEventDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IrradiationEventDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ irradiationEvent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IrradiationEventDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IrradiationEventDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load irradiationEvent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.irradiationEvent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
