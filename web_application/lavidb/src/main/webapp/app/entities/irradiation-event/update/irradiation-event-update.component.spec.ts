import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IrradiationEventFormService } from './irradiation-event-form.service';
import { IrradiationEventService } from '../service/irradiation-event.service';
import { IIrradiationEvent } from '../irradiation-event.model';

import { IrradiationEventUpdateComponent } from './irradiation-event-update.component';

describe('IrradiationEvent Management Update Component', () => {
  let comp: IrradiationEventUpdateComponent;
  let fixture: ComponentFixture<IrradiationEventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let irradiationEventFormService: IrradiationEventFormService;
  let irradiationEventService: IrradiationEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IrradiationEventUpdateComponent],
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
      .overrideTemplate(IrradiationEventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IrradiationEventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    irradiationEventFormService = TestBed.inject(IrradiationEventFormService);
    irradiationEventService = TestBed.inject(IrradiationEventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const irradiationEvent: IIrradiationEvent = { id: 456 };

      activatedRoute.data = of({ irradiationEvent });
      comp.ngOnInit();

      expect(comp.irradiationEvent).toEqual(irradiationEvent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIrradiationEvent>>();
      const irradiationEvent = { id: 123 };
      jest.spyOn(irradiationEventFormService, 'getIrradiationEvent').mockReturnValue(irradiationEvent);
      jest.spyOn(irradiationEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ irradiationEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: irradiationEvent }));
      saveSubject.complete();

      // THEN
      expect(irradiationEventFormService.getIrradiationEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(irradiationEventService.update).toHaveBeenCalledWith(expect.objectContaining(irradiationEvent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIrradiationEvent>>();
      const irradiationEvent = { id: 123 };
      jest.spyOn(irradiationEventFormService, 'getIrradiationEvent').mockReturnValue({ id: null });
      jest.spyOn(irradiationEventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ irradiationEvent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: irradiationEvent }));
      saveSubject.complete();

      // THEN
      expect(irradiationEventFormService.getIrradiationEvent).toHaveBeenCalled();
      expect(irradiationEventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIrradiationEvent>>();
      const irradiationEvent = { id: 123 };
      jest.spyOn(irradiationEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ irradiationEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(irradiationEventService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
