import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiagnostic } from '../diagnostic.model';
import { DiagnosticService } from '../service/diagnostic.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './diagnostic-delete-dialog.component.html',
})
export class DiagnosticDeleteDialogComponent {
  diagnostic?: IDiagnostic;

  constructor(protected diagnosticService: DiagnosticService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.diagnosticService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
