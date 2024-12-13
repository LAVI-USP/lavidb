import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDatabaseVersion } from '../database-version.model';
import { DatabaseVersionService } from '../service/database-version.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './database-version-delete-dialog.component.html',
})
export class DatabaseVersionDeleteDialogComponent {
  databaseVersion?: IDatabaseVersion;

  constructor(protected databaseVersionService: DatabaseVersionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.databaseVersionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
