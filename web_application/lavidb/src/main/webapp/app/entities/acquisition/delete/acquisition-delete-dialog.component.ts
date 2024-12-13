import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAcquisition } from '../acquisition.model';
import { AcquisitionService } from '../service/acquisition.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './acquisition-delete-dialog.component.html',
})
export class AcquisitionDeleteDialogComponent {
  acquisition?: IAcquisition;

  constructor(protected acquisitionService: AcquisitionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.acquisitionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
