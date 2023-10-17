import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiezasUploadComponent } from './piezas-upload.component';

describe('PiezasUploadComponent', () => {
  let component: PiezasUploadComponent;
  let fixture: ComponentFixture<PiezasUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiezasUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiezasUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
