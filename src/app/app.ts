import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './core/components/toast/toast';
import { ModalComponent } from './components/modal/modal';
import { UsuarioService } from './services/usuario';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('locadora-teste');

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarioService.listarTodos().subscribe({
      next: (dados) => {
        console.log('--- Conexão com backend estabelecida ---');
        console.log('Dados recebidos do Java:', dados);
      },
      error: (err) => {
        console.error('Erro ao conectar com o backend:', err);
      }
    });
  }
}
