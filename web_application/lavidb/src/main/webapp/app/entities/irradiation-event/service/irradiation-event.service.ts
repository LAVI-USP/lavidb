import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIrradiationEvent, NewIrradiationEvent } from '../irradiation-event.model';

export type PartialUpdateIrradiationEvent = Partial<IIrradiationEvent> & Pick<IIrradiationEvent, 'id'>;

export type EntityResponseType = HttpResponse<IIrradiationEvent>;
export type EntityArrayResponseType = HttpResponse<IIrradiationEvent[]>;

@Injectable({ providedIn: 'root' })
export class IrradiationEventService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/irradiation-events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(irradiationEvent: NewIrradiationEvent): Observable<EntityResponseType> {
    return this.http.post<IIrradiationEvent>(this.resourceUrl, irradiationEvent, { observe: 'response' });
  }

  update(irradiationEvent: IIrradiationEvent): Observable<EntityResponseType> {
    return this.http.put<IIrradiationEvent>(
      `${this.resourceUrl}/${this.getIrradiationEventIdentifier(irradiationEvent)}`,
      irradiationEvent,
      { observe: 'response' }
    );
  }

  partialUpdate(irradiationEvent: PartialUpdateIrradiationEvent): Observable<EntityResponseType> {
    return this.http.patch<IIrradiationEvent>(
      `${this.resourceUrl}/${this.getIrradiationEventIdentifier(irradiationEvent)}`,
      irradiationEvent,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIrradiationEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIrradiationEvent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIrradiationEventIdentifier(irradiationEvent: Pick<IIrradiationEvent, 'id'>): number {
    return irradiationEvent.id;
  }

  compareIrradiationEvent(o1: Pick<IIrradiationEvent, 'id'> | null, o2: Pick<IIrradiationEvent, 'id'> | null): boolean {
    return o1 && o2 ? this.getIrradiationEventIdentifier(o1) === this.getIrradiationEventIdentifier(o2) : o1 === o2;
  }

  addIrradiationEventToCollectionIfMissing<Type extends Pick<IIrradiationEvent, 'id'>>(
    irradiationEventCollection: Type[],
    ...irradiationEventsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const irradiationEvents: Type[] = irradiationEventsToCheck.filter(isPresent);
    if (irradiationEvents.length > 0) {
      const irradiationEventCollectionIdentifiers = irradiationEventCollection.map(
        irradiationEventItem => this.getIrradiationEventIdentifier(irradiationEventItem)!
      );
      const irradiationEventsToAdd = irradiationEvents.filter(irradiationEventItem => {
        const irradiationEventIdentifier = this.getIrradiationEventIdentifier(irradiationEventItem);
        if (irradiationEventCollectionIdentifiers.includes(irradiationEventIdentifier)) {
          return false;
        }
        irradiationEventCollectionIdentifiers.push(irradiationEventIdentifier);
        return true;
      });
      return [...irradiationEventsToAdd, ...irradiationEventCollection];
    }
    return irradiationEventCollection;
  }
}
