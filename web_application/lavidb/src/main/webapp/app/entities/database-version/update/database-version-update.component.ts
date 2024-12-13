import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DatabaseVersionFormService, DatabaseVersionFormGroup } from './database-version-form.service';
import { IDatabaseVersion } from '../database-version.model';
import { DatabaseVersionService } from '../service/database-version.service';

@Component({
  selector: 'jhi-database-version-update',
  templateUrl: './database-version-update.component.html',
})
export class DatabaseVersionUpdateComponent implements OnInit {
  isSaving = false;
  databaseVersion: IDatabaseVersion | null = null;

  editForm: DatabaseVersionFormGroup = this.databaseVersionFormService.createDatabaseVersionFormGroup();

  constructor(
    protected databaseVersionService: DatabaseVersionService,
    protected databaseVersionFormService: DatabaseVersionFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ databaseVersion }) => {
      this.databaseVersion = databaseVersion;
      if (databaseVersion) {
        this.updateForm(databaseVersion);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const databaseVersion = this.databaseVersionFormService.getDatabaseVersion(this.editForm);
    if (databaseVersion.id !== null) {
      this.subscribeToSaveResponse(this.databaseVersionService.update(databaseVersion));
    } else {
      this.subscribeToSaveResponse(this.databaseVersionService.create(databaseVersion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDatabaseVersion>>): void {
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

  protected updateForm(databaseVersion: IDatabaseVersion): void {
    this.databaseVersion = databaseVersion;
    this.databaseVersionFormService.resetForm(this.editForm, databaseVersion);
  }
}
