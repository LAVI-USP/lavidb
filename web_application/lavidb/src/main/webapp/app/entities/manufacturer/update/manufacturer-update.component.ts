import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ManufacturerFormService, ManufacturerFormGroup } from './manufacturer-form.service';
import { IManufacturer } from '../manufacturer.model';
import { ManufacturerService } from '../service/manufacturer.service';

@Component({
  selector: 'jhi-manufacturer-update',
  templateUrl: './manufacturer-update.component.html',
})
export class ManufacturerUpdateComponent implements OnInit {
  isSaving = false;
  manufacturer: IManufacturer | null = null;

  editForm: ManufacturerFormGroup = this.manufacturerFormService.createManufacturerFormGroup();

  constructor(
    protected manufacturerService: ManufacturerService,
    protected manufacturerFormService: ManufacturerFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ manufacturer }) => {
      this.manufacturer = manufacturer;
      if (manufacturer) {
        this.updateForm(manufacturer);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const manufacturer = this.manufacturerFormService.getManufacturer(this.editForm);
    if (manufacturer.id !== null) {
      this.subscribeToSaveResponse(this.manufacturerService.update(manufacturer));
    } else {
      this.subscribeToSaveResponse(this.manufacturerService.create(manufacturer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IManufacturer>>): void {
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

  protected updateForm(manufacturer: IManufacturer): void {
    this.manufacturer = manufacturer;
    this.manufacturerFormService.resetForm(this.editForm, manufacturer);
  }
}
