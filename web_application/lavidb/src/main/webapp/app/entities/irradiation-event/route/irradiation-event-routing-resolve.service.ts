import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIrradiationEvent } from '../irradiation-event.model';
import { IrradiationEventService } from '../service/irradiation-event.service';

@Injectable({ providedIn: 'root' })
export class IrradiationEventRoutingResolveService implements Resolve<IIrradiationEvent | null> {
  constructor(protected service: IrradiationEventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIrradiationEvent | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((irradiationEvent: HttpResponse<IIrradiationEvent>) => {
          if (irradiationEvent.body) {
            return of(irradiationEvent.body);
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
