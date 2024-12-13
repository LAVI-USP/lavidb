import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomUser } from '../custom-user.model';
import { CustomUserService } from '../service/custom-user.service';

@Injectable({ providedIn: 'root' })
export class CustomUserRoutingResolveService implements Resolve<ICustomUser | null> {
  constructor(protected service: CustomUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomUser | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((customUser: HttpResponse<ICustomUser>) => {
          if (customUser.body) {
            return of(customUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
