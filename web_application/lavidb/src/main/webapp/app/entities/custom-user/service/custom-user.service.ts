import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomUser, NewCustomUser } from '../custom-user.model';

export type PartialUpdateCustomUser = Partial<ICustomUser> & Pick<ICustomUser, 'id'>;

export type EntityResponseType = HttpResponse<ICustomUser>;
export type EntityArrayResponseType = HttpResponse<ICustomUser[]>;

@Injectable({ providedIn: 'root' })
export class CustomUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/custom-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customUser: NewCustomUser): Observable<EntityResponseType> {
    return this.http.post<ICustomUser>(this.resourceUrl, customUser, { observe: 'response' });
  }

  update(customUser: ICustomUser): Observable<EntityResponseType> {
    return this.http.put<ICustomUser>(`${this.resourceUrl}/${this.getCustomUserIdentifier(customUser)}`, customUser, {
      observe: 'response',
    });
  }

  partialUpdate(customUser: PartialUpdateCustomUser): Observable<EntityResponseType> {
    return this.http.patch<ICustomUser>(`${this.resourceUrl}/${this.getCustomUserIdentifier(customUser)}`, customUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCustomUserIdentifier(customUser: Pick<ICustomUser, 'id'>): number {
    return customUser.id;
  }

  compareCustomUser(o1: Pick<ICustomUser, 'id'> | null, o2: Pick<ICustomUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getCustomUserIdentifier(o1) === this.getCustomUserIdentifier(o2) : o1 === o2;
  }

  addCustomUserToCollectionIfMissing<Type extends Pick<ICustomUser, 'id'>>(
    customUserCollection: Type[],
    ...customUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const customUsers: Type[] = customUsersToCheck.filter(isPresent);
    if (customUsers.length > 0) {
      const customUserCollectionIdentifiers = customUserCollection.map(customUserItem => this.getCustomUserIdentifier(customUserItem)!);
      const customUsersToAdd = customUsers.filter(customUserItem => {
        const customUserIdentifier = this.getCustomUserIdentifier(customUserItem);
        if (customUserCollectionIdentifiers.includes(customUserIdentifier)) {
          return false;
        }
        customUserCollectionIdentifiers.push(customUserIdentifier);
        return true;
      });
      return [...customUsersToAdd, ...customUserCollection];
    }
    return customUserCollection;
  }
}
