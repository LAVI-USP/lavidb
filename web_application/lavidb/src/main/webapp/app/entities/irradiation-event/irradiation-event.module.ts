import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IrradiationEventComponent } from './list/irradiation-event.component';
import { IrradiationEventDetailComponent } from './detail/irradiation-event-detail.component';
import { IrradiationEventUpdateComponent } from './update/irradiation-event-update.component';
import { IrradiationEventDeleteDialogComponent } from './delete/irradiation-event-delete-dialog.component';
import { IrradiationEventRoutingModule } from './route/irradiation-event-routing.module';

@NgModule({
  imports: [SharedModule, IrradiationEventRoutingModule],
  declarations: [
    IrradiationEventComponent,
    IrradiationEventDetailComponent,
    IrradiationEventUpdateComponent,
    IrradiationEventDeleteDialogComponent,
  ],
})
export class IrradiationEventModule {}
