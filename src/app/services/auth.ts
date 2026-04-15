import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users = [ //banco de dados simulado
    { login: 'admin', senha: '123', perfil: 'ADM' },
    { login: 'user', senha: '123', perfil: 'USER' }
  ];

  private usuarioLogado: any = null;

  constructor(private router: Router) { //quando o site carrega, o serviço "acorda" e olha no local storage 
    const salvo = localStorage.getItem('usuarioLogado');// se encontrar alguém lá, ele já loga o usuário 
    if (salvo) { //automaticamente para ele não precisar digitar a senha toda vez que der F5.
      this.usuarioLogado = JSON.parse(salvo);
    }

  }


  login(dados: any) {
    const user = this.users.find(u => u.login === dados.login && u.senha === dados.senha);
    //percorre a listade usuario procurando alguém que tenha o login E senha iguais ao BD simulado
    if (user) { // se tiver, ele salva no local storage, guarda na variavel "usuariologado" e usa o 
      this.usuarioLogado = user; // router.navigate para mandar cada perfil para sua home certa

      localStorage.setItem('usuarioLogado', JSON.stringify(user));

      if (user.perfil === 'ADM') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      } // se não achar ele manda esse alert
    } else {
      alert('Login ou senha inválidos')
    }

  }

  estaAutenticado(): boolean { // é usado pelo guard pra saber se alguem fez login
    return this.usuarioLogado !== null;
  }
  getPerfil(): String { // diz se o cara é adm ou user, é usado pelo menu lateral para esconder ou mostrarbott
    return this.usuarioLogado?.perfil;
  }

  logout() { // limpa tudo, apaga o localStorage, zera a variavel e manda o usuario de volta pro login
    this.usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/Login']);
  }

  private filmes = [ // lista de filmes mockada pra não iniciar sem nd
    { id: 1, titulo: 'Interestelar', genero: 'Ficção Científica', ano: 2014, capa: 'https://cdn.ome.lt/legacy/images/galerias/Interstellar/Interstellar-poster-11ago2014-01.jpg', favorito: false },
    { id: 2, titulo: 'Batman', genero: 'Ação', ano: 2008, capa: 'https://upload.wikimedia.org/wikipedia/pt/d/d1/The_Dark_Knight.jpg', favorito: false }
  ];
  getFilmes() { return this.filmes; }
  
  alternarFavorito(id: number) {
    const filme = this.filmes.find(f => f.id === id);
    if (filme) {
      filme.favorito = !filme.favorito;
    }
  }
  excluirFilme(id: number) {
    this.filmes = this.filmes.filter(f => f.id !== id);
  } // o filme que tiver o id igual ao id que passei cai na peneira e é cortado
}
