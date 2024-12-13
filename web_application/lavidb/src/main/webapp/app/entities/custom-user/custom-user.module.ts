import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomUserComponent } from './list/custom-user.component';
import { CustomUserDetailComponent } from './detail/custom-user-detail.component';
import { CustomUserUpdateComponent } from './update/custom-user-update.component';
import { CustomUserDeleteDialogComponent } from './delete/custom-user-delete-dialog.component';
import { CustomUserRoutingModule } from './route/custom-user-routing.module';

@NgModule({
  imports: [SharedModule, CustomUserRoutingModule],
  declarations: [CustomUserComponent, CustomUserDetailComponent, CustomUserUpdateComponent, CustomUserDeleteDialogComponent],
})
export class CustomUserModule {}
