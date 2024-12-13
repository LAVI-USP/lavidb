import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseVersionService } from 'app/entities/database-version/service/database-version.service';
import { NewDatabaseVersion } from 'app/entities/database-version/database-version.model';

@Component({
  templateUrl: './acquisition-create-dialog.component.html',
})
export class AcquisitionCreateDialogComponent {
  constructor(protected databaseVersionService: DatabaseVersionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmCreate(): void {
    const databaseVersion = <NewDatabaseVersion>{};
    databaseVersion.versionNumber = 0;
    this.databaseVersionService.create(databaseVersion).subscribe(() => {
      this.activeModal.close();
    });
  }
}
