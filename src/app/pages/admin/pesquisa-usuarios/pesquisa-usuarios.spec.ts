import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisaUsuarios } from './pesquisa-usuarios';

describe('PesquisaUsuarios', () => {
  let component: PesquisaUsuarios;
  let fixture: ComponentFixture<PesquisaUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisaUsuarios],
    }).compileComponents();

    fixture = TestBed.createComponent(PesquisaUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
