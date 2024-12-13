import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomUserFormService } from './custom-user-form.service';
import { CustomUserService } from '../service/custom-user.service';
import { ICustomUser } from '../custom-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { CustomUserUpdateComponent } from './custom-user-update.component';

describe('CustomUser Management Update Component', () => {
  let comp: CustomUserUpdateComponent;
  let fixture: ComponentFixture<CustomUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customUserFormService: CustomUserFormService;
  let customUserService: CustomUserService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomUserUpdateComponent],
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
      .overrideTemplate(CustomUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customUserFormService = TestBed.inject(CustomUserFormService);
    customUserService = TestBed.inject(CustomUserService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const customUser: ICustomUser = { id: 456 };
      const internalUser: IUser = { id: 82087 };
      customUser.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 82723 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customUser: ICustomUser = { id: 456 };
      const internalUser: IUser = { id: 49538 };
      customUser.internalUser = internalUser;

      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.customUser).toEqual(customUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomUser>>();
      const customUser = { id: 123 };
      jest.spyOn(customUserFormService, 'getCustomUser').mockReturnValue(customUser);
      jest.spyOn(customUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customUser }));
      saveSubject.complete();

      // THEN
      expect(customUserFormService.getCustomUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(customUserService.update).toHaveBeenCalledWith(expect.objectContaining(customUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomUser>>();
      const customUser = { id: 123 };
      jest.spyOn(customUserFormService, 'getCustomUser').mockReturnValue({ id: null });
      jest.spyOn(customUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customUser }));
      saveSubject.complete();

      // THEN
      expect(customUserFormService.getCustomUser).toHaveBeenCalled();
      expect(customUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomUser>>();
      const customUser = { id: 123 };
      jest.spyOn(customUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
