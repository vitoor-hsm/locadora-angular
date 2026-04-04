import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { AuthService } from '../../../services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-adm',
  imports: [CommonModule, MenuLateral, RouterModule],
  templateUrl: './home-adm.html',
  styleUrl: './home-adm.css',
})
export class HomeAdm implements OnInit {
  listaFilmes: any[] = [];

  constructor() { }
  
  ngOnInit() {
    this.atualizarListaDaTela();
  }

  atualizarListaDaTela() {
    const dadosSalvos = localStorage.getItem('meusFilmes');
    
    if (dadosSalvos) {
      this.listaFilmes = JSON.parse(dadosSalvos);
    } else {
      this.listaFilmes = [
        { id: 1, titulo: 'Interestelar', genero: 'Ficção Científica', capa: 'https://m.media-amazon.com/images/I/71qzTzxzoCL.jpg', ano: 2014 },
        { id: 2, titulo: 'Batman', genero: 'Ação', capa: 'https://m.media-amazon.com/images/I/818hyvdVfvL._AC_SY679_.jpg', ano: 2008 }
      ];
      localStorage.setItem('meusFilmes', JSON.stringify(this.listaFilmes));
    }
  }

  remover(id: number) {
    if (confirm("tem certeza que deseja excluir este filme?")) {
      this.listaFilmes = this.listaFilmes.filter(f => f.id !== id);
      localStorage.setItem('meusFilmes', JSON.stringify(this.listaFilmes));
    }
  }


}
