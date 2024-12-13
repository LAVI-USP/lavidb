import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDatabaseRequest } from '../database-request.model';
import { DatabaseRequestService } from '../service/database-request.service';

@Injectable({ providedIn: 'root' })
export class DatabaseRequestRoutingResolveService implements Resolve<IDatabaseRequest | null> {
  constructor(protected service: DatabaseRequestService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDatabaseRequest | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((databaseRequest: HttpResponse<IDatabaseRequest>) => {
          if (databaseRequest.body) {
            return of(databaseRequest.body);
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
