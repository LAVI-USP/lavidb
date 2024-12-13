import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAcquisition } from '../acquisition.model';
import { AcquisitionService } from '../service/acquisition.service';

@Injectable({ providedIn: 'root' })
export class AcquisitionRoutingResolveService implements Resolve<IAcquisition | null> {
  constructor(protected service: AcquisitionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAcquisition | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((acquisition: HttpResponse<IAcquisition>) => {
          if (acquisition.body) {
            return of(acquisition.body);
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
