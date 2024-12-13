import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDatabaseVersion } from '../database-version.model';
import { DatabaseVersionService } from '../service/database-version.service';

@Injectable({ providedIn: 'root' })
export class DatabaseVersionRoutingResolveService implements Resolve<IDatabaseVersion | null> {
  constructor(protected service: DatabaseVersionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDatabaseVersion | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((databaseVersion: HttpResponse<IDatabaseVersion>) => {
          if (databaseVersion.body) {
            return of(databaseVersion.body);
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
