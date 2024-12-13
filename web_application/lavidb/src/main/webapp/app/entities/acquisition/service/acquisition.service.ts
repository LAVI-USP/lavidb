import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAcquisition, NewAcquisition } from '../acquisition.model';

export type PartialUpdateAcquisition = Partial<IAcquisition> & Pick<IAcquisition, 'id'>;

type RestOf<T extends IAcquisition | NewAcquisition> = Omit<T, 'acquisitionDate'> & {
  acquisitionDate?: string | null;
};

export type RestAcquisition = RestOf<IAcquisition>;

export type NewRestAcquisition = RestOf<NewAcquisition>;

export type PartialUpdateRestAcquisition = RestOf<PartialUpdateAcquisition>;

export type EntityResponseType = HttpResponse<IAcquisition>;
export type EntityArrayResponseType = HttpResponse<IAcquisition[]>;

@Injectable({ providedIn: 'root' })
export class AcquisitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/acquisitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(acquisition: NewAcquisition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(acquisition);
    return this.http
      .post<RestAcquisition>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(acquisition: IAcquisition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(acquisition);
    return this.http
      .put<RestAcquisition>(`${this.resourceUrl}/${this.getAcquisitionIdentifier(acquisition)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(acquisition: PartialUpdateAcquisition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(acquisition);
    return this.http
      .patch<RestAcquisition>(`${this.resourceUrl}/${this.getAcquisitionIdentifier(acquisition)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAcquisition>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  count(versionNumber: Number): Observable<HttpResponse<Object>> {
    return this.http.get(`${this.resourceUrl}/count/${versionNumber}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAcquisition[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAcquisitionIdentifier(acquisition: Pick<IAcquisition, 'id'>): number {
    return acquisition.id;
  }

  compareAcquisition(o1: Pick<IAcquisition, 'id'> | null, o2: Pick<IAcquisition, 'id'> | null): boolean {
    return o1 && o2 ? this.getAcquisitionIdentifier(o1) === this.getAcquisitionIdentifier(o2) : o1 === o2;
  }

  addAcquisitionToCollectionIfMissing<Type extends Pick<IAcquisition, 'id'>>(
    acquisitionCollection: Type[],
    ...acquisitionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const acquisitions: Type[] = acquisitionsToCheck.filter(isPresent);
    if (acquisitions.length > 0) {
      const acquisitionCollectionIdentifiers = acquisitionCollection.map(
        acquisitionItem => this.getAcquisitionIdentifier(acquisitionItem)!
      );
      const acquisitionsToAdd = acquisitions.filter(acquisitionItem => {
        const acquisitionIdentifier = this.getAcquisitionIdentifier(acquisitionItem);
        if (acquisitionCollectionIdentifiers.includes(acquisitionIdentifier)) {
          return false;
        }
        acquisitionCollectionIdentifiers.push(acquisitionIdentifier);
        return true;
      });
      return [...acquisitionsToAdd, ...acquisitionCollection];
    }
    return acquisitionCollection;
  }

  protected convertDateFromClient<T extends IAcquisition | NewAcquisition | PartialUpdateAcquisition>(acquisition: T): RestOf<T> {
    return {
      ...acquisition,
      acquisitionDate: acquisition.acquisitionDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAcquisition: RestAcquisition): IAcquisition {
    return {
      ...restAcquisition,
      acquisitionDate: restAcquisition.acquisitionDate ? dayjs(restAcquisition.acquisitionDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAcquisition>): HttpResponse<IAcquisition> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAcquisition[]>): HttpResponse<IAcquisition[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
