import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { RouterModule } from '@angular/router';
import { IconeComponent } from '../../../components/icone/icone';
import { ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal';
import { UsuarioService } from '../../../services/usuario';

@Component({
  selector: 'app-usuarios-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuLateral, RouterModule, IconeComponent],
  templateUrl: './usuarios-lista.html',
  styleUrl: './usuarios-lista.css',
})
export class UsuariosListaComponent implements OnInit {
  userList: any[] = [];
  searchTerm: string = '';
  expandedUserId: number | null = null;
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;

  constructor(
    private toastService: ToastService,
    private modalService: ModalService,
    private userService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 0) {
    this.userService.listAll(page, this.pageSize).subscribe({
      next: (data: any) => {
        console.log('Chegou no Angular:', data.content);
        //Since Java uses Pageable, the data is in data.content.
        this.userList = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.toastService.exibir('Erro ao carregar usuários', 'erro');
      }
    });
  }
  changePage(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.loadUsers(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  get filteredUsers() {
    if (!this.searchTerm.trim()) {
      return this.userList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.userList.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  deleteUser(id: number) {
    const user = this.userList.find(u => u.id === id);

    this.modalService.abrir({
      titulo: 'Confirmar Exclusão',
      mensagem: `Deseja realmente remover o usuário ${user?.name}?`,
      confirmar: () => {
        this.userService.delete(id).subscribe({
          next: () => {
            this.toastService.exibir('Usuário removido com sucesso!', 'sucesso');
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            this.toastService.exibir('Erro ao excluir usuário', 'erro');
          }
        });
      }
    });
  }

  toggleExpansion(id: number) {
    this.expandedUserId = this.expandedUserId === id ? null : id;
  }
}