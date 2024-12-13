import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DatabaseVersionFormService } from './database-version-form.service';
import { DatabaseVersionService } from '../service/database-version.service';
import { IDatabaseVersion } from '../database-version.model';

import { DatabaseVersionUpdateComponent } from './database-version-update.component';

describe('DatabaseVersion Management Update Component', () => {
  let comp: DatabaseVersionUpdateComponent;
  let fixture: ComponentFixture<DatabaseVersionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let databaseVersionFormService: DatabaseVersionFormService;
  let databaseVersionService: DatabaseVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DatabaseVersionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DatabaseVersionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DatabaseVersionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    databaseVersionFormService = TestBed.inject(DatabaseVersionFormService);
    databaseVersionService = TestBed.inject(DatabaseVersionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const databaseVersion: IDatabaseVersion = { id: 456 };

      activatedRoute.data = of({ databaseVersion });
      comp.ngOnInit();

      expect(comp.databaseVersion).toEqual(databaseVersion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDatabaseVersion>>();
      const databaseVersion = { id: 123 };
      jest.spyOn(databaseVersionFormService, 'getDatabaseVersion').mockReturnValue(databaseVersion);
      jest.spyOn(databaseVersionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ databaseVersion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: databaseVersion }));
      saveSubject.complete();

      // THEN
      expect(databaseVersionFormService.getDatabaseVersion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(databaseVersionService.update).toHaveBeenCalledWith(expect.objectContaining(databaseVersion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDatabaseVersion>>();
      const databaseVersion = { id: 123 };
      jest.spyOn(databaseVersionFormService, 'getDatabaseVersion').mockReturnValue({ id: null });
      jest.spyOn(databaseVersionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ databaseVersion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: databaseVersion }));
      saveSubject.complete();

      // THEN
      expect(databaseVersionFormService.getDatabaseVersion).toHaveBeenCalled();
      expect(databaseVersionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDatabaseVersion>>();
      const databaseVersion = { id: 123 };
      jest.spyOn(databaseVersionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ databaseVersion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(databaseVersionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
