import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';

@Component({
  selector: 'app-filme-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MenuLateral],
  templateUrl: './filme-form.html',
  styleUrl: './filme-form.css',
})
export class FilmeFormComponent implements OnInit {
  filme: any = { titulo: '', genero: '', ano: '', capa: '', descricao: '' }
  isEdicao: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');

    if (idStr && idStr !== 'novo') {
      this.isEdicao = true;
      const id = Number(idStr);
      this.carregarDadosDoFilme(id);
    } else {
      this.isEdicao = false;
      this.filme = { titulo: '', genero: '', capa: '', ano: '', descricao: '' };
    }
  }

  carregarDadosDoFilme(id: number) {
    const dados = localStorage.getItem('meusFilmes');

    if (dados) {
      const filmesDoBanco = JSON.parse(dados);

      const encontrado = filmesDoBanco.find((f: any) => f.id === id);

      if (encontrado) {
        this.filme = { ...encontrado };
      } else {
        alert('Filme não encontrado no banco local!');
        this.router.navigate(['/admin']);
      }
    } else {
      // caso o localStorage esteja vazio por algum motivo
      this.router.navigate(['/admin']);
    }
  }

  salvar() {
    const dadosLocal = localStorage.getItem('meusFilmes');
    let filmes = dadosLocal ? JSON.parse(dadosLocal) : [];

    if (this.isEdicao) {
      const index = filmes.findIndex((f: any) => f.id === this.filme.id);
      if (index !== -1) {
        filmes[index] = this.filme;
      }
    } else {
      const novoId = filmes.length > 0 ? Math.max(...filmes.map((f: any) => f.id)) + 1 : 1;

      const novoFilme = {
        ...this.filme,
        id: novoId
      };

      filmes.push(novoFilme);
      alert('Filme cadastrado com sucesso!')

    }

    localStorage.setItem('meusFilmes', JSON.stringify(filmes));

    alert('Salvo com sucesso no navegador!');
    this.router.navigate(['/admin']);
  }

}