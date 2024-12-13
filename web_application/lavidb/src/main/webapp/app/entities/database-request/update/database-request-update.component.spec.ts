import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DatabaseRequestFormService } from './database-request-form.service';
import { DatabaseRequestService } from '../service/database-request.service';
import { IDatabaseRequest } from '../database-request.model';
import { IDatabaseVersion } from 'app/entities/database-version/database-version.model';
import { DatabaseVersionService } from 'app/entities/database-version/service/database-version.service';
import { ICustomUser } from 'app/entities/custom-user/custom-user.model';
import { CustomUserService } from 'app/entities/custom-user/service/custom-user.service';

import { DatabaseRequestUpdateComponent } from './database-request-update.component';

describe('DatabaseRequest Management Update Component', () => {
  let comp: DatabaseRequestUpdateComponent;
  let fixture: ComponentFixture<DatabaseRequestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let databaseRequestFormService: DatabaseRequestFormService;
  let databaseRequestService: DatabaseRequestService;
  let databaseVersionService: DatabaseVersionService;
  let customUserService: CustomUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DatabaseRequestUpdateComponent],
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
      .overrideTemplate(DatabaseRequestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DatabaseRequestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    databaseRequestFormService = TestBed.inject(DatabaseRequestFormService);
    databaseRequestService = TestBed.inject(DatabaseRequestService);
    databaseVersionService = TestBed.inject(DatabaseVersionService);
    customUserService = TestBed.inject(CustomUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DatabaseVersion query and add missing value', () => {
      const databaseRequest: IDatabaseRequest = { id: 456 };
      const databaseVersion: IDatabaseVersion = { id: 6742 };
      databaseRequest.databaseVersion = databaseVersion;

      const databaseVersionCollection: IDatabaseVersion[] = [{ id: 51028 }];
      jest.spyOn(databaseVersionService, 'query').mockReturnValue(of(new HttpResponse({ body: databaseVersionCollection })));
      const additionalDatabaseVersions = [databaseVersion];
      const expectedCollection: IDatabaseVersion[] = [...additionalDatabaseVersions, ...databaseVersionCollection];
      jest.spyOn(databaseVersionService, 'addDatabaseVersionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ databaseRequest });
      comp.ngOnInit();

      expect(databaseVersionService.query).toHaveBeenCalled();
      expect(databaseVersionService.addDatabaseVersionToCollectionIfMissing).toHaveBeenCalledWith(
        databaseVersionCollection,
        ...additionalDatabaseVersions.map(expect.objectContaining)
      );
      expect(comp.databaseVersionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CustomUser query and add missing value', () => {
      const databaseRequest: IDatabaseRequest = { id: 456 };
      const customUser: ICustomUser = { id: 52877 };
      databaseRequest.customUser = customUser;

      const customUserCollection: ICustomUser[] = [{ id: 69103 }];
      jest.spyOn(customUserService, 'query').mockReturnValue(of(new HttpResponse({ body: customUserCollection })));
      const additionalCustomUsers = [customUser];
      const expectedCollection: ICustomUser[] = [...additionalCustomUsers, ...customUserCollection];
      jest.spyOn(customUserService, 'addCustomUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ databaseRequest });
      comp.ngOnInit();

      expect(customUserService.query).toHaveBeenCalled();
      expect(customUserService.addCustomUserToCollectionIfMissing).toHaveBeenCalledWith(
        customUserCollection,
        ...additionalCustomUsers.map(expect.objectContaining)
      );
      expect(comp.customUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const databaseRequest: IDatabaseRequest = { id: 456 };
      const databaseVersion: IDatabaseVersion = { id: 1100 };
      databaseRequest.databaseVersion = databaseVersion;
      const customUser: ICustomUser = { id: 29659 };
      databaseRequest.customUser = customUser;

      activatedRoute.data = of({ databaseRequest });
      comp.ngOnInit();

      expect(comp.databaseVersionsSharedCollection).toContain(databaseVersion);
      expect(comp.customUsersSharedCollection).toContain(customUser);
      expect(comp.databaseRequest).toEqual(databaseRequest);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDatabaseRequest>>();
      const databaseRequest = { id: 123 };
      jest.spyOn(databaseRequestFormService, 'getDatabaseRequest').mockReturnValue(databaseRequest);
      jest.spyOn(databaseRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ databaseRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: databaseRequest }));
      saveSubject.complete();

      // THEN
      expect(databaseRequestFormService.getDatabaseRequest).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(databaseRequestService.update).toHaveBeenCalledWith(expect.objectContaining(databaseRequest));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDatabaseRequest>>();
      const databaseRequest = { id: 123 };
      jest.spyOn(databaseRequestFormService, 'getDatabaseRequest').mockReturnValue({ id: null });
      jest.spyOn(databaseRequestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ databaseRequest: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: databaseRequest }));
      saveSubject.complete();

      // THEN
      expect(databaseRequestFormService.getDatabaseRequest).toHaveBeenCalled();
      expect(databaseRequestService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDatabaseRequest>>();
      const databaseRequest = { id: 123 };
      jest.spyOn(databaseRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ databaseRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(databaseRequestService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDatabaseVersion', () => {
      it('Should forward to databaseVersionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(databaseVersionService, 'compareDatabaseVersion');
        comp.compareDatabaseVersion(entity, entity2);
        expect(databaseVersionService.compareDatabaseVersion).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCustomUser', () => {
      it('Should forward to customUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(customUserService, 'compareCustomUser');
        comp.compareCustomUser(entity, entity2);
        expect(customUserService.compareCustomUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
