/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MailLogListComponent } from './mail-log-list.component';

describe('MailLogListComponent', () => {
  let component: MailLogListComponent;
  let fixture: ComponentFixture<MailLogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailLogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
