import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesFilme } from './detalhes-filme';

describe('DetalhesFilme', () => {
  let component: DetalhesFilme;
  let fixture: ComponentFixture<DetalhesFilme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesFilme],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesFilme);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
