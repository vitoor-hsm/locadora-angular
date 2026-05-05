import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { IconeComponent } from '../../components/icone/icone';
import { MenuLateral } from '../../components/menu-lateral/menu-lateral';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast';

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
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  onSubmit() {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: (user: any) => {
        this.authService.processloginsuccessful(user); 
        this.toastService.exibir(`Bem-vindo, ${user.name}!`, 'sucesso');
      },
      error: (err) => {
        const msg = err.error || 'Login ou senha incorretos.';
        this.toastService.exibir(msg, 'erro');
      }
    });
  } else {
    this.toastService.exibir('Preencha os campos corretamente.', 'erro');
  }
}

  alternarContraste() {
    document.body.classList.toggle('high-contrast');
  }

  }
  

