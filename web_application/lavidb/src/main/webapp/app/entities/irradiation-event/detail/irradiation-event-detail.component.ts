import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIrradiationEvent } from '../irradiation-event.model';

@Component({
  selector: 'jhi-irradiation-event-detail',
  templateUrl: './irradiation-event-detail.component.html',
})
export class IrradiationEventDetailComponent implements OnInit {
  irradiationEvent: IIrradiationEvent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ irradiationEvent }) => {
      this.irradiationEvent = irradiationEvent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
