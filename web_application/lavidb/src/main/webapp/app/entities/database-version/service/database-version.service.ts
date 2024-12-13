import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDatabaseVersion, NewDatabaseVersion } from '../database-version.model';

export type PartialUpdateDatabaseVersion = Partial<IDatabaseVersion> & Pick<IDatabaseVersion, 'id'>;

type RestOf<T extends IDatabaseVersion | NewDatabaseVersion> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestDatabaseVersion = RestOf<IDatabaseVersion>;

export type NewRestDatabaseVersion = RestOf<NewDatabaseVersion>;

export type PartialUpdateRestDatabaseVersion = RestOf<PartialUpdateDatabaseVersion>;

export type EntityResponseType = HttpResponse<IDatabaseVersion>;
export type EntityArrayResponseType = HttpResponse<IDatabaseVersion[]>;

@Injectable({ providedIn: 'root' })
export class DatabaseVersionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/database-versions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(databaseVersion: NewDatabaseVersion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(databaseVersion);
    return this.http
      .post<RestDatabaseVersion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(databaseVersion: IDatabaseVersion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(databaseVersion);
    return this.http
      .put<RestDatabaseVersion>(`${this.resourceUrl}/${this.getDatabaseVersionIdentifier(databaseVersion)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(databaseVersion: PartialUpdateDatabaseVersion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(databaseVersion);
    return this.http
      .patch<RestDatabaseVersion>(`${this.resourceUrl}/${this.getDatabaseVersionIdentifier(databaseVersion)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDatabaseVersion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDatabaseVersion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDatabaseVersionIdentifier(databaseVersion: Pick<IDatabaseVersion, 'id'>): number {
    return databaseVersion.id;
  }

  compareDatabaseVersion(o1: Pick<IDatabaseVersion, 'id'> | null, o2: Pick<IDatabaseVersion, 'id'> | null): boolean {
    return o1 && o2 ? this.getDatabaseVersionIdentifier(o1) === this.getDatabaseVersionIdentifier(o2) : o1 === o2;
  }

  addDatabaseVersionToCollectionIfMissing<Type extends Pick<IDatabaseVersion, 'id'>>(
    databaseVersionCollection: Type[],
    ...databaseVersionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const databaseVersions: Type[] = databaseVersionsToCheck.filter(isPresent);
    if (databaseVersions.length > 0) {
      const databaseVersionCollectionIdentifiers = databaseVersionCollection.map(
        databaseVersionItem => this.getDatabaseVersionIdentifier(databaseVersionItem)!
      );
      const databaseVersionsToAdd = databaseVersions.filter(databaseVersionItem => {
        const databaseVersionIdentifier = this.getDatabaseVersionIdentifier(databaseVersionItem);
        if (databaseVersionCollectionIdentifiers.includes(databaseVersionIdentifier)) {
          return false;
        }
        databaseVersionCollectionIdentifiers.push(databaseVersionIdentifier);
        return true;
      });
      return [...databaseVersionsToAdd, ...databaseVersionCollection];
    }
    return databaseVersionCollection;
  }

  protected convertDateFromClient<T extends IDatabaseVersion | NewDatabaseVersion | PartialUpdateDatabaseVersion>(
    databaseVersion: T
  ): RestOf<T> {
    return {
      ...databaseVersion,
      createdDate: databaseVersion.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDatabaseVersion: RestDatabaseVersion): IDatabaseVersion {
    return {
      ...restDatabaseVersion,
      createdDate: restDatabaseVersion.createdDate ? dayjs(restDatabaseVersion.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDatabaseVersion>): HttpResponse<IDatabaseVersion> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDatabaseVersion[]>): HttpResponse<IDatabaseVersion[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
