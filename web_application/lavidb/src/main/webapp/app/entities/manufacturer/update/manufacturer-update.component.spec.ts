import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ManufacturerFormService } from './manufacturer-form.service';
import { ManufacturerService } from '../service/manufacturer.service';
import { IManufacturer } from '../manufacturer.model';

import { ManufacturerUpdateComponent } from './manufacturer-update.component';

describe('Manufacturer Management Update Component', () => {
  let comp: ManufacturerUpdateComponent;
  let fixture: ComponentFixture<ManufacturerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let manufacturerFormService: ManufacturerFormService;
  let manufacturerService: ManufacturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ManufacturerUpdateComponent],
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
      .overrideTemplate(ManufacturerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ManufacturerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    manufacturerFormService = TestBed.inject(ManufacturerFormService);
    manufacturerService = TestBed.inject(ManufacturerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const manufacturer: IManufacturer = { id: 456 };

      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      expect(comp.manufacturer).toEqual(manufacturer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManufacturer>>();
      const manufacturer = { id: 123 };
      jest.spyOn(manufacturerFormService, 'getManufacturer').mockReturnValue(manufacturer);
      jest.spyOn(manufacturerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manufacturer }));
      saveSubject.complete();

      // THEN
      expect(manufacturerFormService.getManufacturer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(manufacturerService.update).toHaveBeenCalledWith(expect.objectContaining(manufacturer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManufacturer>>();
      const manufacturer = { id: 123 };
      jest.spyOn(manufacturerFormService, 'getManufacturer').mockReturnValue({ id: null });
      jest.spyOn(manufacturerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manufacturer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manufacturer }));
      saveSubject.complete();

      // THEN
      expect(manufacturerFormService.getManufacturer).toHaveBeenCalled();
      expect(manufacturerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManufacturer>>();
      const manufacturer = { id: 123 };
      jest.spyOn(manufacturerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manufacturer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(manufacturerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
