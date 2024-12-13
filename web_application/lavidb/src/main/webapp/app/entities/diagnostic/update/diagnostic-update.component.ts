import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DiagnosticFormService, DiagnosticFormGroup } from './diagnostic-form.service';
import { IDiagnostic } from '../diagnostic.model';
import { DiagnosticService } from '../service/diagnostic.service';

@Component({
  selector: 'jhi-diagnostic-update',
  templateUrl: './diagnostic-update.component.html',
})
export class DiagnosticUpdateComponent implements OnInit {
  isSaving = false;
  diagnostic: IDiagnostic | null = null;

  editForm: DiagnosticFormGroup = this.diagnosticFormService.createDiagnosticFormGroup();

  constructor(
    protected diagnosticService: DiagnosticService,
    protected diagnosticFormService: DiagnosticFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diagnostic }) => {
      this.diagnostic = diagnostic;
      if (diagnostic) {
        this.updateForm(diagnostic);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const diagnostic = this.diagnosticFormService.getDiagnostic(this.editForm);
    if (diagnostic.id !== null) {
      this.subscribeToSaveResponse(this.diagnosticService.update(diagnostic));
    } else {
      this.subscribeToSaveResponse(this.diagnosticService.create(diagnostic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiagnostic>>): void {
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

  protected updateForm(diagnostic: IDiagnostic): void {
    this.diagnostic = diagnostic;
    this.diagnosticFormService.resetForm(this.editForm, diagnostic);
  }
}
