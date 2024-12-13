import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAcquisition } from '../acquisition.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, AcquisitionService } from '../service/acquisition.service';
import { AcquisitionDeleteDialogComponent } from '../delete/acquisition-delete-dialog.component';
import { AcquisitionCreateDialogComponent } from '../create/acquisition-create-dialog.component';
import { DbRequestDialogComponent } from '../db-request-dialog/db-request-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { Options } from '@angular-slider/ngx-slider';
import { NewDatabaseRequest, IDatabaseRequest } from '../../database-request/database-request.model';
import { DatabaseRequestService } from 'app/entities/database-request/service/database-request.service';
import { DatabaseVersionService } from 'app/entities/database-version/service/database-version.service';
import { IDatabaseVersion } from 'app/entities/database-version/database-version.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'jhi-acquisition',
  templateUrl: './acquisition.component.html',
})
export class AcquisitionComponent implements OnInit {
  acquisitions?: IAcquisition[];

  lastUpdate: any;
  versions: any;
  versionSelected = 1;
  hasLesion = 0;
  hasDose = 0;
  nrDose = 1;
  nrContrast = 1;
  isLoading = true;
  totalAcquisitions = 0;
  totalPatients = 0;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
  page = 1;

  minLesionValue: number = 4;
  maxLesionValue: number = 6;
  lesionsOptions: Options = {
    //showTicksValues: true,
    floor: 4,
    ceil: 8,
  };

  contrastStepsArray = [
    { value: 6, legend: 'Low' },
    { value: 10, legend: 'Medium' },
    { value: 16, legend: 'High' },
  ];
  contrast1Value = 10;
  contrast2Value = 10;
  contrast3Value = 10;
  contrastOptions: Options = {
    stepsArray: this.contrastStepsArray,
    showTicksValues: true,
  };

  doseReduced1Value: number = 50;
  doseReduced2Value: number = 50;
  doseReduced3Value: number = 50;
  doseOptions: Options = {
    //showTicksValues: true,
    floor: 5,
    ceil: 95,
    step: 5,
  };

  constructor(
    protected acquisitionService: AcquisitionService,
    protected databaseRequestService: DatabaseRequestService,
    protected databaseVersionService: DatabaseVersionService,
    protected activatedRoute: ActivatedRoute,
    protected patientService: PatientService,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected modalService: NgbModal,
    private chRef: ChangeDetectorRef
  ) {}

  loadTotalAcquisitions(versionNumber: Number): void {
    this.acquisitionService.count(versionNumber).subscribe({
      next: res => (this.totalAcquisitions = Number(res.body)),
      error: res => console.log(res),
    });
  }

  loadTotalPatients(versionNumber: Number): void {
    this.patientService.count(versionNumber).subscribe({
      next: res => (this.totalPatients = Number(res.body)),
      error: res => console.log(res),
    });
  }

  loadVersions(): void {
    this.databaseVersionService.query().subscribe({
      next: res => (this.versions = res.body),
      error: res => console.log(res),
    });
  }

  reset(): void {
    this.page = 1;
    this.acquisitions = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IAcquisition): number => this.acquisitionService.getAcquisitionIdentifier(item);

  ngOnInit(): void {
    this.loadVersions();
    this.load();
  }

  dateFormat(dateDayJs: any): string {
    return dateDayJs.format('DD/MM/YYYY');
  }

