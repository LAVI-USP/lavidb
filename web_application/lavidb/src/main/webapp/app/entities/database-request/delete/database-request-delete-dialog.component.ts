import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDatabaseRequest } from '../database-request.model';
import { DatabaseRequestService } from '../service/database-request.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './database-request-delete-dialog.component.html',
})
export class DatabaseRequestDeleteDialogComponent {
  databaseRequest?: IDatabaseRequest;

  constructor(protected databaseRequestService: DatabaseRequestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.databaseRequestService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
