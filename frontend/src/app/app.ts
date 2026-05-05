import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './core/components/toast/toast';
import { ModalComponent } from './components/modal/modal';
import { UsuarioService } from './services/usuario';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('locadora-teste');

  constructor(private usuarioService: UsuarioService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Checks if a user is already logged in and applies the theme.
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.authService.applyTheme(user.highContrast);
    }

  }
}

