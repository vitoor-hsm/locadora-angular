import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { IconeComponent } from '../../components/icone/icone';
import { MenuLateral } from '../../components/menu-lateral/menu-lateral';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconeComponent, MenuLateral],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
  
export class LoginComponent{
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value);
    } else {
      alert('Por favor, preencha todos os campos corretamente.')
    }
  }

  alternarContraste() {
    document.body.classList.toggle('high-contrast');
  }

  }
  

