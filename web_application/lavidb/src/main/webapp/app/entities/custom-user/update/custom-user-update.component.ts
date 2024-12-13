import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CustomUserFormService, CustomUserFormGroup } from './custom-user-form.service';
import { ICustomUser } from '../custom-user.model';
import { CustomUserService } from '../service/custom-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-custom-user-update',
  templateUrl: './custom-user-update.component.html',
})
export class CustomUserUpdateComponent implements OnInit {
  isSaving = false;
  customUser: ICustomUser | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: CustomUserFormGroup = this.customUserFormService.createCustomUserFormGroup();

  constructor(
    protected customUserService: CustomUserService,
    protected customUserFormService: CustomUserFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customUser }) => {
      this.customUser = customUser;
      if (customUser) {
        this.updateForm(customUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customUser = this.customUserFormService.getCustomUser(this.editForm);
    if (customUser.id !== null) {
      this.subscribeToSaveResponse(this.customUserService.update(customUser));
    } else {
      this.subscribeToSaveResponse(this.customUserService.create(customUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomUser>>): void {
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

  protected updateForm(customUser: ICustomUser): void {
    this.customUser = customUser;
    this.customUserFormService.resetForm(this.editForm, customUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, customUser.internalUser);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.customUser?.internalUser)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
