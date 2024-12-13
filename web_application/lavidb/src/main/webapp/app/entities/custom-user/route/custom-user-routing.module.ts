import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomUserComponent } from '../list/custom-user.component';
import { CustomUserDetailComponent } from '../detail/custom-user-detail.component';
import { CustomUserUpdateComponent } from '../update/custom-user-update.component';
import { CustomUserRoutingResolveService } from './custom-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const customUserRoute: Routes = [
  {
    path: '',
    component: CustomUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomUserDetailComponent,
    resolve: {
      customUser: CustomUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomUserUpdateComponent,
    resolve: {
      customUser: CustomUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomUserUpdateComponent,
    resolve: {
      customUser: CustomUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(customUserRoute)],
  exports: [RouterModule],
})
export class CustomUserRoutingModule {}
