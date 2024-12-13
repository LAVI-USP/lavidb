import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AcquisitionFormService, AcquisitionFormGroup } from './acquisition-form.service';
import { IAcquisition } from '../acquisition.model';
import { AcquisitionService } from '../service/acquisition.service';
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

@Component({
  selector: 'jhi-acquisition-update',
  templateUrl: './acquisition-update.component.html',
})
export class AcquisitionUpdateComponent implements OnInit {
  isSaving = false;
  acquisition: IAcquisition | null = null;

  manufacturersSharedCollection: IManufacturer[] = [];
  irradiationEventsSharedCollection: IIrradiationEvent[] = [];
  patientsSharedCollection: IPatient[] = [];
  diagnosticsSharedCollection: IDiagnostic[] = [];
  institutionsSharedCollection: IInstitution[] = [];

  editForm: AcquisitionFormGroup = this.acquisitionFormService.createAcquisitionFormGroup();

  constructor(
    protected acquisitionService: AcquisitionService,
    protected acquisitionFormService: AcquisitionFormService,
    protected manufacturerService: ManufacturerService,
    protected irradiationEventService: IrradiationEventService,
    protected patientService: PatientService,
    protected diagnosticService: DiagnosticService,
    protected institutionService: InstitutionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareManufacturer = (o1: IManufacturer | null, o2: IManufacturer | null): boolean =>
    this.manufacturerService.compareManufacturer(o1, o2);

  compareIrradiationEvent = (o1: IIrradiationEvent | null, o2: IIrradiationEvent | null): boolean =>
    this.irradiationEventService.compareIrradiationEvent(o1, o2);

  comparePatient = (o1: IPatient | null, o2: IPatient | null): boolean => this.patientService.comparePatient(o1, o2);

  compareDiagnostic = (o1: IDiagnostic | null, o2: IDiagnostic | null): boolean => this.diagnosticService.compareDiagnostic(o1, o2);

  compareInstitution = (o1: IInstitution | null, o2: IInstitution | null): boolean => this.institutionService.compareInstitution(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ acquisition }) => {
      this.acquisition = acquisition;
      if (acquisition) {
        this.updateForm(acquisition);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const acquisition = this.acquisitionFormService.getAcquisition(this.editForm);
    if (acquisition.id !== null) {
      this.subscribeToSaveResponse(this.acquisitionService.update(acquisition));
    } else {
      this.subscribeToSaveResponse(this.acquisitionService.create(acquisition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAcquisition>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(acquisition: IAcquisition): void {
    this.acquisition = acquisition;
    this.acquisitionFormService.resetForm(this.editForm, acquisition);

    this.manufacturersSharedCollection = this.manufacturerService.addManufacturerToCollectionIfMissing<IManufacturer>(
      this.manufacturersSharedCollection,
      acquisition.manufacturer
    );
    this.irradiationEventsSharedCollection = this.irradiationEventService.addIrradiationEventToCollectionIfMissing<IIrradiationEvent>(
      this.irradiationEventsSharedCollection,
      acquisition.irradiationEvent
    );
    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing<IPatient>(
      this.patientsSharedCollection,
      acquisition.patient
    );
    this.diagnosticsSharedCollection = this.diagnosticService.addDiagnosticToCollectionIfMissing<IDiagnostic>(
      this.diagnosticsSharedCollection,
      acquisition.diagnostic
    );
    this.institutionsSharedCollection = this.institutionService.addInstitutionToCollectionIfMissing<IInstitution>(
      this.institutionsSharedCollection,
      acquisition.institution
    );
  }

  protected loadRelationshipsOptions(): void {
    this.manufacturerService
      .query()
      .pipe(map((res: HttpResponse<IManufacturer[]>) => res.body ?? []))
      .pipe(
        map((manufacturers: IManufacturer[]) =>
          this.manufacturerService.addManufacturerToCollectionIfMissing<IManufacturer>(manufacturers, this.acquisition?.manufacturer)
        )
      )
      .subscribe((manufacturers: IManufacturer[]) => (this.manufacturersSharedCollection = manufacturers));

    this.irradiationEventService
      .query()
      .pipe(map((res: HttpResponse<IIrradiationEvent[]>) => res.body ?? []))
      .pipe(
        map((irradiationEvents: IIrradiationEvent[]) =>
          this.irradiationEventService.addIrradiationEventToCollectionIfMissing<IIrradiationEvent>(
            irradiationEvents,
            this.acquisition?.irradiationEvent
          )
        )
      )
      .subscribe((irradiationEvents: IIrradiationEvent[]) => (this.irradiationEventsSharedCollection = irradiationEvents));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing<IPatient>(patients, this.acquisition?.patient))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));

    this.diagnosticService
      .query()
      .pipe(map((res: HttpResponse<IDiagnostic[]>) => res.body ?? []))
      .pipe(
        map((diagnostics: IDiagnostic[]) =>
          this.diagnosticService.addDiagnosticToCollectionIfMissing<IDiagnostic>(diagnostics, this.acquisition?.diagnostic)
        )
      )
      .subscribe((diagnostics: IDiagnostic[]) => (this.diagnosticsSharedCollection = diagnostics));

    this.institutionService
      .query()
      .pipe(map((res: HttpResponse<IInstitution[]>) => res.body ?? []))
      .pipe(
        map((institutions: IInstitution[]) =>
          this.institutionService.addInstitutionToCollectionIfMissing<IInstitution>(institutions, this.acquisition?.institution)
        )
      )
      .subscribe((institutions: IInstitution[]) => (this.institutionsSharedCollection = institutions));
  }
}
