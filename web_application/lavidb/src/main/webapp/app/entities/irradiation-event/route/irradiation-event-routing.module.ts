import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IrradiationEventComponent } from '../list/irradiation-event.component';
import { IrradiationEventDetailComponent } from '../detail/irradiation-event-detail.component';
import { IrradiationEventUpdateComponent } from '../update/irradiation-event-update.component';
import { IrradiationEventRoutingResolveService } from './irradiation-event-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const irradiationEventRoute: Routes = [
  {
    path: '',
    component: IrradiationEventComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IrradiationEventDetailComponent,
    resolve: {
      irradiationEvent: IrradiationEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IrradiationEventUpdateComponent,
    resolve: {
      irradiationEvent: IrradiationEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IrradiationEventUpdateComponent,
    resolve: {
      irradiationEvent: IrradiationEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(irradiationEventRoute)],
  exports: [RouterModule],
})
export class IrradiationEventRoutingModule {}
