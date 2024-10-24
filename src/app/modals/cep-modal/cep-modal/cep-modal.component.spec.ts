import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepModalComponent } from './cep-modal.component';

describe('CepModalComponent', () => {
  let component: CepModalComponent;
  let fixture: ComponentFixture<CepModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CepModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
