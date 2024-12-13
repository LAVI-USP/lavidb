import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDatabaseVersion } from '../database-version.model';

@Component({
  selector: 'jhi-database-version-detail',
  templateUrl: './database-version-detail.component.html',
})
export class DatabaseVersionDetailComponent implements OnInit {
  databaseVersion: IDatabaseVersion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ databaseVersion }) => {
      this.databaseVersion = databaseVersion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
