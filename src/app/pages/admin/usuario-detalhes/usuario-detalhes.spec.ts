import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioDetalhes } from './usuario-detalhes';

describe('UsuarioDetalhes', () => {
  let component: UsuarioDetalhes;
  let fixture: ComponentFixture<UsuarioDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioDetalhes],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioDetalhes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
