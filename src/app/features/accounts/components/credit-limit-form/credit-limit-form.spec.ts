import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLimitForm } from './credit-limit-form';

describe('CreditLimitForm', () => {
  let component: CreditLimitForm;
  let fixture: ComponentFixture<CreditLimitForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditLimitForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditLimitForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
