import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DiagnosticComponent } from './list/diagnostic.component';
import { DiagnosticDetailComponent } from './detail/diagnostic-detail.component';
import { DiagnosticUpdateComponent } from './update/diagnostic-update.component';
import { DiagnosticDeleteDialogComponent } from './delete/diagnostic-delete-dialog.component';
import { DiagnosticRoutingModule } from './route/diagnostic-routing.module';

@NgModule({
  imports: [SharedModule, DiagnosticRoutingModule],
  declarations: [DiagnosticComponent, DiagnosticDetailComponent, DiagnosticUpdateComponent, DiagnosticDeleteDialogComponent],
})
export class DiagnosticModule {}
