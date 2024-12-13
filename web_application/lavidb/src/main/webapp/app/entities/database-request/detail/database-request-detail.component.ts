import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDatabaseRequest } from '../database-request.model';

@Component({
  selector: 'jhi-database-request-detail',
  templateUrl: './database-request-detail.component.html',
})
export class DatabaseRequestDetailComponent implements OnInit {
  databaseRequest: IDatabaseRequest | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ databaseRequest }) => {
      this.databaseRequest = databaseRequest;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
