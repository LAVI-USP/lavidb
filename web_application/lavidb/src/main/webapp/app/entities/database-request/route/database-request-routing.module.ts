import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DatabaseRequestComponent } from '../list/database-request.component';
import { DatabaseRequestDetailComponent } from '../detail/database-request-detail.component';
import { DatabaseRequestUpdateComponent } from '../update/database-request-update.component';
import { DatabaseRequestRoutingResolveService } from './database-request-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const databaseRequestRoute: Routes = [
  {
    path: '',
    component: DatabaseRequestComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DatabaseRequestDetailComponent,
    resolve: {
      databaseRequest: DatabaseRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DatabaseRequestUpdateComponent,
    resolve: {
      databaseRequest: DatabaseRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DatabaseRequestUpdateComponent,
    resolve: {
      databaseRequest: DatabaseRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(databaseRequestRoute)],
  exports: [RouterModule],
})
export class DatabaseRequestRoutingModule {}
