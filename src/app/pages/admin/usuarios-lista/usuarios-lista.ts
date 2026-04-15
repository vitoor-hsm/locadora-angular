import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { RouterModule } from '@angular/router';
import { IconeComponent } from '../../../components/icone/icone';
import { ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal'; 

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuLateral, RouterModule, IconeComponent], 
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.css',
})
export class UsuariosListaComponent implements OnInit {
  listaUsuarios: any[] = [];
  termoBusca: string = '';
  usuarioExpandidoId: number | null = null;

  constructor(
    private toastService: ToastService,
    private modalService: ModalService 
  ) { }

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    const dados = localStorage.getItem('usuarios');
    if (dados) {
      this.listaUsuarios = JSON.parse(dados);
    } else {
      this.listaUsuarios = [
        { id: 1, nome: 'Admin Sistema', email: 'admin@teste.com', perfil: 'ADM', dataCadastro: '2024-01-01' },
        { id: 2, nome: 'Cris Rocha', email: 'cris@user.com', perfil: 'USER', dataCadastro: '2024-02-15' },
        { id: 3, nome: 'Carol Brito', email: 'carol.brito@gmail.com', perfil: 'USER', dataCadastro: '2024-03-10', telefone: '(21) 77777-7777'},
        { id: 4, nome: 'Victor Farias', email: 'victor.dev@outlook.com', perfil: 'ADM', dataCadastro: '2024-03-20', telefone: '(31) 88888-8888' },
        { id: 5, nome: 'Ana Costa', email: 'ana.costa@empresa.com.br', perfil: 'USER', dataCadastro: '2024-04-01', telefone: '(41) 55555-5555' }
      ];
      localStorage.setItem('usuarios', JSON.stringify(this.listaUsuarios));
    }
  }

  get usuariosFiltrados() {
    if (!this.termoBusca.trim()) {
      return this.listaUsuarios;
    }
    const termo = this.termoBusca.toLowerCase();
    return this.listaUsuarios.filter(u =>
      u.nome.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo)
    );
  }

  // AGORA USANDO O MODAL NOVO:
  excluir(id: number) {
    const usuario = this.listaUsuarios.find(u => u.id === id);

    this.modalService.abrir({
      titulo: 'Confirmar Exclusão',
      mensagem: `Deseja realmente remover o usuário ${usuario?.nome}?`,
      confirmar: () => {
        this.listaUsuarios = this.listaUsuarios.filter(u => u.id !== id);
        localStorage.setItem('usuarios', JSON.stringify(this.listaUsuarios));
        this.toastService.exibir('Usuário removido com sucesso!', 'sucesso');
      }
    });
  }

  alternarExpansao(id: number) {
    this.usuarioExpandidoId = this.usuarioExpandidoId === id ? null : id;
  }
}