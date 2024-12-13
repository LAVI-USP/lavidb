import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DatabaseRequestComponent } from './list/database-request.component';
import { DatabaseRequestDetailComponent } from './detail/database-request-detail.component';
import { DatabaseRequestUpdateComponent } from './update/database-request-update.component';
import { DatabaseRequestDeleteDialogComponent } from './delete/database-request-delete-dialog.component';
import { DatabaseRequestRoutingModule } from './route/database-request-routing.module';
import { DatabaseRequestPipe } from './list/database-request.pipe';

@NgModule({
  imports: [SharedModule, DatabaseRequestRoutingModule],
  declarations: [
    DatabaseRequestComponent,
    DatabaseRequestDetailComponent,
    DatabaseRequestUpdateComponent,
    DatabaseRequestDeleteDialogComponent,
    DatabaseRequestPipe,
  ],
})
export class DatabaseRequestModule {}
