import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbRequestDialogComponent } from './db-request-dialog.component';

describe('DbRequestDialogComponent', () => {
  let component: DbRequestDialogComponent;
  let fixture: ComponentFixture<DbRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DbRequestDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DbRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
