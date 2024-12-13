import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AcquisitionFormService } from './acquisition-form.service';
import { AcquisitionService } from '../service/acquisition.service';
import { IAcquisition } from '../acquisition.model';
import { IManufacturer } from 'app/entities/manufacturer/manufacturer.model';
import { ManufacturerService } from 'app/entities/manufacturer/service/manufacturer.service';
import { IIrradiationEvent } from 'app/entities/irradiation-event/irradiation-event.model';
import { IrradiationEventService } from 'app/entities/irradiation-event/service/irradiation-event.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDiagnostic } from 'app/entities/diagnostic/diagnostic.model';
import { DiagnosticService } from 'app/entities/diagnostic/service/diagnostic.service';
import { IInstitution } from 'app/entities/institution/institution.model';
import { InstitutionService } from 'app/entities/institution/service/institution.service';

import { AcquisitionUpdateComponent } from './acquisition-update.component';

describe('Acquisition Management Update Component', () => {
  let comp: AcquisitionUpdateComponent;
  let fixture: ComponentFixture<AcquisitionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let acquisitionFormService: AcquisitionFormService;
  let acquisitionService: AcquisitionService;
  let manufacturerService: ManufacturerService;
  let irradiationEventService: IrradiationEventService;
  let patientService: PatientService;
  let diagnosticService: DiagnosticService;
  let institutionService: InstitutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AcquisitionUpdateComponent],
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
      .overrideTemplate(AcquisitionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AcquisitionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    acquisitionFormService = TestBed.inject(AcquisitionFormService);
    acquisitionService = TestBed.inject(AcquisitionService);
    manufacturerService = TestBed.inject(ManufacturerService);
    irradiationEventService = TestBed.inject(IrradiationEventService);
    patientService = TestBed.inject(PatientService);
    diagnosticService = TestBed.inject(DiagnosticService);
    institutionService = TestBed.inject(InstitutionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Manufacturer query and add missing value', () => {
      const acquisition: IAcquisition = { id: 456 };
      const manufacturer: IManufacturer = { id: 49117 };
      acquisition.manufacturer = manufacturer;

      const manufacturerCollection: IManufacturer[] = [{ id: 66772 }];
      jest.spyOn(manufacturerService, 'query').mockReturnValue(of(new HttpResponse({ body: manufacturerCollection })));
      const additionalManufacturers = [manufacturer];
      const expectedCollection: IManufacturer[] = [...additionalManufacturers, ...manufacturerCollection];
      jest.spyOn(manufacturerService, 'addManufacturerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      expect(manufacturerService.query).toHaveBeenCalled();
      expect(manufacturerService.addManufacturerToCollectionIfMissing).toHaveBeenCalledWith(
        manufacturerCollection,
        ...additionalManufacturers.map(expect.objectContaining)
      );
      expect(comp.manufacturersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call IrradiationEvent query and add missing value', () => {
      const acquisition: IAcquisition = { id: 456 };
      const irradiationEvent: IIrradiationEvent = { id: 73933 };
      acquisition.irradiationEvent = irradiationEvent;

      const irradiationEventCollection: IIrradiationEvent[] = [{ id: 2284 }];
      jest.spyOn(irradiationEventService, 'query').mockReturnValue(of(new HttpResponse({ body: irradiationEventCollection })));
      const additionalIrradiationEvents = [irradiationEvent];
      const expectedCollection: IIrradiationEvent[] = [...additionalIrradiationEvents, ...irradiationEventCollection];
      jest.spyOn(irradiationEventService, 'addIrradiationEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      expect(irradiationEventService.query).toHaveBeenCalled();
      expect(irradiationEventService.addIrradiationEventToCollectionIfMissing).toHaveBeenCalledWith(
        irradiationEventCollection,
        ...additionalIrradiationEvents.map(expect.objectContaining)
      );
      expect(comp.irradiationEventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Patient query and add missing value', () => {
      const acquisition: IAcquisition = { id: 456 };
      const patient: IPatient = { id: 84392 };
      acquisition.patient = patient;

      const patientCollection: IPatient[] = [{ id: 80302 }];
      jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
      const additionalPatients = [patient];
      const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
      jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      expect(patientService.query).toHaveBeenCalled();
      expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(
        patientCollection,
        ...additionalPatients.map(expect.objectContaining)
      );
      expect(comp.patientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Diagnostic query and add missing value', () => {
      const acquisition: IAcquisition = { id: 456 };
      const diagnostic: IDiagnostic = { id: 65314 };
      acquisition.diagnostic = diagnostic;

      const diagnosticCollection: IDiagnostic[] = [{ id: 62483 }];
      jest.spyOn(diagnosticService, 'query').mockReturnValue(of(new HttpResponse({ body: diagnosticCollection })));
      const additionalDiagnostics = [diagnostic];
      const expectedCollection: IDiagnostic[] = [...additionalDiagnostics, ...diagnosticCollection];
      jest.spyOn(diagnosticService, 'addDiagnosticToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      expect(diagnosticService.query).toHaveBeenCalled();
      expect(diagnosticService.addDiagnosticToCollectionIfMissing).toHaveBeenCalledWith(
        diagnosticCollection,
        ...additionalDiagnostics.map(expect.objectContaining)
      );
      expect(comp.diagnosticsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Institution query and add missing value', () => {
      const acquisition: IAcquisition = { id: 456 };
      const institution: IInstitution = { id: 46194 };
      acquisition.institution = institution;

      const institutionCollection: IInstitution[] = [{ id: 85878 }];
      jest.spyOn(institutionService, 'query').mockReturnValue(of(new HttpResponse({ body: institutionCollection })));
      const additionalInstitutions = [institution];
      const expectedCollection: IInstitution[] = [...additionalInstitutions, ...institutionCollection];
      jest.spyOn(institutionService, 'addInstitutionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      expect(institutionService.query).toHaveBeenCalled();
      expect(institutionService.addInstitutionToCollectionIfMissing).toHaveBeenCalledWith(
        institutionCollection,
        ...additionalInstitutions.map(expect.objectContaining)
      );
      expect(comp.institutionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const acquisition: IAcquisition = { id: 456 };
      const manufacturer: IManufacturer = { id: 50134 };
      acquisition.manufacturer = manufacturer;
      const irradiationEvent: IIrradiationEvent = { id: 61225 };
      acquisition.irradiationEvent = irradiationEvent;
      const patient: IPatient = { id: 73823 };
      acquisition.patient = patient;
      const diagnostic: IDiagnostic = { id: 10119 };
      acquisition.diagnostic = diagnostic;
      const institution: IInstitution = { id: 93001 };
      acquisition.institution = institution;

      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      expect(comp.manufacturersSharedCollection).toContain(manufacturer);
      expect(comp.irradiationEventsSharedCollection).toContain(irradiationEvent);
      expect(comp.patientsSharedCollection).toContain(patient);
      expect(comp.diagnosticsSharedCollection).toContain(diagnostic);
      expect(comp.institutionsSharedCollection).toContain(institution);
      expect(comp.acquisition).toEqual(acquisition);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAcquisition>>();
      const acquisition = { id: 123 };
      jest.spyOn(acquisitionFormService, 'getAcquisition').mockReturnValue(acquisition);
      jest.spyOn(acquisitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: acquisition }));
      saveSubject.complete();

      // THEN
      expect(acquisitionFormService.getAcquisition).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(acquisitionService.update).toHaveBeenCalledWith(expect.objectContaining(acquisition));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAcquisition>>();
      const acquisition = { id: 123 };
      jest.spyOn(acquisitionFormService, 'getAcquisition').mockReturnValue({ id: null });
      jest.spyOn(acquisitionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ acquisition: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: acquisition }));
      saveSubject.complete();

      // THEN
      expect(acquisitionFormService.getAcquisition).toHaveBeenCalled();
      expect(acquisitionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAcquisition>>();
      const acquisition = { id: 123 };
      jest.spyOn(acquisitionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ acquisition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(acquisitionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareManufacturer', () => {
      it('Should forward to manufacturerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(manufacturerService, 'compareManufacturer');
        comp.compareManufacturer(entity, entity2);
        expect(manufacturerService.compareManufacturer).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareIrradiationEvent', () => {
      it('Should forward to irradiationEventService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(irradiationEventService, 'compareIrradiationEvent');
        comp.compareIrradiationEvent(entity, entity2);
        expect(irradiationEventService.compareIrradiationEvent).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePatient', () => {
      it('Should forward to patientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(patientService, 'comparePatient');
        comp.comparePatient(entity, entity2);
        expect(patientService.comparePatient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDiagnostic', () => {
      it('Should forward to diagnosticService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(diagnosticService, 'compareDiagnostic');
        comp.compareDiagnostic(entity, entity2);
        expect(diagnosticService.compareDiagnostic).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareInstitution', () => {
      it('Should forward to institutionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(institutionService, 'compareInstitution');
        comp.compareInstitution(entity, entity2);
        expect(institutionService.compareInstitution).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
