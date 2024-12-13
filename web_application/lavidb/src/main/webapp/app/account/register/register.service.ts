import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);
  }

  uploadLicense(file: File, login: string): Observable<{}> {
    const formData = new FormData();
    formData.append('licenseFile', file);
    return this.http.put(`${this.applicationConfigService.getEndpointFor('api/register/upload')}/${login}`, formData);
  }
}