  createNewVersion(): void {
    const modalRef = this.modalService.open(AcquisitionCreateDialogComponent, { size: 'lg', backdrop: 'static' });
    //modalRef.componentInstance.acquisition = acquisition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.pipe(switchMap(() => this.loadFromBackendWithRouteInformations())).subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  requestDB(): void {
    let nrImages;
    let parameters;
    let doseList = [];
    let contrastList = [];
    let doseFactor = 0;
    let contrastFactor = 1;
    if (this.hasDose == 1) {
      if (this.nrDose == 1) {
        doseList.push({ doseReduced: this.doseReduced1Value });
        doseFactor = 1;
      } else if (this.nrDose == 2) {
        doseList.push({ doseReduced: this.doseReduced1Value });
        doseList.push({ doseReduced: this.doseReduced2Value });
        doseFactor = 2;
      } else {
        doseList.push({ doseReduced: this.doseReduced1Value });
        doseList.push({ doseReduced: this.doseReduced2Value });
        doseList.push({ doseReduced: this.doseReduced3Value });
        doseFactor = 3;
      }
    } else {
      doseList = [];
    }
    if (this.nrContrast == 1) {
      contrastList.push({ contrast: this.contrast1Value });
      contrastFactor = 1;
    } else if (this.nrContrast == 2) {
      contrastList.push({ contrast: this.contrast1Value });
      contrastList.push({ contrast: this.contrast2Value });
      contrastFactor = 2;
    } else {
      contrastList.push({ contrast: this.contrast1Value });
      contrastList.push({ contrast: this.contrast2Value });
      contrastList.push({ contrast: this.contrast3Value });
      contrastFactor = 3;
    }
    if (this.hasLesion == 1) {
      parameters = {
        hasLesion: this.hasLesion,
        minLesion: this.minLesionValue,
        maxLesion: this.maxLesionValue,
        hasDose: this.hasDose,
        contrastList: contrastList,
        doseList: doseList,
      };
    } else {
      parameters = {
        hasLesion: this.hasLesion,
        hasDose: this.hasDose,
        doseList: doseList,
      };
    }
    var databaseRequest = <NewDatabaseRequest>{};
    var databaseVersion = <IDatabaseVersion>{};
    databaseRequest.parameters = JSON.stringify(parameters);
    const dbId = this.versions.filter((v: any) => v.versionNumber == this.versionSelected).map((v: any) => v.id);
    databaseVersion.id = dbId[0];
    databaseRequest.databaseVersion = databaseVersion;
    console.log(databaseRequest);

    //Total images equation
    nrImages = this.totalAcquisitions;
    if (this.hasLesion == 1) {
      if (this.hasDose == 1) {
        nrImages = this.totalAcquisitions + this.totalAcquisitions * doseFactor;
        //full dose
        nrImages = nrImages + this.totalAcquisitions * contrastFactor;
        //reduc dose
        nrImages = nrImages + this.totalAcquisitions * contrastFactor * doseFactor;
      } else {
        nrImages = this.totalAcquisitions + this.totalAcquisitions * contrastFactor;
      }
    } else {
      if (this.hasDose == 1) {
        nrImages = this.totalAcquisitions + this.totalAcquisitions * doseFactor;
      }
    }

    const modalRef = this.modalService.open(DbRequestDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.nrImages = nrImages;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe({
      next: (res: EntityArrayResponseType) => {
        //this.onResponseSuccess(res);
        if (res) {
          //console.log("OBBAAAAAAAAA");
          this.databaseRequestService.create(databaseRequest).subscribe({
            next: res => console.log(res),
            error: res => console.log(res),
          });
          this.router.navigate(['/database-request']);
        }
      },
    });
  }

  load(): void {
    //     this.loadVersions();
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
    this.loadTotalAcquisitions(this.versionSelected);
    this.loadTotalPatients(this.versionSelected);
  }

  checkLesion(e: any): void {
    this.hasLesion = e.target.value;
    console.log(this.hasLesion);
  }

  checkDose(e: any): void {
    this.hasDose = e.target.value;
    console.log(this.hasDose);
  }

  checkNrDose(e: any): void {
    this.nrDose = e.target.value;
    console.log(this.nrDose);
    this.chRef.detectChanges();
  }

  checkNrContrast(e: any): void {
    this.nrContrast = e.target.value;
    console.log(this.nrContrast);
    this.chRef.detectChanges();
  }

  changeVersion(e: any): void {
    this.versionSelected = e.target.value;
    console.log(this.versionSelected);
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
    this.loadTotalAcquisitions(this.versionSelected);
    this.loadTotalPatients(this.versionSelected);
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    //console.log(dataFromBody);
    const acquisitionsFiltered = dataFromBody.filter(d => d.databaseVersion?.versionNumber!! <= this.versionSelected);
    //console.log(acquisitionsFiltered);

    //console.log(this.versions);
    const mapDate = this.versions.map((v: any) => v.createdDate);
    const maxDate = new Date(mapDate.reduce((a: any, b: any) => Math.max(a, b), -Infinity));
    this.lastUpdate = maxDate.getDate() + '/' + Number(maxDate.getMonth() + 1) + '/' + maxDate.getFullYear();
    console.log(this.lastUpdate);
    this.acquisitions = acquisitionsFiltered;
  }

  protected fillComponentAttributesFromResponseBody(data: IAcquisition[] | null): IAcquisition[] {
    const acquisitionsNew = this.acquisitions ?? [];
    if (data) {
      for (const d of data) {
        if (acquisitionsNew.map(op => op.id).indexOf(d.id) === -1) {
          acquisitionsNew.push(d);
        }
      }
    }
    return acquisitionsNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    return this.acquisitionService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
