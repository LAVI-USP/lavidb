import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DatabaseVersionDetailComponent } from './database-version-detail.component';

describe('DatabaseVersion Management Detail Component', () => {
  let comp: DatabaseVersionDetailComponent;
  let fixture: ComponentFixture<DatabaseVersionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatabaseVersionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ databaseVersion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DatabaseVersionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DatabaseVersionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load databaseVersion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.databaseVersion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
