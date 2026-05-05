import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFilme } from './modal-filme';

describe('ModalFilme', () => {
  let component: ModalFilme;
  let fixture: ComponentFixture<ModalFilme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFilme],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFilme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
