import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAcquisition } from '../acquisition.model';

@Component({
  selector: 'jhi-acquisition-detail',
  templateUrl: './acquisition-detail.component.html',
})
export class AcquisitionDetailComponent implements OnInit {
  acquisition: IAcquisition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ acquisition }) => {
      this.acquisition = acquisition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
