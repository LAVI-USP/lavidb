import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AcquisitionComponent } from './list/acquisition.component';
import { AcquisitionDetailComponent } from './detail/acquisition-detail.component';
import { AcquisitionUpdateComponent } from './update/acquisition-update.component';
import { AcquisitionDeleteDialogComponent } from './delete/acquisition-delete-dialog.component';
import { AcquisitionCreateDialogComponent } from './create/acquisition-create-dialog.component';
import { AcquisitionRoutingModule } from './route/acquisition-routing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { DbRequestDialogComponent } from './db-request-dialog/db-request-dialog.component';

@NgModule({
  imports: [SharedModule, AcquisitionRoutingModule, NgxSliderModule],
  declarations: [
    AcquisitionComponent,
    AcquisitionDetailComponent,
    AcquisitionUpdateComponent,
    AcquisitionDeleteDialogComponent,
    AcquisitionCreateDialogComponent,
    DbRequestDialogComponent,
  ],
})
export class AcquisitionModule {}
