import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MenuLateral],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioFormComponent implements OnInit {
  usuario: any = { nome: '', email: '', perfil: 'USER', telefone: '', dataCadastro: '' };
  isEdicao: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');

    if (idStr && idStr !== 'novo') {
      this.isEdicao = true;
      this.carregarDadosDoUsuario(Number(idStr));
    } else {
      this.isEdicao = false;
      this.usuario.dataCadastro = new Date().toISOString().split('T')[0];
    }
  }

  carregarDadosDoUsuario(id: number) {
    const dados = localStorage.getItem('usuarios');
    if (dados) {
      const lista = JSON.parse(dados);
      const encontrado = lista.find((u: any) => u.id === id);
      
      // CORREÇÃO: Se encontrar, tem que passar para a variável da tela
      if (encontrado) {
        this.usuario = { ...encontrado };
      } else {
        alert('Usuário não encontrado!');
        this.router.navigate(['/admin/usuarios']);
      }
    }
  } // <--- Fecha a função carregarDadosDoUsuario

  // CORREÇÃO: A função salvar agora está DENTRO da classe
  salvar() {
    const dadosLocal = localStorage.getItem('usuarios');
    let usuarios = dadosLocal ? JSON.parse(dadosLocal) : [];

    if (this.isEdicao) {
      const index = usuarios.findIndex((u: any) => u.id === this.usuario.id);
      if (index !== -1) {
        usuarios[index] = { ...this.usuario };
      }
    } else {
      const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u: any) => u.id)) + 1 : 1;
      usuarios.push({ ...this.usuario, id: novoId });
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuário salvo com sucesso!');
    this.router.navigate(['/admin/usuarios']);
  }
}