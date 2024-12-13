import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DiagnosticFormService } from './diagnostic-form.service';
import { DiagnosticService } from '../service/diagnostic.service';
import { IDiagnostic } from '../diagnostic.model';

import { DiagnosticUpdateComponent } from './diagnostic-update.component';

describe('Diagnostic Management Update Component', () => {
  let comp: DiagnosticUpdateComponent;
  let fixture: ComponentFixture<DiagnosticUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let diagnosticFormService: DiagnosticFormService;
  let diagnosticService: DiagnosticService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DiagnosticUpdateComponent],
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
      .overrideTemplate(DiagnosticUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiagnosticUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    diagnosticFormService = TestBed.inject(DiagnosticFormService);
    diagnosticService = TestBed.inject(DiagnosticService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const diagnostic: IDiagnostic = { id: 456 };

      activatedRoute.data = of({ diagnostic });
      comp.ngOnInit();

      expect(comp.diagnostic).toEqual(diagnostic);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiagnostic>>();
      const diagnostic = { id: 123 };
      jest.spyOn(diagnosticFormService, 'getDiagnostic').mockReturnValue(diagnostic);
      jest.spyOn(diagnosticService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diagnostic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diagnostic }));
      saveSubject.complete();

      // THEN
      expect(diagnosticFormService.getDiagnostic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(diagnosticService.update).toHaveBeenCalledWith(expect.objectContaining(diagnostic));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiagnostic>>();
      const diagnostic = { id: 123 };
      jest.spyOn(diagnosticFormService, 'getDiagnostic').mockReturnValue({ id: null });
      jest.spyOn(diagnosticService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diagnostic: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diagnostic }));
      saveSubject.complete();

      // THEN
      expect(diagnosticFormService.getDiagnostic).toHaveBeenCalled();
      expect(diagnosticService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiagnostic>>();
      const diagnostic = { id: 123 };
      jest.spyOn(diagnosticService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diagnostic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(diagnosticService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
