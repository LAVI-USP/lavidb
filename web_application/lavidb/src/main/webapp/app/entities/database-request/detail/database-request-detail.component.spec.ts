import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DatabaseRequestDetailComponent } from './database-request-detail.component';

describe('DatabaseRequest Management Detail Component', () => {
  let comp: DatabaseRequestDetailComponent;
  let fixture: ComponentFixture<DatabaseRequestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatabaseRequestDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ databaseRequest: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DatabaseRequestDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DatabaseRequestDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load databaseRequest on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.databaseRequest).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
