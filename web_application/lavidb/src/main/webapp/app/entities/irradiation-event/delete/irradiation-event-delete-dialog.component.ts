import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIrradiationEvent } from '../irradiation-event.model';
import { IrradiationEventService } from '../service/irradiation-event.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './irradiation-event-delete-dialog.component.html',
})
export class IrradiationEventDeleteDialogComponent {
  irradiationEvent?: IIrradiationEvent;

  constructor(protected irradiationEventService: IrradiationEventService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.irradiationEventService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
