import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth'; // Nome corrigido
import { RouterModule } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])] // Adicionado para não dar erro de Router
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});