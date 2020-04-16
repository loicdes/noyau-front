import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramideComponent } from './pyramide.component';

describe('PyramideComponent', () => {
  let component: PyramideComponent;
  let fixture: ComponentFixture<PyramideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
