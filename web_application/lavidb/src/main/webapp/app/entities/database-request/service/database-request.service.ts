import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { Pipe, PipeTransform } from '@angular/core';
import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDatabaseRequest, NewDatabaseRequest } from '../database-request.model';

export type PartialUpdateDatabaseRequest = Partial<IDatabaseRequest> & Pick<IDatabaseRequest, 'id'>;

type RestOf<T extends IDatabaseRequest | NewDatabaseRequest> = Omit<T, 'createdDate' | 'expiresAt'> & {
  createdDate?: string | null;
  expiresAt?: string | null;
};

export type RestDatabaseRequest = RestOf<IDatabaseRequest>;

export type NewRestDatabaseRequest = RestOf<NewDatabaseRequest>;

export type PartialUpdateRestDatabaseRequest = RestOf<PartialUpdateDatabaseRequest>;

export type EntityResponseType = HttpResponse<IDatabaseRequest>;
export type EntityArrayResponseType = HttpResponse<IDatabaseRequest[]>;

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let newVal = value.sort((a: any, b: any) => {
      let date1 = new Date(a.date);
      let date2 = new Date(b.date);

      if (date1 > date2) {
        return 1;
      } else if (date1 < date2) {
        return -1;
      } else {
        return 0;
      }
    });

    return newVal;
  }
}

@Injectable({ providedIn: 'root' })
export class DatabaseRequestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/database-requests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(databaseRequest: NewDatabaseRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(databaseRequest);
    console.log(copy);
    return this.http
      .post<RestDatabaseRequest>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(databaseRequest: IDatabaseRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(databaseRequest);
    return this.http
      .put<RestDatabaseRequest>(`${this.resourceUrl}/${this.getDatabaseRequestIdentifier(databaseRequest)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(databaseRequest: PartialUpdateDatabaseRequest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(databaseRequest);
    return this.http
      .patch<RestDatabaseRequest>(`${this.resourceUrl}/${this.getDatabaseRequestIdentifier(databaseRequest)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDatabaseRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDatabaseRequest[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDatabaseRequestIdentifier(databaseRequest: Pick<IDatabaseRequest, 'id'>): number {
    return databaseRequest.id;
  }

  compareDatabaseRequest(o1: Pick<IDatabaseRequest, 'id'> | null, o2: Pick<IDatabaseRequest, 'id'> | null): boolean {
    return o1 && o2 ? this.getDatabaseRequestIdentifier(o1) === this.getDatabaseRequestIdentifier(o2) : o1 === o2;
  }

  addDatabaseRequestToCollectionIfMissing<Type extends Pick<IDatabaseRequest, 'id'>>(
    databaseRequestCollection: Type[],
    ...databaseRequestsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const databaseRequests: Type[] = databaseRequestsToCheck.filter(isPresent);
    if (databaseRequests.length > 0) {
      const databaseRequestCollectionIdentifiers = databaseRequestCollection.map(
        databaseRequestItem => this.getDatabaseRequestIdentifier(databaseRequestItem)!
      );
      const databaseRequestsToAdd = databaseRequests.filter(databaseRequestItem => {
        const databaseRequestIdentifier = this.getDatabaseRequestIdentifier(databaseRequestItem);
        if (databaseRequestCollectionIdentifiers.includes(databaseRequestIdentifier)) {
          return false;
        }
        databaseRequestCollectionIdentifiers.push(databaseRequestIdentifier);
        return true;
      });
      return [...databaseRequestsToAdd, ...databaseRequestCollection];
    }
    return databaseRequestCollection;
  }

  protected convertDateFromClient<T extends IDatabaseRequest | NewDatabaseRequest | PartialUpdateDatabaseRequest>(
    databaseRequest: T
  ): RestOf<T> {
    return {
      ...databaseRequest,
      createdDate: databaseRequest.createdDate?.toJSON() ?? null,
      expiresAt: databaseRequest.expiresAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDatabaseRequest: RestDatabaseRequest): IDatabaseRequest {
    return {
      ...restDatabaseRequest,
      createdDate: restDatabaseRequest.createdDate ? dayjs(restDatabaseRequest.createdDate) : undefined,
      expiresAt: restDatabaseRequest.expiresAt ? dayjs(restDatabaseRequest.expiresAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDatabaseRequest>): HttpResponse<IDatabaseRequest> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDatabaseRequest[]>): HttpResponse<IDatabaseRequest[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
