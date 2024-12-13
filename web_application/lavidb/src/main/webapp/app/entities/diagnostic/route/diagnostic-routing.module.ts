import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DiagnosticComponent } from '../list/diagnostic.component';
import { DiagnosticDetailComponent } from '../detail/diagnostic-detail.component';
import { DiagnosticUpdateComponent } from '../update/diagnostic-update.component';
import { DiagnosticRoutingResolveService } from './diagnostic-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const diagnosticRoute: Routes = [
  {
    path: '',
    component: DiagnosticComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiagnosticDetailComponent,
    resolve: {
      diagnostic: DiagnosticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiagnosticUpdateComponent,
    resolve: {
      diagnostic: DiagnosticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiagnosticUpdateComponent,
    resolve: {
      diagnostic: DiagnosticRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(diagnosticRoute)],
  exports: [RouterModule],
})
export class DiagnosticRoutingModule {}
