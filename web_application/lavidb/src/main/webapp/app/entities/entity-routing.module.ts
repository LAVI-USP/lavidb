import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'database-request',
        data: { pageTitle: 'lavidbApp.databaseRequest.home.title' },
        loadChildren: () => import('./database-request/database-request.module').then(m => m.DatabaseRequestModule),
      },
      {
        path: 'country',
        data: { pageTitle: 'lavidbApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'custom-user',
        data: { pageTitle: 'lavidbApp.customUser.home.title' },
        loadChildren: () => import('./custom-user/custom-user.module').then(m => m.CustomUserModule),
      },
      {
        path: 'institution',
        data: { pageTitle: 'lavidbApp.institution.home.title' },
        loadChildren: () => import('./institution/institution.module').then(m => m.InstitutionModule),
      },
      {
        path: 'diagnostic',
        data: { pageTitle: 'lavidbApp.diagnostic.home.title' },
        loadChildren: () => import('./diagnostic/diagnostic.module').then(m => m.DiagnosticModule),
      },
      {
        path: 'patient',
        data: { pageTitle: 'lavidbApp.patient.home.title' },
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'manufacturer',
        data: { pageTitle: 'lavidbApp.manufacturer.home.title' },
        loadChildren: () => import('./manufacturer/manufacturer.module').then(m => m.ManufacturerModule),
      },
      {
        path: 'irradiation-event',
        data: { pageTitle: 'lavidbApp.irradiationEvent.home.title' },
        loadChildren: () => import('./irradiation-event/irradiation-event.module').then(m => m.IrradiationEventModule),
      },
      {
        path: 'acquisition',
        data: { pageTitle: 'lavidbApp.acquisition.home.title' },
        loadChildren: () => import('./acquisition/acquisition.module').then(m => m.AcquisitionModule),
      },
      {
        path: 'database-version',
        data: { pageTitle: 'lavidbApp.databaseVersion.home.title' },
        loadChildren: () => import('./database-version/database-version.module').then(m => m.DatabaseVersionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
