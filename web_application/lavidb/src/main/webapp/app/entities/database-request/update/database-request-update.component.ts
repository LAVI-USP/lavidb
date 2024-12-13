import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DatabaseRequestFormService, DatabaseRequestFormGroup } from './database-request-form.service';
import { IDatabaseRequest } from '../database-request.model';
import { DatabaseRequestService } from '../service/database-request.service';
import { IDatabaseVersion } from 'app/entities/database-version/database-version.model';
import { DatabaseVersionService } from 'app/entities/database-version/service/database-version.service';
import { ICustomUser } from 'app/entities/custom-user/custom-user.model';
import { CustomUserService } from 'app/entities/custom-user/service/custom-user.service';

@Component({
  selector: 'jhi-database-request-update',
  templateUrl: './database-request-update.component.html',
})
export class DatabaseRequestUpdateComponent implements OnInit {
  isSaving = false;
  databaseRequest: IDatabaseRequest | null = null;

  databaseVersionsSharedCollection: IDatabaseVersion[] = [];
  customUsersSharedCollection: ICustomUser[] = [];

  editForm: DatabaseRequestFormGroup = this.databaseRequestFormService.createDatabaseRequestFormGroup();

  constructor(
    protected databaseRequestService: DatabaseRequestService,
    protected databaseRequestFormService: DatabaseRequestFormService,
    protected databaseVersionService: DatabaseVersionService,
    protected customUserService: CustomUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDatabaseVersion = (o1: IDatabaseVersion | null, o2: IDatabaseVersion | null): boolean =>
    this.databaseVersionService.compareDatabaseVersion(o1, o2);

  compareCustomUser = (o1: ICustomUser | null, o2: ICustomUser | null): boolean => this.customUserService.compareCustomUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ databaseRequest }) => {
      this.databaseRequest = databaseRequest;
      if (databaseRequest) {
        this.updateForm(databaseRequest);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const databaseRequest = this.databaseRequestFormService.getDatabaseRequest(this.editForm);
    if (databaseRequest.id !== null) {
      this.subscribeToSaveResponse(this.databaseRequestService.update(databaseRequest));
    } else {
      this.subscribeToSaveResponse(this.databaseRequestService.create(databaseRequest));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDatabaseRequest>>): void {
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

  protected updateForm(databaseRequest: IDatabaseRequest): void {
    this.databaseRequest = databaseRequest;
    this.databaseRequestFormService.resetForm(this.editForm, databaseRequest);

    this.databaseVersionsSharedCollection = this.databaseVersionService.addDatabaseVersionToCollectionIfMissing<IDatabaseVersion>(
      this.databaseVersionsSharedCollection,
      databaseRequest.databaseVersion
    );
    this.customUsersSharedCollection = this.customUserService.addCustomUserToCollectionIfMissing<ICustomUser>(
      this.customUsersSharedCollection,
      databaseRequest.customUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.databaseVersionService
      .query()
      .pipe(map((res: HttpResponse<IDatabaseVersion[]>) => res.body ?? []))
      .pipe(
        map((databaseVersions: IDatabaseVersion[]) =>
          this.databaseVersionService.addDatabaseVersionToCollectionIfMissing<IDatabaseVersion>(
            databaseVersions,
            this.databaseRequest?.databaseVersion
          )
        )
      )
      .subscribe((databaseVersions: IDatabaseVersion[]) => (this.databaseVersionsSharedCollection = databaseVersions));

    this.customUserService
      .query()
      .pipe(map((res: HttpResponse<ICustomUser[]>) => res.body ?? []))
      .pipe(
        map((customUsers: ICustomUser[]) =>
          this.customUserService.addCustomUserToCollectionIfMissing<ICustomUser>(customUsers, this.databaseRequest?.customUser)
        )
      )
      .subscribe((customUsers: ICustomUser[]) => (this.customUsersSharedCollection = customUsers));
  }
}
