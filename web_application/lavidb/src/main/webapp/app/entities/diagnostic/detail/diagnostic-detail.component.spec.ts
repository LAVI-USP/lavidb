import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiagnosticDetailComponent } from './diagnostic-detail.component';

describe('Diagnostic Management Detail Component', () => {
  let comp: DiagnosticDetailComponent;
  let fixture: ComponentFixture<DiagnosticDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagnosticDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ diagnostic: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DiagnosticDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DiagnosticDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load diagnostic on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.diagnostic).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
