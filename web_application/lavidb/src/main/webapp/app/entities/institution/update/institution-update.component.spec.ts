import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InstitutionFormService } from './institution-form.service';
import { InstitutionService } from '../service/institution.service';
import { IInstitution } from '../institution.model';

import { InstitutionUpdateComponent } from './institution-update.component';

describe('Institution Management Update Component', () => {
  let comp: InstitutionUpdateComponent;
  let fixture: ComponentFixture<InstitutionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let institutionFormService: InstitutionFormService;
  let institutionService: InstitutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InstitutionUpdateComponent],
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
      .overrideTemplate(InstitutionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstitutionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    institutionFormService = TestBed.inject(InstitutionFormService);
    institutionService = TestBed.inject(InstitutionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const institution: IInstitution = { id: 456 };

      activatedRoute.data = of({ institution });
      comp.ngOnInit();

      expect(comp.institution).toEqual(institution);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstitution>>();
      const institution = { id: 123 };
      jest.spyOn(institutionFormService, 'getInstitution').mockReturnValue(institution);
      jest.spyOn(institutionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ institution });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: institution }));
      saveSubject.complete();

      // THEN
      expect(institutionFormService.getInstitution).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(institutionService.update).toHaveBeenCalledWith(expect.objectContaining(institution));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstitution>>();
      const institution = { id: 123 };
      jest.spyOn(institutionFormService, 'getInstitution').mockReturnValue({ id: null });
      jest.spyOn(institutionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ institution: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: institution }));
      saveSubject.complete();

      // THEN
      expect(institutionFormService.getInstitution).toHaveBeenCalled();
      expect(institutionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstitution>>();
      const institution = { id: 123 };
      jest.spyOn(institutionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ institution });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(institutionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
