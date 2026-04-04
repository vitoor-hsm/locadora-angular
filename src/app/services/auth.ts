import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = [
    { login: 'admin', senha: '123', perfil: 'ADM' },
    { login: 'user', senha: '123', perfil: 'USER' }
  ];

  private usuarioLogado: any = null;

  constructor(private router: Router) { 

    const salvo = localStorage.getItem('usuarioLogado');
    if (salvo) {
    this.usuarioLogado = JSON.parse(salvo);
  }

  }

  
  login(dados: any) {
    const user = this.users.find(u => u.login === dados.login && u.senha === dados.senha);

    if (user) {
      this.usuarioLogado = user;

      localStorage.setItem('usuarioLogado', JSON.stringify(user));
      
      if (user.perfil === 'ADM') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }
    } else {
      alert('Login ou senha inválidos')
    }

  }

  estaAutenticado(): boolean {
    return this.usuarioLogado !== null;
  }
  getPerfil(): String {
    return this.usuarioLogado?.perfil;
  }

  logout() {
    this.usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/Login']);
  }

  private filmes = [
    { id: 1, titulo: 'Interestelar', genero: 'Ficção Científica', ano: 2014, capa: 'https://cdn.ome.lt/legacy/images/galerias/Interstellar/Interstellar-poster-11ago2014-01.jpg' },
    { id: 2, titulo: 'Batman', genero: 'Ação', ano: 2008, capa: 'https://upload.wikimedia.org/wikipedia/pt/d/d1/The_Dark_Knight.jpg' }
  ];
  getFilmes() { return this.filmes; }

  excluirFilme(id: number) {
    this.filmes = this.filmes.filter(f => f.id !== id);
  }
}
