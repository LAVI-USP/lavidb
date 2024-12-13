import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AcquisitionComponent } from '../list/acquisition.component';
import { AcquisitionDetailComponent } from '../detail/acquisition-detail.component';
import { AcquisitionUpdateComponent } from '../update/acquisition-update.component';
import { AcquisitionRoutingResolveService } from './acquisition-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const acquisitionRoute: Routes = [
  {
    path: '',
    component: AcquisitionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AcquisitionDetailComponent,
    resolve: {
      acquisition: AcquisitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AcquisitionUpdateComponent,
    resolve: {
      acquisition: AcquisitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AcquisitionUpdateComponent,
    resolve: {
      acquisition: AcquisitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(acquisitionRoute)],
  exports: [RouterModule],
})
export class AcquisitionRoutingModule {}
