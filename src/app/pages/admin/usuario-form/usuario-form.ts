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
  // objeto que armazena os dados do formulário (inicia com valores vazios e perfil USER)
  usuario: any = { nome: '', email: '', perfil: 'USER', telefone: '', dataCadastro: '' };
  isEdicao: boolean = false;

  constructor(
    private route: ActivatedRoute,// para capturar parâmetros da URL como o ID
    private router: Router
  ) { }

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id'); // captura o id

    if (idStr && idStr !== 'novo') { // se o ID existir e não for a palavra "novo", entra no modo de edição
      this.isEdicao = true;
      this.carregarDadosDoUsuario(Number(idStr)); //string pra numero
    } else {
      this.isEdicao = false; //preenche a data de cadastro automaticamente com a data de hoje 
      this.usuario.dataCadastro = new Date().toISOString().split('T')[0];
    }
  }

  // função para buscar um usuário específico no LocalStorage para edição
  carregarDadosDoUsuario(id: number) {
    const dados = localStorage.getItem('usuarios');
    if (dados) {
      const lista = JSON.parse(dados); //converte a string do LocalStorage para Array
      const encontrado = lista.find((u: any) => u.id === id); 
      

      if (encontrado) {// usa o Spread Operator (...) para criar uma cópia e não mexer no original por enquanto
        this.usuario = { ...encontrado };
      } else { // se o ID estiver na URL mas não existir no banco, volta para a lista
        alert('Usuário não encontrado!');
        this.router.navigate(['/admin/usuarios']);
      }
    }
  } 

  
  salvar() {
    const dadosLocal = localStorage.getItem('usuarios'); //pega os usuários já existentes ou cria um array vazio se não houver nenhum
    let usuarios = dadosLocal ? JSON.parse(dadosLocal) : [];

    if (this.isEdicao) { //encontra a posição pelo id
      const index = usuarios.findIndex((u: any) => u.id === this.usuario.id);
      if (index !== -1) {
        usuarios[index] = { ...this.usuario };
      }
    } else {//pega o maior ID da lista e soma 1. Se lista vazia, começa em 1.
      const novoId = usuarios.length > 0 ? Math.max(...usuarios.map((u: any) => u.id)) + 1 : 1;
      usuarios.push({ ...this.usuario, id: novoId });
    }
    // salva a lista atualizada de volta no LocalStorage (convertendo para String)
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuário salvo com sucesso!');
    this.router.navigate(['/admin/usuarios']);
  }
}