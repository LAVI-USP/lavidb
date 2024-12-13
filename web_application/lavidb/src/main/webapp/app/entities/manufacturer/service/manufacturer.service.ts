import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IManufacturer, NewManufacturer } from '../manufacturer.model';

export type PartialUpdateManufacturer = Partial<IManufacturer> & Pick<IManufacturer, 'id'>;

export type EntityResponseType = HttpResponse<IManufacturer>;
export type EntityArrayResponseType = HttpResponse<IManufacturer[]>;

@Injectable({ providedIn: 'root' })
export class ManufacturerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/manufacturers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(manufacturer: NewManufacturer): Observable<EntityResponseType> {
    return this.http.post<IManufacturer>(this.resourceUrl, manufacturer, { observe: 'response' });
  }

  update(manufacturer: IManufacturer): Observable<EntityResponseType> {
    return this.http.put<IManufacturer>(`${this.resourceUrl}/${this.getManufacturerIdentifier(manufacturer)}`, manufacturer, {
      observe: 'response',
    });
  }

  partialUpdate(manufacturer: PartialUpdateManufacturer): Observable<EntityResponseType> {
    return this.http.patch<IManufacturer>(`${this.resourceUrl}/${this.getManufacturerIdentifier(manufacturer)}`, manufacturer, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IManufacturer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IManufacturer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getManufacturerIdentifier(manufacturer: Pick<IManufacturer, 'id'>): number {
    return manufacturer.id;
  }

  compareManufacturer(o1: Pick<IManufacturer, 'id'> | null, o2: Pick<IManufacturer, 'id'> | null): boolean {
    return o1 && o2 ? this.getManufacturerIdentifier(o1) === this.getManufacturerIdentifier(o2) : o1 === o2;
  }

  addManufacturerToCollectionIfMissing<Type extends Pick<IManufacturer, 'id'>>(
    manufacturerCollection: Type[],
    ...manufacturersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const manufacturers: Type[] = manufacturersToCheck.filter(isPresent);
    if (manufacturers.length > 0) {
      const manufacturerCollectionIdentifiers = manufacturerCollection.map(
        manufacturerItem => this.getManufacturerIdentifier(manufacturerItem)!
      );
      const manufacturersToAdd = manufacturers.filter(manufacturerItem => {
        const manufacturerIdentifier = this.getManufacturerIdentifier(manufacturerItem);
        if (manufacturerCollectionIdentifiers.includes(manufacturerIdentifier)) {
          return false;
        }
        manufacturerCollectionIdentifiers.push(manufacturerIdentifier);
        return true;
      });
      return [...manufacturersToAdd, ...manufacturerCollection];
    }
    return manufacturerCollection;
  }
}
