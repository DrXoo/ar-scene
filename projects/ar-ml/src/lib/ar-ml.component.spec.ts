import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArMlComponent } from './ar-ml.component';

describe('ArMlComponent', () => {
  let component: ArMlComponent;
  let fixture: ComponentFixture<ArMlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArMlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArMlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
