import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDiagnostic } from '../diagnostic.model';
import { DiagnosticService } from '../service/diagnostic.service';

@Injectable({ providedIn: 'root' })
export class DiagnosticRoutingResolveService implements Resolve<IDiagnostic | null> {
  constructor(protected service: DiagnosticService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDiagnostic | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((diagnostic: HttpResponse<IDiagnostic>) => {
          if (diagnostic.body) {
            return of(diagnostic.body);
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
