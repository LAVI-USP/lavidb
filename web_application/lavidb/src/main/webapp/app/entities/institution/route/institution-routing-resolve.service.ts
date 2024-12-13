import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInstitution } from '../institution.model';
import { InstitutionService } from '../service/institution.service';

@Injectable({ providedIn: 'root' })
export class InstitutionRoutingResolveService implements Resolve<IInstitution | null> {
  constructor(protected service: InstitutionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInstitution | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((institution: HttpResponse<IInstitution>) => {
          if (institution.body) {
            return of(institution.body);
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
