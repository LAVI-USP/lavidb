import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DatabaseVersionComponent } from '../list/database-version.component';
import { DatabaseVersionDetailComponent } from '../detail/database-version-detail.component';
import { DatabaseVersionUpdateComponent } from '../update/database-version-update.component';
import { DatabaseVersionRoutingResolveService } from './database-version-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const databaseVersionRoute: Routes = [
  {
    path: '',
    component: DatabaseVersionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DatabaseVersionDetailComponent,
    resolve: {
      databaseVersion: DatabaseVersionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DatabaseVersionUpdateComponent,
    resolve: {
      databaseVersion: DatabaseVersionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DatabaseVersionUpdateComponent,
    resolve: {
      databaseVersion: DatabaseVersionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(databaseVersionRoute)],
  exports: [RouterModule],
})
export class DatabaseVersionRoutingModule {}
