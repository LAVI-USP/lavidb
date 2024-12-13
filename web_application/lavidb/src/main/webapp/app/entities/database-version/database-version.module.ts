import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DatabaseVersionComponent } from './list/database-version.component';
import { DatabaseVersionDetailComponent } from './detail/database-version-detail.component';
import { DatabaseVersionUpdateComponent } from './update/database-version-update.component';
import { DatabaseVersionDeleteDialogComponent } from './delete/database-version-delete-dialog.component';
import { DatabaseVersionRoutingModule } from './route/database-version-routing.module';

@NgModule({
  imports: [SharedModule, DatabaseVersionRoutingModule],
  declarations: [
    DatabaseVersionComponent,
    DatabaseVersionDetailComponent,
    DatabaseVersionUpdateComponent,
    DatabaseVersionDeleteDialogComponent,
  ],
})
export class DatabaseVersionModule {}
