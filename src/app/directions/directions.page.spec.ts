import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsPage } from './directions.page';

describe('DirectionsPage', () => {
  let component: DirectionsPage;
  let fixture: ComponentFixture<DirectionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
