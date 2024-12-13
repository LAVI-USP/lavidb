import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiagnostic, NewDiagnostic } from '../diagnostic.model';

export type PartialUpdateDiagnostic = Partial<IDiagnostic> & Pick<IDiagnostic, 'id'>;

export type EntityResponseType = HttpResponse<IDiagnostic>;
export type EntityArrayResponseType = HttpResponse<IDiagnostic[]>;

@Injectable({ providedIn: 'root' })
export class DiagnosticService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/diagnostics');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(diagnostic: NewDiagnostic): Observable<EntityResponseType> {
    return this.http.post<IDiagnostic>(this.resourceUrl, diagnostic, { observe: 'response' });
  }

  update(diagnostic: IDiagnostic): Observable<EntityResponseType> {
    return this.http.put<IDiagnostic>(`${this.resourceUrl}/${this.getDiagnosticIdentifier(diagnostic)}`, diagnostic, {
      observe: 'response',
    });
  }

  partialUpdate(diagnostic: PartialUpdateDiagnostic): Observable<EntityResponseType> {
    return this.http.patch<IDiagnostic>(`${this.resourceUrl}/${this.getDiagnosticIdentifier(diagnostic)}`, diagnostic, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDiagnostic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDiagnostic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDiagnosticIdentifier(diagnostic: Pick<IDiagnostic, 'id'>): number {
    return diagnostic.id;
  }

  compareDiagnostic(o1: Pick<IDiagnostic, 'id'> | null, o2: Pick<IDiagnostic, 'id'> | null): boolean {
    return o1 && o2 ? this.getDiagnosticIdentifier(o1) === this.getDiagnosticIdentifier(o2) : o1 === o2;
  }

  addDiagnosticToCollectionIfMissing<Type extends Pick<IDiagnostic, 'id'>>(
    diagnosticCollection: Type[],
    ...diagnosticsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const diagnostics: Type[] = diagnosticsToCheck.filter(isPresent);
    if (diagnostics.length > 0) {
      const diagnosticCollectionIdentifiers = diagnosticCollection.map(diagnosticItem => this.getDiagnosticIdentifier(diagnosticItem)!);
      const diagnosticsToAdd = diagnostics.filter(diagnosticItem => {
        const diagnosticIdentifier = this.getDiagnosticIdentifier(diagnosticItem);
        if (diagnosticCollectionIdentifiers.includes(diagnosticIdentifier)) {
          return false;
        }
        diagnosticCollectionIdentifiers.push(diagnosticIdentifier);
        return true;
      });
      return [...diagnosticsToAdd, ...diagnosticCollection];
    }
    return diagnosticCollection;
  }
}
