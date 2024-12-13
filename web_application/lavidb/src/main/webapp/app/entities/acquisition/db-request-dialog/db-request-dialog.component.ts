import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseVersionService } from 'app/entities/database-version/service/database-version.service';
import { NewDatabaseVersion } from 'app/entities/database-version/database-version.model';

@Component({
  selector: 'jhi-db-request-dialog',
  templateUrl: './db-request-dialog.component.html',
  styleUrls: ['./db-request-dialog.component.scss'],
})
export class DbRequestDialogComponent {
  constructor(protected databaseVersionService: DatabaseVersionService, protected activeModal: NgbActiveModal) {}

  nrImages = 0;

  cancel(): void {
    this.activeModal.dismiss(false);
  }

  confirmCreate(): void {
    this.activeModal.close(true);
  }
}
