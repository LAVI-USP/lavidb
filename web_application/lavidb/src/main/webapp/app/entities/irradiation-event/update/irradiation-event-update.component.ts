import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IrradiationEventFormService, IrradiationEventFormGroup } from './irradiation-event-form.service';
import { IIrradiationEvent } from '../irradiation-event.model';
import { IrradiationEventService } from '../service/irradiation-event.service';

@Component({
  selector: 'jhi-irradiation-event-update',
  templateUrl: './irradiation-event-update.component.html',
})
export class IrradiationEventUpdateComponent implements OnInit {
  isSaving = false;
  irradiationEvent: IIrradiationEvent | null = null;

  editForm: IrradiationEventFormGroup = this.irradiationEventFormService.createIrradiationEventFormGroup();

  constructor(
    protected irradiationEventService: IrradiationEventService,
    protected irradiationEventFormService: IrradiationEventFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ irradiationEvent }) => {
      this.irradiationEvent = irradiationEvent;
      if (irradiationEvent) {
        this.updateForm(irradiationEvent);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const irradiationEvent = this.irradiationEventFormService.getIrradiationEvent(this.editForm);
    if (irradiationEvent.id !== null) {
      this.subscribeToSaveResponse(this.irradiationEventService.update(irradiationEvent));
    } else {
      this.subscribeToSaveResponse(this.irradiationEventService.create(irradiationEvent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIrradiationEvent>>): void {
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

  protected updateForm(irradiationEvent: IIrradiationEvent): void {
    this.irradiationEvent = irradiationEvent;
    this.irradiationEventFormService.resetForm(this.editForm, irradiationEvent);
  }
}
