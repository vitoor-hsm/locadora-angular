import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmeForm } from './filme-form';

describe('FilmeForm', () => {
  let component: FilmeForm;
  let fixture: ComponentFixture<FilmeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmeForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
