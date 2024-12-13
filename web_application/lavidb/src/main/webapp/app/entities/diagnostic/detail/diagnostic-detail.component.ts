import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiagnostic } from '../diagnostic.model';

@Component({
  selector: 'jhi-diagnostic-detail',
  templateUrl: './diagnostic-detail.component.html',
})
export class DiagnosticDetailComponent implements OnInit {
  diagnostic: IDiagnostic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diagnostic }) => {
      this.diagnostic = diagnostic;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
